import { deleteJsonFile, listContentFiles, readJsonFile, writeJsonFile } from "@/lib/cms";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

function paramsFromUrl(request: Request) {
  const url = new URL(request.url);
  return {
    section: url.searchParams.get("section") || "",
    slug: url.searchParams.get("slug") || "",
  };
}

export async function GET(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { section, slug } = paramsFromUrl(request);
  if (!section || !slug) {
    return Response.json({ files: await listContentFiles() });
  }

  const content = await readJsonFile(section, slug, null);
  return Response.json({ section, slug, content });
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as
    | { section?: string; slug?: string; content?: unknown }
    | null;

  if (!body?.section || !body.slug || body.content === undefined) {
    return Response.json({ error: "section, slug and content are required" }, { status: 400 });
  }

  await writeJsonFile(body.section, body.slug, body.content);
  return Response.json({ ok: true, files: await listContentFiles() });
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { section, slug } = paramsFromUrl(request);
  if (!section || !slug) {
    return Response.json({ error: "section and slug are required" }, { status: 400 });
  }

  await deleteJsonFile(section, slug);
  return Response.json({ ok: true, files: await listContentFiles() });
}
