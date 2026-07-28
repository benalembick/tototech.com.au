import { clearAdminSession, isAdminAuthenticated, setAdminSession, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ authenticated: await isAdminAuthenticated() });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;

  if (!body?.password || !verifyAdminPassword(body.password)) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  await setAdminSession();
  return Response.json({ authenticated: true });
}

export async function DELETE() {
  await clearAdminSession();
  return Response.json({ authenticated: false });
}
