import {
  clearAdminSession,
  getAdminSession,
  isAdminAuthConfigured,
  setAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const maxAttempts = 6;
const windowMs = 15 * 60 * 1000;

export async function GET() {
  const session = await getAdminSession();
  return Response.json({
    authenticated: Boolean(session),
    email: session?.email || null,
    configured: isAdminAuthConfigured(),
  });
}


export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return Response.json(
      { error: "CMS_ADMIN_PASSWORD must be set before admin login is enabled." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email || "";
  const key = loginKey(request, email);

  if (isRateLimited(key)) {
    return Response.json({ error: "Too many login attempts. Please wait and try again." }, { status: 429 });
  }

  if (!body?.email || !body.password || !verifyAdminCredentials(body.email, body.password)) {
    recordFailedAttempt(key);
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  loginAttempts.delete(key);
  await setAdminSession(body.email);
  return Response.json({ authenticated: true, email: body.email.trim().toLowerCase() });
}

export async function DELETE() {
  await clearAdminSession();
  return Response.json({ authenticated: false });
}

function loginKey(request: Request, email: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  return `${ip}:${email.trim().toLowerCase()}`;
}

function isRateLimited(key: string) {
  const attempt = loginAttempts.get(key);
  if (!attempt) return false;
  if (Date.now() > attempt.resetAt) {
    loginAttempts.delete(key);
    return false;
  }
  return attempt.count >= maxAttempts;
}

function recordFailedAttempt(key: string) {
  const existing = loginAttempts.get(key);
  if (!existing || Date.now() > existing.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: Date.now() + windowMs });
    return;
  }
  loginAttempts.set(key, { ...existing, count: existing.count + 1 });
}
