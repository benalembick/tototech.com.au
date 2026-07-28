import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "tototech_admin";

function adminPassword() {
  return process.env.CMS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "changeme";
}

function authSecret() {
  return process.env.CMS_SESSION_SECRET || adminPassword();
}

function sessionToken() {
  return createHmac("sha256", authSecret()).update("tototech-file-cms-session").digest("hex");
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  return Boolean(token && safeCompare(token, sessionToken()));
}

export function verifyAdminPassword(password: string) {
  return safeCompare(password, adminPassword());
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}
