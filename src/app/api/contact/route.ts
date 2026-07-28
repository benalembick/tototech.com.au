import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";

export const runtime = "nodejs";

const enquiryRecipient = "admin@tototech.com.au";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required to send contact form email.`);
  }
  return value;
}

function publicMailError(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  const command = typeof error === "object" && error && "command" in error ? String(error.command) : "";
  const message = error instanceof Error ? error.message : "";

  if (message.includes("SMTP_") && message.includes("required")) {
    return {
      status: 503,
      error: "Contact form email is not configured on the server.",
    };
  }

  if (code === "EAUTH" || command === "AUTH") {
    return {
      status: 502,
      error:
        "The mail server rejected the SMTP login. Check SMTP_USER and SMTP_PASSWORD; Gmail/Microsoft usually require an app password.",
    };
  }

  if (["ECONNECTION", "ETIMEDOUT", "ECONNREFUSED", "ENOTFOUND", "ESOCKET"].includes(code)) {
    return {
      status: 502,
      error: "The site could not connect to the configured SMTP server. Check SMTP_HOST, SMTP_PORT and SMTP_SECURE.",
    };
  }

  if (code === "EENVELOPE") {
    return {
      status: 502,
      error: "The mail server rejected the sender or recipient address. Check CONTACT_EMAIL_FROM is allowed by your SMTP account.",
    };
  }

  return {
    status: 500,
    error: "Unable to send enquiry email. Please try again or email us directly.",
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { success: false, errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const enquiry = result.data;

  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: requiredEnv("SMTP_HOST"),
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: {
        user: requiredEnv("SMTP_USER"),
        pass: requiredEnv("SMTP_PASSWORD"),
      },
    });

    const from = process.env.CONTACT_EMAIL_FROM || process.env.SMTP_USER || enquiryRecipient;
    const subject = `Website Enquiry - ${enquiry.name.trim()}`;
    const text = [
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Company: ${enquiry.company}`,
      `Phone: ${enquiry.phone || "Not provided"}`,
      "",
      "Message:",
      enquiry.message,
    ].join("\n");

    const html = `
      <h2>Website enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(enquiry.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(enquiry.email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(enquiry.company)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(enquiry.phone || "Not provided")}</p>
      <hr />
      <p>${escapeHtml(enquiry.message).replace(/\n/g, "<br />")}</p>
    `;

    await transporter.sendMail({
      to: enquiryRecipient,
      from,
      replyTo: enquiry.email,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact enquiry:", error);
    const publicError = publicMailError(error);
    return NextResponse.json(
      { success: false, error: publicError.error },
      { status: publicError.status },
    );
  }
}
