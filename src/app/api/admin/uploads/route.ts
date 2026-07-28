import { mkdir, readdir, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isInsideUploads, safeUploadPath, uploadsRoot } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  await mkdir(uploadsRoot, { recursive: true });
  const entries = await readdir(uploadsRoot, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const filePath = path.join(uploadsRoot, entry.name);
        const info = await stat(filePath);
        return {
          filename: entry.name,
          url: `/uploads/${entry.name}`,
          size: info.size,
          updatedAt: info.mtime.toISOString(),
        };
      }),
  );

  return Response.json({ files: files.sort((a, b) => a.filename.localeCompare(b.filename)) });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "An image file is required" }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return Response.json({ error: "Only JPEG, PNG, WebP, GIF and SVG images are allowed" }, { status: 400 });
  }

  await mkdir(uploadsRoot, { recursive: true });
  const filePath = safeUploadPath(`${Date.now()}-${file.name}`);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, bytes);

  return Response.json({
    ok: true,
    file: {
      filename: path.basename(filePath),
      url: `/uploads/${path.basename(filePath)}`,
      size: bytes.length,
    },
  });
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const url = new URL(request.url);
  const filename = url.searchParams.get("filename") || "";
  const filePath = safeUploadPath(filename);

  if (!isInsideUploads(filePath)) {
    return Response.json({ error: "Invalid upload path" }, { status: 400 });
  }

  await unlink(filePath);
  return Response.json({ ok: true });
}
