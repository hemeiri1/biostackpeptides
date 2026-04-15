// Simple auth system — upgrade to a real DB later (Supabase, Firebase, etc.)

export type LoyaltyTier = "Bronze" | "Silver" | "Gold";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In production, use bcrypt hash
  verified: boolean;
  verifyCode: string;
  loyaltyPoints: number;
  orderCount: number;
  bonusCredit: number; // AED
  totalSpent: number; // AED lifetime
  monthlySpent: number; // AED this month
  monthlySpentMonth: string; // e.g. "2026-04"
  tier: LoyaltyTier;
  referralCode: string;
  referredBy: string; // referral code of the person who referred them
  birthday: string; // YYYY-MM-DD
  birthdayRewardUsed: string; // year string like "2026" to track yearly usage
  lastOrderDate: string;
  reviewCount: number;
  createdAt: string;
}

// In-memory user store — upgrade to Vercel KV or database for persistence
const users: Map<string, User> = new Map();
const sessions: Map<string, string> = new Map(); // sessionToken -> userId

// Multiplier event — admin can set this
let pointsMultiplier = 1;
let multiplierExpiry = "";

export function setPointsMultiplier(multiplier: number, expiresAt: string) {
  pointsMultiplier = multiplier;
  multiplierExpiry = expiresAt;
}

export function getPointsMultiplier(): { multiplier: number; expiresAt: string } {
  if (multiplierExpiry && new Date(multiplierExpiry) < new Date()) {
    pointsMultiplier = 1;
    multiplierExpiry = "";
  }
  return { multiplier: pointsMultiplier, expiresAt: multiplierExpiry };
}

function calculateTier(totalSpent: number): LoyaltyTier {
  if (totalSpent >= 3000) return "Gold";
  if (totalSpent >= 1000) return "Silver";
  return "Bronze";
}

function getTierMultiplier(tier: LoyaltyTier): number {
  if (tier === "Gold") return 2;
  if (tier === "Silver") return 1.5;
  return 1;
}

function generateReferralCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4);
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BSP-${clean}${rand}`;
}

export function createUser(email: string, name: string, password: string, birthday?: string, referralCode?: string): User {
  const existing = Array.from(users.values()).find((u) => u.email === email);
  if (existing) throw new Error("Email already registered");

  const id = "usr_" + Math.random().toString(36).substring(2, 10);
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

  const user: User = {
    id,
    email,
    name,
    password,
    verified: false,
    verifyCode,
    loyaltyPoints: 0,
    orderCount: 0,
    bonusCredit: 0,
    totalSpent: 0,
    monthlySpent: 0,
    monthlySpentMonth: new Date().toISOString().slice(0, 7),
    tier: "Bronze",
    referralCode: generateReferralCode(name),
    referredBy: referralCode || "",
    birthday: birthday || "",
    birthdayRewardUsed: "",
    lastOrderDate: "",
    reviewCount: 0,
    createdAt: new Date().toISOString(),
  };

  users.set(id, user);

  // If referred by someone, give both AED 25
  if (referralCode) {
    const referrer = Array.from(users.values()).find((u) => u.referralCode === referralCode);
    if (referrer) {
      referrer.bonusCredit += 25;
      user.bonusCredit += 25;
    }
  }

  return user;
}

export function loginUser(email: string, password: string): { user: User; token: string } {
  const user = Array.from(users.values()).find((u) => u.email === email);
  if (!user) throw new Error("No account found with this email");
  if (user.password !== password) throw new Error("Incorrect password");
  if (!user.verified) throw new Error("Please verify your email first");

  const token = "sess_" + Math.random().toString(36).substring(2, 15) + Date.now();
  sessions.set(token, user.id);

  return { user, token };
}

export function verifyUser(email: string, code: string): boolean {
  const user = Array.from(users.values()).find((u) => u.email === email);
  if (!user) throw new Error("User not found");
  if (user.verifyCode !== code) throw new Error("Invalid verification code");

  user.verified = true;
  return true;
}

export function getUserByToken(token: string): User | null {
  const userId = sessions.get(token);
  if (!userId) return null;
  return users.get(userId) || null;
}

export function addOrder(userId: string, orderTotal: number, hasStack: boolean): User {
  const user = users.get(userId);
  if (!user) throw new Error("User not found");

  user.orderCount++;
  user.totalSpent += orderTotal;
  user.lastOrderDate = new Date().toISOString();

  // Reset monthly spend if new month
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (user.monthlySpentMonth !== currentMonth) {
    user.monthlySpent = 0;
    user.monthlySpentMonth = currentMonth;
  }
  user.monthlySpent += orderTotal;

  // Calculate points: 1 point per AED 10 spent
  let points = Math.floor(orderTotal / 10);

  // Stack bonus: +25 points for buying a stack
  if (hasStack) {
    points += 25;
  }

  // Apply tier multiplier
  const tierMult = getTierMultiplier(user.tier);
  points = Math.floor(points * tierMult);

  // Apply event multiplier
  const { multiplier } = getPointsMultiplier();
  points = Math.floor(points * multiplier);

  user.loyaltyPoints += points;

  // Every 5 orders = 50 AED bonus credit
  if (user.orderCount % 5 === 0) {
    user.bonusCredit += 50;
  }

  // Monthly spend threshold: AED 1000+ = extra AED 75
  if (user.monthlySpent >= 1000 && (user.monthlySpent - orderTotal) < 1000) {
    user.bonusCredit += 75;
  }

  // Update tier
  user.tier = calculateTier(user.totalSpent);

  return user;
}

export function addReviewPoints(userId: string): User {
  const user = users.get(userId);
  if (!user) throw new Error("User not found");

  user.reviewCount++;
  user.loyaltyPoints += 20;

  return user;
}

export function checkBirthdayReward(userId: string): { eligible: boolean; code?: string } {
  const user = users.get(userId);
  if (!user || !user.birthday) return { eligible: false };

  const today = new Date();
  const birthday = new Date(user.birthday);
  const currentYear = today.getFullYear().toString();

  // Check if birthday is within 3 days
  const bMonth = birthday.getMonth();
  const bDay = birthday.getDate();
  const thisYearBday = new Date(today.getFullYear(), bMonth, bDay);
  const diffDays = Math.abs(Math.floor((today.getTime() - thisYearBday.getTime()) / (1000 * 60 * 60 * 24)));

  if (diffDays <= 3 && user.birthdayRewardUsed !== currentYear) {
    user.birthdayRewardUsed = currentYear;
    const code = "BDAY-" + user.referralCode.slice(4, 8);
    return { eligible: true, code };
  }

  return { eligible: false };
}

export function getUserByReferralCode(code: string): User | null {
  return Array.from(users.values()).find((u) => u.referralCode === code) || null;
}

export function logout(token: string) {
  sessions.delete(token);
}
