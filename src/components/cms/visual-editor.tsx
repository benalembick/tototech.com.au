"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TipTapLink from "@tiptap/extension-link";
import TipTapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

type CmsFile = {
  section: "pages" | "posts" | "settings";
  slug: string;
  path: string;
};

type EditableTarget = {
  file: string;
  section: CmsFile["section"];
  slug: string;
  path: string;
  label: string;
  type: "text" | "rich" | "rich-array" | "link" | "image" | "collection";
  required: boolean;
  multiline: boolean;
  collectionIndex: number | null;
};

type Upload = {
  filename: string;
  url: string;
  size: number;
};

type DraftMap = Record<string, unknown>;

const pageFiles: Record<string, string> = {
  "/": "pages/home",
  "/about": "pages/about",
  "/contact": "pages/contact",
  "/services": "pages/services",
  "/industries": "pages/industries",
  "/projects": "pages/projects",
  "/insights": "posts/insights",
  "/privacy-policy": "settings/site",
};

function parseFile(file: string): CmsFile {
  const [section, slug] = file.split("/");
  return {
    section: section as CmsFile["section"],
    slug,
    path: `${section}/${slug}.json`,
  };
}

function getByPath(source: unknown, path: string) {
  if (!path) return source;
  return path.split(".").reduce<unknown>((current, part) => {
    if (current == null) return undefined;
    const key = /^\d+$/.test(part) ? Number(part) : part;
    return (current as Record<string | number, unknown>)[key];
  }, source);
}

function setByPath(source: unknown, path: string, value: unknown) {
  if (!path) return value;
  const clone = structuredClone(source) as Record<string, unknown>;
  const parts = path.split(".");
  let cursor: Record<string | number, unknown> = clone;

  parts.slice(0, -1).forEach((part) => {
    const key = /^\d+$/.test(part) ? Number(part) : part;
    const next = cursor[key];
    if (next == null || typeof next !== "object") cursor[key] = {};
    cursor = cursor[key] as Record<string | number, unknown>;
  });

  const finalKey = parts.at(-1)!;
  cursor[/^\d+$/.test(finalKey) ? Number(finalKey) : finalKey] = value;
  return clone;
}

function isSafeUrl(value: string) {
  return (
    value === "" ||
    value.startsWith("/") ||
    value.startsWith("#") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    /^https?:\/\//i.test(value)
  );
}

function displayValue(value: unknown) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return JSON.stringify(value, null, 2);
}

function valueForEditor(value: unknown, type: EditableTarget["type"]) {
  if (type === "rich-array" && Array.isArray(value)) {
    return value.map((entry) => `<p>${displayValue(entry)}</p>`).join("");
  }

  return displayValue(value);
}

function richHtmlToArray(value: string) {
  if (typeof DOMParser === "undefined") return [value];
  const doc = new DOMParser().parseFromString(value, "text/html");
  const blocks = Array.from(doc.body.children);

  if (blocks.length === 0) {
    const text = doc.body.textContent?.trim();
    return text ? [text] : [];
  }

  return blocks
    .map((element) => element.innerHTML.trim())
    .filter(Boolean);
}

export function VisualEditor() {
  const [authenticated, setAuthenticated] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(false);
  const [target, setTarget] = useState<EditableTarget | null>(null);
  const [drafts, setDrafts] = useState<DraftMap>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [fieldValue, setFieldValue] = useState("");
  const [fieldLoaded, setFieldLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const selectedElementRef = useRef<HTMLElement | null>(null);

  const currentFile = typeof window === "undefined" ? "" : pageFiles[window.location.pathname] || "";
  const hasDirty = dirty.size > 0;

  useEffect(() => {
    void fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-cms-edit-mode", editMode && !preview);
  }, [editMode, preview]);

  useEffect(() => {
    if (!authenticated) return;
    void loadUploads();
  }, [authenticated]);

  useEffect(() => {
    if (!editMode || preview) return;

    function onClick(event: MouseEvent) {
      const element = (event.target as HTMLElement).closest<HTMLElement>("[data-cms-editable]");
      if (!element) return;
      event.preventDefault();
      event.stopPropagation();
      const file = element.dataset.cmsFile || "";
      if (!file) return;
      const parsed = parseFile(file);
      selectedElementRef.current = element;
      setFieldLoaded(false);
      setFieldValue("");
      setTarget({
        file,
        section: parsed.section,
        slug: parsed.slug,
        path: element.dataset.cmsPath || "",
        label: element.dataset.cmsLabel || "Editable content",
        type: (element.dataset.cmsType as EditableTarget["type"]) || "text",
        required: element.dataset.cmsRequired === "true",
        multiline: element.dataset.cmsMultiline === "true",
        collectionIndex: element.dataset.cmsCollectionIndex
          ? Number(element.dataset.cmsCollectionIndex)
          : null,
      });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [editMode, preview]);

  useEffect(() => {
    if (!target) return;
    void ensureDraft(target.file).then((content) => {
      const value = getByPath(content, target.path);
      setFieldValue(valueForEditor(value, target.type));
      setFieldLoaded(true);
    });
    // ensureDraft intentionally reads the latest draft map for the selected target.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  async function ensureDraft(file: string) {
    if (drafts[file] !== undefined) return drafts[file];
    const parsed = parseFile(file);
    const res = await fetch(`/api/admin/content?section=${parsed.section}&slug=${parsed.slug}`);
    const data = await res.json();
    const content = data.content ?? {};
    setDrafts((current) => ({ ...current, [file]: content }));
    return content;
  }

  async function loadUploads() {
    const res = await fetch("/api/admin/uploads");
    if (!res.ok) return;
    const data = await res.json();
    setUploads(data.files || []);
  }

  function updateDraft(file: string, path: string, value: unknown) {
    setDrafts((current) => {
      const base = current[file] ?? {};
      return { ...current, [file]: setByPath(base, path, value) };
    });
    setDirty((current) => new Set(current).add(file));
    setMessage("Unsaved changes");
  }

  function saveField() {
    if (!target) return;
    let value: unknown = fieldValue;
    if (target.type === "rich-array") {
      value = richHtmlToArray(fieldValue);
    }
    if (target.type === "collection") {
      try {
        value = JSON.parse(fieldValue);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Invalid JSON for collection item.");
        return;
      }
    }
    if (target.type === "link") {
      try {
        const link = JSON.parse(fieldValue) as { href?: string; label?: string };
        if (!isSafeUrl(link.href || "")) {
          setMessage("Links must be internal, # anchors, mailto, tel, http or https.");
          return;
        }
        value = link;
      } catch {
        setMessage("Link fields must be valid JSON.");
        return;
      }
    }
    if (target.type === "collection") {
      const slug = value && typeof value === "object" ? (value as { slug?: unknown }).slug : undefined;
      if (typeof slug === "string" && !/^[a-z0-9][a-z0-9-_]*$/i.test(slug)) {
        setMessage("Slugs can contain letters, numbers, hyphens and underscores only.");
        return;
      }
    }
    updateDraft(target.file, target.path, value);
    previewElement(target, value);
    setTarget(null);
  }

  function previewElement(activeTarget: EditableTarget, value: unknown) {
    const element = selectedElementRef.current;
    if (!element) return;
    if (activeTarget.type === "rich") element.innerHTML = String(value || "");
    if (activeTarget.type === "rich-array") element.innerHTML = fieldValue;
    if (activeTarget.type === "text") element.textContent = String(value || "");
    if (activeTarget.type === "link" && value && typeof value === "object") {
      const link = value as { label?: string; href?: string };
      element.textContent = link.label || "";
      const anchor = element.closest("a");
      if (anchor && link.href) anchor.setAttribute("href", link.href);
    }
    if (activeTarget.type === "image") {
      const img = element.matches("img") ? element : element.querySelector("img");
      if (img && value) img.setAttribute("src", String(value));
    }
  }

  function mutateCollection(action: "add" | "duplicate" | "delete" | "up" | "down") {
    if (!target || target.collectionIndex == null) return;
    const collectionPath = /^\d+$/.test(target.path) ? "" : target.path.replace(/\.\d+$/, "");
    const draft = drafts[target.file];
    const collection = getByPath(draft, collectionPath);
    if (!Array.isArray(collection)) return;

    const next = [...collection];
    const index = target.collectionIndex;
    if (action === "add") next.splice(index + 1, 0, blankItemFrom(next[index]));
    if (action === "duplicate") next.splice(index + 1, 0, structuredClone(next[index]));
    if (action === "delete" && confirm(`Delete ${target.label}?`)) next.splice(index, 1);
    if (action === "up" && index > 0) [next[index - 1], next[index]] = [next[index], next[index - 1]];
    if (action === "down" && index < next.length - 1) [next[index], next[index + 1]] = [next[index + 1], next[index]];

    updateDraft(target.file, collectionPath, next);
    setTarget(null);
  }

  function blankItemFrom(item: unknown) {
    if (!item || typeof item !== "object") return "";
    const clone = structuredClone(item) as Record<string, unknown>;
    Object.keys(clone).forEach((key) => {
      if (key === "slug") clone[key] = `new-item-${Date.now()}`;
      else if (key === "title" || key === "label") clone[key] = "New item";
      else if (typeof clone[key] === "string") clone[key] = "";
      else if (Array.isArray(clone[key])) clone[key] = [];
    });
    return clone;
  }

  async function saveAll() {
    for (const file of dirty) {
      const parsed = parseFile(file);
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ section: parsed.section, slug: parsed.slug, content: drafts[file] }),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || `Could not save ${parsed.path}`);
        return;
      }
    }
    setDirty(new Set());
    setMessage("Changes saved. Refreshing preview...");
    window.location.reload();
  }

  async function discardAll() {
    if (hasDirty && !confirm("Discard all unsaved visual edits?")) return;
    setDrafts({});
    setDirty(new Set());
    setTarget(null);
    setMessage("Changes discarded.");
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/";
  }

  function toggleEditMode() {
    setEditMode((value) => {
      const next = !value;
      if (next) setPreview(false);
      return next;
    });
  }

  function togglePreview() {
    setPreview((value) => {
      const next = !value;
      if (next) {
        setEditMode(false);
        setTarget(null);
      }
      return next;
    });
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.[0] || !target) return;
    const url = await uploadImageFromFile(event.target.files[0]);
    if (url) setFieldValue(url);
  }

  async function uploadImageFromFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/uploads", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Could not upload image.");
      return null;
    }
    await loadUploads();
    return data.file.url as string;
  }

  const panelTitle = useMemo(() => target?.label || "Edit content", [target]);

  if (!authenticated) return null;

  return (
    <>
      <div className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 flex-wrap items-center gap-2 rounded-2xl border border-navy-900/10 bg-white/95 p-2 text-sm shadow-[0_24px_80px_-24px_rgba(11,24,54,0.35)] backdrop-blur-xl">
        <button
          onClick={toggleEditMode}
          className={`rounded-xl px-3 py-2 font-semibold ${editMode ? "bg-electric-600 text-white" : "bg-grey-100 text-navy-900"}`}
        >
          Edit Mode {editMode ? "On" : "Off"}
        </button>
        <button
          onClick={togglePreview}
          className={`rounded-xl px-3 py-2 font-semibold ${preview ? "bg-navy-900 text-white" : "bg-grey-100 text-navy-900"}`}
        >
          {preview ? "Preview On" : "Preview"}
        </button>
        <button
          onClick={saveAll}
          disabled={!hasDirty}
          className="rounded-xl bg-navy-900 px-3 py-2 font-semibold text-white disabled:opacity-40"
        >
          Save changes
        </button>
        <button
          onClick={discardAll}
          disabled={!hasDirty}
          className="rounded-xl border border-navy-900/10 px-3 py-2 font-semibold text-navy-900 disabled:opacity-40"
        >
          Discard
        </button>
        <Link href="/admin" className="rounded-xl border border-navy-900/10 px-3 py-2 font-semibold text-navy-900">
          Open full admin
        </Link>
        <button onClick={logout} className="rounded-xl border border-red-500/30 px-3 py-2 font-semibold text-red-600">
          Log out
        </button>
        <span className="px-2 text-xs text-navy-900/55">
          {currentFile ? `${currentFile}.json` : "No mapped page"}{" "}
          {preview ? "• Preview: clicking paused" : editMode ? "• Click outlined content to edit" : "• Turn Edit Mode on to edit"}{" "}
          {hasDirty ? "• Unsaved changes" : "• Saved"}
        </span>
      </div>

      {message && (
        <div className="fixed right-5 top-24 z-[100] max-w-sm rounded-xl bg-navy-950 px-4 py-3 text-sm text-white shadow-lg">
          {message}
        </div>
      )}

      {target && (
        <div className="fixed inset-0 z-[110] bg-navy-950/45 p-4 backdrop-blur-sm" onClick={() => setTarget(null)}>
          <form
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              saveField();
            }}
            onClick={(event) => event.stopPropagation()}
            className="ml-auto mt-16 max-h-[calc(100vh-7rem)] w-full max-w-xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-electric-600">
              {target.file}.json · {target.path}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-navy-900">{panelTitle}</h2>

            {!fieldLoaded ? (
              <div className="mt-5 rounded-xl border border-navy-900/10 bg-grey-50 p-6 text-sm text-navy-900/60">
                Loading selected content...
              </div>
            ) : target.type === "rich" || target.type === "rich-array" ? (
              <RichTextEditor
                key={`${target.file}:${target.path}`}
                value={fieldValue}
                uploads={uploads}
                onChange={setFieldValue}
                onUploadImage={uploadImageFromFile}
                onMessage={setMessage}
              />
            ) : target.type === "image" ? (
              <div className="mt-5 space-y-4">
                {fieldValue && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fieldValue} alt="" className="h-52 w-full rounded-xl object-cover" />
                )}
                <input
                  value={fieldValue}
                  onChange={(event) => setFieldValue(event.target.value)}
                  className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                  placeholder="/uploads/image.webp"
                />
                <input type="file" accept="image/*" onChange={uploadImage} className="text-sm" />
                <select
                  value={fieldValue}
                  onChange={(event) => setFieldValue(event.target.value)}
                  className="w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
                >
                  <option value="">Choose existing upload...</option>
                  {uploads.map((upload) => (
                    <option key={upload.filename} value={upload.url}>
                      {upload.url}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <textarea
                value={fieldValue}
                onChange={(event) => setFieldValue(event.target.value)}
                className="mt-5 min-h-32 w-full rounded-xl border border-navy-900/15 px-3 py-2 font-mono text-sm leading-relaxed outline-none focus:border-electric-500"
              />
            )}

            {target.type === "collection" && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => mutateCollection("up")} className="rounded-lg bg-grey-100 px-3 py-2 text-xs font-semibold">
                  Move up
                </button>
                <button type="button" onClick={() => mutateCollection("down")} className="rounded-lg bg-grey-100 px-3 py-2 text-xs font-semibold">
                  Move down
                </button>
                <button type="button" onClick={() => mutateCollection("duplicate")} className="rounded-lg bg-grey-100 px-3 py-2 text-xs font-semibold">
                  Duplicate
                </button>
                <button type="button" onClick={() => mutateCollection("add")} className="rounded-lg bg-grey-100 px-3 py-2 text-xs font-semibold">
                  Add item after
                </button>
                <button type="button" onClick={() => mutateCollection("delete")} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  Delete item
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setTarget(null)} className="rounded-xl border border-navy-900/10 px-4 py-2 text-sm font-semibold">
                Cancel
              </button>
              <button className="rounded-xl bg-electric-600 px-4 py-2 text-sm font-semibold text-white">
                Preview in page
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function RichTextEditor({
  value,
  uploads,
  onChange,
  onUploadImage,
  onMessage,
}: {
  value: string;
  uploads: Upload[];
  onChange: (value: string) => void;
  onUploadImage: (file: File) => Promise<string | null>;
  onMessage: (value: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TipTapLink.configure({
        autolink: true,
        openOnClick: false,
        protocols: ["http", "https", "mailto", "tel"],
        HTMLAttributes: {
          rel: "noopener noreferrer",
        },
      }),
      TipTapImage.configure({
        allowBase64: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-56 rounded-xl border border-navy-900/15 p-4 text-sm leading-relaxed outline-none focus:border-electric-500",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  function setLink() {
    if (!editor) return;
    const current = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link URL", current || "https://");
    if (href === null) return;
    if (!href) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    if (!isSafeUrl(href)) {
      onMessage("Links must be internal, # anchors, mailto, tel, http or https.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  function addImage(src: string) {
    if (!editor || !src) return;
    editor.chain().focus().setImage({ src }).run();
  }

  async function uploadRichImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await onUploadImage(file);
    if (url) addImage(url);
    event.target.value = "";
  }

  const buttonClass = "rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-navy-900";
  const activeButtonClass = "rounded-lg bg-electric-600 px-3 py-1.5 text-xs font-semibold text-white";

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-2 rounded-xl border border-navy-900/10 bg-grey-50 p-2">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={buttonClass}>
          Undo
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={buttonClass}>
          Redo
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? activeButtonClass : buttonClass}>
          Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? activeButtonClass : buttonClass}>
          Italic
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? activeButtonClass : buttonClass}>
          Underline
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? activeButtonClass : buttonClass}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive("heading", { level: 3 }) ? activeButtonClass : buttonClass}>
          H3
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? activeButtonClass : buttonClass}>
          Bullets
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? activeButtonClass : buttonClass}>
          Numbers
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? activeButtonClass : buttonClass}>
          Quote
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={editor.isActive({ textAlign: "left" }) ? activeButtonClass : buttonClass}>
          Left
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={editor.isActive({ textAlign: "center" }) ? activeButtonClass : buttonClass}>
          Center
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={editor.isActive({ textAlign: "right" }) ? activeButtonClass : buttonClass}>
          Right
        </button>
        <button type="button" onClick={setLink} className={editor.isActive("link") ? activeButtonClass : buttonClass}>
          Link
        </button>
        <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} className={buttonClass}>
          Unlink
        </button>
        <select
          onChange={(event) => {
            addImage(event.target.value);
            event.target.value = "";
          }}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-navy-900"
        >
          <option value="">Insert image...</option>
          {uploads.map((upload) => (
            <option key={upload.filename} value={upload.url}>
              {upload.filename}
            </option>
          ))}
        </select>
        <label className="cursor-pointer rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-navy-900">
          Upload image
          <input type="file" accept="image/*" onChange={uploadRichImage} className="hidden" />
        </label>
        <button type="button" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} className={buttonClass}>
          Clear formatting
        </button>
      </div>
      <EditorContent editor={editor} className="cms-rich-editor mt-3" />
    </div>
  );
}
