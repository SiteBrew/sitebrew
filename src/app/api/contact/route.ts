import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface Submission {
  name: string;
  email: string;
  businessType: string;
  message: string;
  receivedAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, businessType, message } = body as Submission;

    // Basic server-side validation
    if (!name || !email || !businessType || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const submission: Submission = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      businessType: businessType.trim(),
      message: message.trim(),
      receivedAt: new Date().toISOString(),
    };

    // ── Send email via Resend ─────────────────────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: "SiteBrew Leads <leads@sitebrew.co>",
        to: process.env.LEAD_NOTIFY_EMAIL ?? "hello@sitebrew.co",
        replyTo: submission.email,
        subject: `New proposal request from ${submission.name} (${submission.businessType})`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="color:#1f2e8c;margin-bottom:4px">New Lead from SiteBrew</h2>
            <p style="color:#888;font-size:13px;margin-top:0">${submission.receivedAt}</p>
            <table style="width:100%;border-collapse:collapse;margin-top:16px">
              <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#555;width:140px">Name</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${submission.name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#555">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="mailto:${submission.email}" style="color:#1f2e8c">${submission.email}</a></td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#555">Business Type</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${submission.businessType}</td></tr>
              <tr><td style="padding:10px 0;color:#555;vertical-align:top">Goals</td><td style="padding:10px 0">${submission.message.replace(/\n/g, "<br>")}</td></tr>
            </table>
            <p style="margin-top:24px">
              <a href="mailto:${submission.email}?subject=Re: Your SiteBrew proposal request" style="background:#1f2e8c;color:#fff;padding:10px 20px;border-radius:20px;text-decoration:none;font-size:14px">Reply to ${submission.name}</a>
            </p>
          </div>
        `,
      });
      if (emailError) {
        console.error("[SiteBrew] Resend error:", emailError);
      } else {
        console.log("[SiteBrew] Email sent, id:", emailData?.id);
      }
    } else {
      console.warn("[SiteBrew] RESEND_API_KEY not set — email notification skipped.");
    }

    console.log("[SiteBrew] New contact submission:", submission);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[SiteBrew] Contact submission error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
