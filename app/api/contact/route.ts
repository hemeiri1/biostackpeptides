import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend("re_UERzjhTv_AsudSTaXQM8HFYwXn3DJ369f");

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    await resend.emails.send({
      from: "BioStack Peptides <onboarding@resend.dev>",
      to: "Contact@biostackpeptide.com",
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; padding: 20px;">
          <h2 style="color: #1B3A5C;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
