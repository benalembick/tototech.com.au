import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "tototech_admin";
const defaultAdminEmail = "benalembick@gmail.com";
const sessionMaxAgeSeconds = 60 * 60 * 12;

type SessionPayload = {
  email: string;
  issuedAt: number;
};

function adminPassword() {
  return process.env.CMS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "";
}

function allowedAdminEmails() {
  const configured = process.env.CMS_ADMIN_EMAILS || process.env.CMS_ADMIN_EMAIL || defaultAdminEmail;

  return configured
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

function authSecret() {
  return process.env.CMS_SESSION_SECRET || adminPassword();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hmac(value: string) {
  return createHmac("sha256", authSecret()).update(value).digest("base64url");
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(value: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<SessionPayload>;
    if (!parsed.email || typeof parsed.issuedAt !== "number") return null;
    return {
      email: normalizeEmail(parsed.email),
      issuedAt: parsed.issuedAt,
    };
  } catch {
    return null;
  }
}

function createSessionToken(email: string) {
  const payload = encodePayload({
    email: normalizeEmail(email),
    issuedAt: Date.now(),
  });

  return `${payload}.${hmac(payload)}`;
}

function verifySessionToken(token: string) {
  if (!adminPassword() || !authSecret()) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeCompare(signature, hmac(payload))) return null;

  const session = decodePayload(payload);
  if (!session) return null;

  const expired = Date.now() - session.issuedAt > sessionMaxAgeSeconds * 1000;
  if (expired) return null;

  if (!allowedAdminEmails().includes(session.email)) return null;

  return session;
}

export function isAdminAuthConfigured() {
  return Boolean(adminPassword());
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession());
}

export function verifyAdminCredentials(email: string, password: string) {
  const configuredPassword = adminPassword();
  const normalizedEmail = normalizeEmail(email);

  if (!configuredPassword || !normalizedEmail || !password) return false;
  if (!allowedAdminEmails().includes(normalizedEmail)) return false;

  return safeCompare(password, configuredPassword);
}

export async function setAdminSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, createSessionToken(email), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}
