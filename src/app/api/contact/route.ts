import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";

export async function POST(request: Request) {
  const body = await request.json();
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { success: false, errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Wire this up to an email/CRM provider (e.g. Resend, SendGrid, HubSpot) when credentials are available.
  console.log("New contact enquiry:", result.data);

  return NextResponse.json({ success: true });
}
