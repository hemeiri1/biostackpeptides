import { Resend } from "resend";

const resend = new Resend("re_UERzjhTv_AsudSTaXQM8HFYwXn3DJ369f");

export async function sendVerificationEmail(to: string, name: string, code: string) {
  try {
    await resend.emails.send({
      from: "BioStack Peptides <noreply@biostackpeptide.com>",
      to,
      subject: "Verify Your BioStack Account",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1B3A5C; font-size: 24px; margin: 0;">BioStack Peptides</h1>
            <p style="color: #5B9BD5; font-size: 12px; letter-spacing: 2px; margin: 4px 0 0;">PEPTIDES</p>
          </div>

          <p style="color: #333; font-size: 15px;">Hi ${name},</p>
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            Welcome to BioStack Peptides! Use the verification code below to activate your account:
          </p>

          <div style="background: #f0f7ff; border: 1px solid #d0e3f5; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <p style="color: #888; font-size: 12px; margin: 0 0 8px;">Your verification code</p>
            <p style="color: #1B3A5C; font-size: 32px; font-weight: 800; letter-spacing: 6px; margin: 0;">${code}</p>
          </div>

          <p style="color: #555; font-size: 13px; line-height: 1.6;">
            This code expires in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="color: #999; font-size: 11px; text-align: center;">
            BioStack Peptides — Premium Research Peptides<br>
            biostackpeptide.com | Contact@biostackpeptide.com
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: "BioStack Peptides <noreply@biostackpeptide.com>",
      to,
      subject: "Welcome to BioStack Peptides!",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1B3A5C; font-size: 24px; margin: 0;">BioStack Peptides</h1>
            <p style="color: #5B9BD5; font-size: 12px; letter-spacing: 2px; margin: 4px 0 0;">PEPTIDES</p>
          </div>

          <p style="color: #333; font-size: 15px;">Hi ${name},</p>
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            Your account is now verified! Welcome to the BioStack family.
          </p>

          <div style="background: #f0f7ff; border: 1px solid #d0e3f5; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="color: #1B3A5C; font-size: 14px; font-weight: 600; margin: 0 0 12px;">Loyalty Rewards Program</p>
            <table style="width: 100%; font-size: 13px; color: #555;">
              <tr><td style="padding: 4px 0;">Earn points</td><td style="text-align: right; font-weight: 600; color: #1B3A5C;">1 pt per AED 10 spent</td></tr>
              <tr><td style="padding: 4px 0;">Stack bonus</td><td style="text-align: right; font-weight: 600; color: #1B3A5C;">+25 pts per stack</td></tr>
              <tr><td style="padding: 4px 0;">Write a review</td><td style="text-align: right; font-weight: 600; color: #1B3A5C;">+20 pts</td></tr>
              <tr><td style="padding: 4px 0;">Every 5 orders</td><td style="text-align: right; font-weight: 600; color: #1B3A5C;">AED 50 bonus</td></tr>
              <tr><td style="padding: 4px 0;">Spend AED 1K/month</td><td style="text-align: right; font-weight: 600; color: #1B3A5C;">AED 75 bonus</td></tr>
              <tr><td style="padding: 4px 0;">Refer a friend</td><td style="text-align: right; font-weight: 600; color: #1B3A5C;">AED 25 each</td></tr>
            </table>
            <p style="color: #5B9BD5; font-size: 12px; margin: 12px 0 0;">Climb tiers: Bronze → Silver (1.5x pts) → Gold (2x pts)</p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://biostackpeptide.com/products" style="background: #0066FF; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Shop Now
            </a>
          </div>

          <p style="color: #555; font-size: 13px;">
            Use code <strong>BIOSTACK10</strong> for 10% off your first order!
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="color: #999; font-size: 11px; text-align: center;">
            BioStack Peptides — Premium Research Peptides<br>
            biostackpeptide.com | Contact@biostackpeptide.com
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Welcome email failed:", error);
    return false;
  }
}
