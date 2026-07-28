import "server-only";

import { mkdir, readdir, readFile, rename, unlink, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const contentRoot = path.join(process.cwd(), "content");
export const uploadsRoot = path.join(process.cwd(), "public", "uploads");

const allowedSections = new Set(["pages", "posts", "settings"]);

export interface CmsFile {
  section: "pages" | "posts" | "settings";
  slug: string;
  filename: string;
  path: string;
}

export async function ensureCmsDirectories() {
  await Promise.all([
    mkdir(path.join(contentRoot, "pages"), { recursive: true }),
    mkdir(path.join(contentRoot, "posts"), { recursive: true }),
    mkdir(path.join(contentRoot, "settings"), { recursive: true }),
    mkdir(uploadsRoot, { recursive: true }),
  ]);
}

export function safeContentPath(section: string, slug: string) {
  if (!allowedSections.has(section)) {
    throw new Error("Invalid content section");
  }

  const cleanSlug = slug.replace(/\.json$/i, "");
  if (!/^[a-z0-9][a-z0-9-_]*$/i.test(cleanSlug)) {
    throw new Error("Invalid content slug");
  }

  return path.join(contentRoot, section, `${cleanSlug}.json`);
}

export async function readJsonFile<T>(section: string, slug: string, fallback: T): Promise<T> {
  await ensureCmsDirectories();

  try {
    const filePath = safeContentPath(section, slug);
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile(section: string, slug: string, value: unknown) {
  await ensureCmsDirectories();
  const filePath = safeContentPath(section, slug);
  const tmpPath = `${filePath}.${Date.now()}.tmp`;
  const serialized = `${JSON.stringify(sanitizeCmsValue(value), null, 2)}\n`;
  await writeFile(tmpPath, serialized, "utf8");
  await rename(tmpPath, filePath);
}

const allowedHtmlTags = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "h2",
  "h3",
  "h4",
  "img",
]);

function sanitizeCmsString(value: string) {
  return value
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/\s+javascript\s*:/gi, "")
    .replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (match, tagName: string, attrs: string) => {
      const tag = tagName.toLowerCase();
      if (!allowedHtmlTags.has(tag)) return "";
      if (tag === "img") {
        if (match.startsWith("</")) return "";
        const src = getHtmlAttr(attrs, "src");
        if (!src || !isSafeImageSrc(src)) return "";
        const alt = escapeHtmlAttr(getHtmlAttr(attrs, "alt") || "");
        return `<img src="${escapeHtmlAttr(src)}" alt="${alt}">`;
      }

      const style = safeTextAlignStyle(attrs);
      if (tag !== "a") return match.startsWith("</") ? `</${tag}>` : `<${tag}${style}>`;

      const href = getHtmlAttr(attrs, "href");
      if (!isSafeHref(href)) return match.startsWith("</") ? "</a>" : "<a>";

      return match.startsWith("</") ? "</a>" : `<a href="${escapeHtmlAttr(href)}" rel="noopener noreferrer">`;
    });
}

function getHtmlAttr(attrs: string, name: string) {
  const match = attrs.match(new RegExp(`\\s+${name}\\s*=\\s*(['"])(.*?)\\1`, "i"));
  return match?.[2] || "";
}

function safeTextAlignStyle(attrs: string) {
  const style = getHtmlAttr(attrs, "style");
  const align = style.match(/text-align\s*:\s*(left|center|right|justify)/i)?.[1]?.toLowerCase();
  return align ? ` style="text-align: ${align}"` : "";
}

function escapeHtmlAttr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isSafeHref(value: string) {
  return (
    value.startsWith("/") ||
    value.startsWith("#") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    /^https?:\/\//i.test(value)
  );
}

function isSafeImageSrc(value: string) {
  return value.startsWith("/uploads/") || /^https?:\/\//i.test(value);
}

function sanitizeCmsValue(value: unknown): unknown {
  if (typeof value === "string") return sanitizeCmsString(value);
  if (Array.isArray(value)) return value.map(sanitizeCmsValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, sanitizeCmsValue(entry)]),
    );
  }
  return value;
}

export async function deleteJsonFile(section: string, slug: string) {
  await ensureCmsDirectories();
  await unlink(safeContentPath(section, slug));
}

export async function listContentFiles(): Promise<CmsFile[]> {
  await ensureCmsDirectories();
  const sections = Array.from(allowedSections) as CmsFile["section"][];
  const files = await Promise.all(
    sections.map(async (section) => {
      const dir = path.join(contentRoot, section);
      const entries = await readdir(dir, { withFileTypes: true });
      return entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
        .map((entry) => ({
          section,
          slug: entry.name.replace(/\.json$/i, ""),
          filename: entry.name,
          path: `${section}/${entry.name}`,
        }));
    }),
  );

  return files.flat().sort((a, b) => a.path.localeCompare(b.path));
}

export function safeUploadPath(filename: string) {
  const clean = filename.replace(/[^a-z0-9._-]/gi, "-").replace(/-+/g, "-").toLowerCase();
  if (!clean || clean.startsWith(".")) {
    throw new Error("Invalid upload filename");
  }

  return path.join(uploadsRoot, clean);
}

export function isInsideUploads(filePath: string) {
  const relative = path.relative(uploadsRoot, filePath);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

export function uploadExists(filename: string) {
  return existsSync(safeUploadPath(filename));
}
