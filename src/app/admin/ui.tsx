"use client";

/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CmsFile = {
  section: "pages" | "posts" | "settings";
  slug: string;
  filename: string;
  path: string;
};

type Upload = {
  filename: string;
  url: string;
  size: number;
  updatedAt?: string;
};

const emptyJson = "{\n  \n}";

export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("benalembick@gmail.com");
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<CmsFile[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [selected, setSelected] = useState<CmsFile | null>(null);
  const [editor, setEditor] = useState(emptyJson);
  const [newSection, setNewSection] = useState<CmsFile["section"]>("pages");
  const [newSlug, setNewSlug] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const selectedKey = useMemo(
    () => (selected ? `${selected.section}/${selected.slug}` : "new"),
    [selected],
  );

  async function refreshSession() {
    const res = await fetch("/api/admin/session");
    const data = await res.json();
    setAuthenticated(Boolean(data.authenticated));
    if (data.authenticated) {
      await Promise.all([loadFiles(), loadUploads()]);
    }
  }

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setMessage(data?.error || "That email and password combination did not work.");
      return;
    }

    setEmail("");
    setPassword("");
    setAuthenticated(true);
    await Promise.all([loadFiles(), loadUploads()]);
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setSelected(null);
    setEditor(emptyJson);
  }

  async function loadFiles() {
    const res = await fetch("/api/admin/content");
    if (!res.ok) return;
    const data = await res.json();
    setFiles(data.files || []);
  }

  async function loadUploads() {
    const res = await fetch("/api/admin/uploads");
    if (!res.ok) return;
    const data = await res.json();
    setUploads(data.files || []);
  }

  useEffect(() => {
    void refreshSession();
  }, []);

  async function openFile(file: CmsFile) {
    setBusy(true);
    setMessage("");
    const res = await fetch(`/api/admin/content?section=${file.section}&slug=${file.slug}`);
    const data = await res.json();
    setSelected(file);
    setNewSection(file.section);
    setNewSlug(file.slug);
    setEditor(JSON.stringify(data.content ?? {}, null, 2));
    setBusy(false);
  }

  function startNew() {
    setSelected(null);
    setNewSection("pages");
    setNewSlug("");
    setEditor(emptyJson);
    setMessage("Creating a new JSON content file.");
  }

  async function saveContent() {
    setBusy(true);
    setMessage("");

    let content: unknown;
    try {
      content = JSON.parse(editor);
    } catch (error) {
      setBusy(false);
      setMessage(error instanceof Error ? error.message : "Invalid JSON.");
      return;
    }

    const section = selected?.section || newSection;
    const slug = selected?.slug || newSlug.trim();
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ section, slug, content }),
    });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setMessage(data.error || "Could not save content.");
      return;
    }

    setFiles(data.files || []);
    setSelected({ section, slug, filename: `${slug}.json`, path: `${section}/${slug}.json` });
    setMessage(`Saved ${section}/${slug}.json.`);
  }

  async function deleteContent() {
    if (!selected || !confirm(`Delete ${selected.path}?`)) return;
    setBusy(true);
    const res = await fetch(
      `/api/admin/content?section=${selected.section}&slug=${selected.slug}`,
      { method: "DELETE" },
    );
    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setMessage(data.error || "Could not delete content.");
      return;
    }

    setFiles(data.files || []);
    startNew();
    setMessage(`Deleted ${selected.path}.`);
  }

  async function uploadImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("file") as HTMLInputElement | null;
    if (!input?.files?.[0]) return;

    setBusy(true);
    const formData = new FormData();
    formData.append("file", input.files[0]);
    const res = await fetch("/api/admin/uploads", { method: "POST", body: formData });
    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setMessage(data.error || "Could not upload image.");
      return;
    }

    input.value = "";
    await loadUploads();
    setMessage(`Uploaded ${data.file.url}.`);
  }

  async function deleteUpload(filename: string) {
    if (!confirm(`Delete ${filename}?`)) return;
    const res = await fetch(`/api/admin/uploads?filename=${encodeURIComponent(filename)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Could not delete upload.");
      return;
    }
    await loadUploads();
    setMessage(`Deleted ${filename}.`);
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-grey-50 px-6 py-32">
        <form
          onSubmit={login}
          className="mx-auto max-w-md rounded-2xl border border-navy-900/10 bg-white p-8 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-electric-600">
            TOTOTECH CMS
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-navy-900">Admin login</h1>
          <p className="mt-3 text-sm leading-relaxed text-navy-900/60">
            Enter your authorised admin email address and CMS password to edit local JSON content and uploaded images.
          </p>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-6 w-full rounded-xl border border-navy-900/15 px-4 py-3 text-sm outline-none focus:border-electric-500"
            placeholder="Email address"
            autoComplete="username"
            required
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-3 w-full rounded-xl border border-navy-900/15 px-4 py-3 text-sm outline-none focus:border-electric-500"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <button
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Checking..." : "Log in"}
          </button>
          {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-grey-50 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-electric-600">
              TOTOTECH CMS
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy-900">
              File-based admin
            </h1>
            <p className="mt-3 text-sm text-navy-900/60">
              Edit JSON in <code>content/</code> and upload images to <code>public/uploads/</code>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl bg-electric-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(37,99,235,0.65)] transition-colors hover:bg-electric-500"
            >
              Edit website visually
            </Link>
            <button onClick={logout} className="rounded-xl border border-navy-900/15 px-4 py-2 text-sm">
              Log out
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-electric-400/25 bg-white px-4 py-3 text-sm text-navy-900/70">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr_320px]">
          <aside className="rounded-2xl border border-navy-900/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-navy-900">Content</h2>
              <button onClick={startNew} className="rounded-lg bg-grey-100 px-3 py-1.5 text-xs font-semibold">
                New
              </button>
            </div>
            <div className="mt-4 space-y-1">
              {files.map((file) => (
                <button
                  key={file.path}
                  onClick={() => openFile(file)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                    selectedKey === `${file.section}/${file.slug}`
                      ? "bg-navy-900 text-white"
                      : "text-navy-900/70 hover:bg-grey-50"
                  }`}
                >
                  {file.path}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border border-navy-900/10 bg-white p-5">
            <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
              <select
                value={newSection}
                onChange={(event) => setNewSection(event.target.value as CmsFile["section"])}
                disabled={Boolean(selected)}
                className="rounded-xl border border-navy-900/15 px-3 py-2 text-sm disabled:bg-grey-50"
              >
                <option value="pages">pages</option>
                <option value="posts">posts</option>
                <option value="settings">settings</option>
              </select>
              <input
                value={newSlug}
                onChange={(event) => setNewSlug(event.target.value)}
                disabled={Boolean(selected)}
                placeholder="slug"
                className="rounded-xl border border-navy-900/15 px-3 py-2 text-sm disabled:bg-grey-50"
              />
            </div>
            <textarea
              value={editor}
              onChange={(event) => setEditor(event.target.value)}
              spellCheck={false}
              className="mt-4 h-[560px] w-full resize-y rounded-xl border border-navy-900/15 bg-navy-950 p-4 font-mono text-sm leading-relaxed text-white outline-none focus:border-electric-400"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={saveContent}
                disabled={busy}
                className="rounded-xl bg-electric-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Save JSON
              </button>
              {selected && (
                <button
                  onClick={deleteContent}
                  disabled={busy}
                  className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-50"
                >
                  Delete file
                </button>
              )}
            </div>
          </section>

          <aside className="rounded-2xl border border-navy-900/10 bg-white p-5">
            <h2 className="font-display text-lg font-bold text-navy-900">Images</h2>
            <form onSubmit={uploadImage} className="mt-4 space-y-3">
              <input name="file" type="file" accept="image/*" className="w-full text-sm" />
              <button className="w-full rounded-xl bg-navy-900 px-4 py-2 text-sm font-semibold text-white">
                Upload image
              </button>
            </form>
            <div className="mt-5 space-y-3">
              {uploads.map((upload) => (
                <div key={upload.filename} className="rounded-xl border border-navy-900/10 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={upload.url} alt="" className="h-28 w-full rounded-lg object-cover" />
                  <code className="mt-2 block break-all text-xs text-navy-900/60">{upload.url}</code>
                  <button
                    onClick={() => deleteUpload(upload.filename)}
                    className="mt-2 text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
