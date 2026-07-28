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
  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(tmpPath, serialized, "utf8");
  await rename(tmpPath, filePath);
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
