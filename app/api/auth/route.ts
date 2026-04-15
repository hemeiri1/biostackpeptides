import { NextResponse } from "next/server";
import {
  createUser,
  loginUser,
  verifyUser,
  getUserByToken,
  logout,
  addReviewPoints,
  checkBirthdayReward,
  getUserByReferralCode,
  setPointsMultiplier,
  getPointsMultiplier,
} from "@/lib/auth";
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/email";

function userPayload(user: any) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    loyaltyPoints: user.loyaltyPoints,
    orderCount: user.orderCount,
    bonusCredit: user.bonusCredit,
    totalSpent: user.totalSpent,
    monthlySpent: user.monthlySpent,
    tier: user.tier,
    referralCode: user.referralCode,
    referredBy: user.referredBy,
    birthday: user.birthday,
    lastOrderDate: user.lastOrderDate,
    reviewCount: user.reviewCount,
  };
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;

  try {
    if (action === "signup") {
      const user = createUser(body.email, body.name, body.password, body.phone, body.birthday, body.referralCode);

      // Send verification email
      await sendVerificationEmail(body.email, body.name, user.verifyCode);

      return NextResponse.json({
        success: true,
        message: "Account created! Check your email for the verification code.",
        bonusApplied: user.bonusCredit > 0 ? "AED 25 referral bonus applied!" : undefined,
      });
    }

    if (action === "verify") {
      verifyUser(body.email, body.code);

      // Send welcome email
      await sendWelcomeEmail(body.email, body.name || "");

      return NextResponse.json({ success: true, message: "Email verified! You can now log in." });
    }

    if (action === "login") {
      const { user, token } = loginUser(body.email, body.password, body.phone);

      // Check birthday reward
      const birthday = checkBirthdayReward(user.id);

      return NextResponse.json({
        success: true,
        token,
        user: userPayload(user),
        birthdayReward: birthday.eligible ? birthday.code : undefined,
      });
    }

    if (action === "me") {
      const user = getUserByToken(body.token);
      if (!user) return NextResponse.json({ success: false, message: "Not authenticated" });
      return NextResponse.json({
        success: true,
        user: userPayload(user),
      });
    }

    if (action === "review") {
      const user = getUserByToken(body.token);
      if (!user) return NextResponse.json({ success: false, message: "Not authenticated" });
      const updated = addReviewPoints(user.id);
      return NextResponse.json({
        success: true,
        message: "Thanks for your review! +20 loyalty points",
        user: userPayload(updated),
      });
    }

    if (action === "check-referral") {
      const referrer = getUserByReferralCode(body.code);
      if (!referrer) return NextResponse.json({ success: false, message: "Invalid referral code" });
      return NextResponse.json({
        success: true,
        message: `Referred by ${referrer.name.split(" ")[0]}! You'll both get AED 25 credit.`,
      });
    }

    if (action === "set-multiplier") {
      setPointsMultiplier(body.multiplier, body.expiresAt);
      return NextResponse.json({ success: true, message: `Points multiplier set to ${body.multiplier}x` });
    }

    if (action === "get-multiplier") {
      const { multiplier, expiresAt } = getPointsMultiplier();
      return NextResponse.json({ success: true, multiplier, expiresAt });
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
