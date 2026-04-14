import { NextResponse } from "next/server";
import { createUser, loginUser, verifyUser, getUserByToken, logout } from "@/lib/auth";
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;

  try {
    if (action === "signup") {
      const user = createUser(body.email, body.name, body.password);

      // Send verification email
      await sendVerificationEmail(body.email, body.name, user.verifyCode);

      return NextResponse.json({
        success: true,
        message: "Account created! Check your email for the verification code.",
      });
    }

    if (action === "verify") {
      verifyUser(body.email, body.code);

      // Send welcome email
      await sendWelcomeEmail(body.email, body.name || "");

      return NextResponse.json({ success: true, message: "Email verified! You can now log in." });
    }

    if (action === "login") {
      const { user, token } = loginUser(body.email, body.password);
      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          loyaltyPoints: user.loyaltyPoints,
          orderCount: user.orderCount,
          bonusCredit: user.bonusCredit,
        },
      });
    }

    if (action === "me") {
      const user = getUserByToken(body.token);
      if (!user) return NextResponse.json({ success: false, message: "Not authenticated" });
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          loyaltyPoints: user.loyaltyPoints,
          orderCount: user.orderCount,
          bonusCredit: user.bonusCredit,
        },
      });
    }

    if (action === "logout") {
      logout(body.token);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Unknown action" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
