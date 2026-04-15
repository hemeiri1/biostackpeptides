// Auth system backed by Upstash Redis for persistence

const UPSTASH_URL = "https://devoted-gorilla-69499.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAQ97AAIncDE2Y2VlODA1ZDJhOWQ0MGQ2Yjg0NWIzMWQyNmQzYjE5YXAxNjk0OTk";

export type LoyaltyTier = "Bronze" | "Silver" | "Gold";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  verified: boolean;
  verifyCode: string;
  loyaltyPoints: number;
  orderCount: number;
  bonusCredit: number;
  totalSpent: number;
  monthlySpent: number;
  monthlySpentMonth: string;
  tier: LoyaltyTier;
  referralCode: string;
  referredBy: string;
  birthday: string;
  birthdayRewardUsed: string;
  lastOrderDate: string;
  reviewCount: number;
  createdAt: string;
}

// Redis helpers
async function redisGet(key: string): Promise<string | null> {
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    const data = await res.json();
    return data.result;
  } catch {
    return null;
  }
}

async function redisSet(key: string, value: string) {
  await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(["SET", key, value]),
  });
}

async function redisCommand(command: string[]) {
  const res = await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  return res.json();
}

async function saveUser(user: User) {
  await redisSet(`user:${user.id}`, JSON.stringify(user));
  if (user.email) await redisSet(`user-email:${user.email}`, user.id);
  if (user.phone) await redisSet(`user-phone:${user.phone}`, user.id);
  if (user.referralCode) await redisSet(`user-referral:${user.referralCode}`, user.id);
}

async function getUserById(id: string): Promise<User | null> {
  const data = await redisGet(`user:${id}`);
  return data ? JSON.parse(data) : null;
}

async function getUserByEmail(email: string): Promise<User | null> {
  const id = await redisGet(`user-email:${email}`);
  if (!id) return null;
  return getUserById(id);
}

async function getUserByPhone(phone: string): Promise<User | null> {
  const id = await redisGet(`user-phone:${phone}`);
  if (!id) return null;
  return getUserById(id);
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

// Multiplier (stored in Redis)
export async function setPointsMultiplier(multiplier: number, expiresAt: string) {
  await redisSet("points-multiplier", JSON.stringify({ multiplier, expiresAt }));
}

export async function getPointsMultiplier(): Promise<{ multiplier: number; expiresAt: string }> {
  const data = await redisGet("points-multiplier");
  if (!data) return { multiplier: 1, expiresAt: "" };
  const parsed = JSON.parse(data);
  if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
    return { multiplier: 1, expiresAt: "" };
  }
  return parsed;
}

export async function createUser(email: string | undefined, name: string, password: string, phone?: string, birthday?: string, referralCode?: string): Promise<User> {
  if (!email && !phone) throw new Error("Email or phone number is required");

  if (email) {
    const existing = await getUserByEmail(email);
    if (existing) throw new Error("Email already registered");
  }
  if (phone) {
    const existing = await getUserByPhone(phone);
    if (existing) throw new Error("Phone number already registered");
  }

  const id = "usr_" + Math.random().toString(36).substring(2, 10);
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

  const user: User = {
    id,
    email: email || "",
    name,
    password,
    phone: phone || "",
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

  await saveUser(user);

  // If referred by someone, give both AED 25
  if (referralCode) {
    const referrerId = await redisGet(`user-referral:${referralCode}`);
    if (referrerId) {
      const referrer = await getUserById(referrerId);
      if (referrer) {
        referrer.bonusCredit += 25;
        user.bonusCredit += 25;
        await saveUser(referrer);
        await saveUser(user);
      }
    }
  }

  return user;
}

export async function loginUser(email: string | undefined, password: string, phone?: string): Promise<{ user: User; token: string }> {
  const user = phone
    ? await getUserByPhone(phone)
    : email ? await getUserByEmail(email) : null;

  if (!user) throw new Error(phone ? "No account found with this phone number" : "No account found with this email");
  if (user.password !== password) throw new Error("Incorrect password");
  if (!user.verified) throw new Error("Please verify your email first");

  const token = "sess_" + Math.random().toString(36).substring(2, 15) + Date.now();
  await redisSet(`session:${token}`, user.id);

  return { user, token };
}

export async function verifyUser(email: string | undefined, code: string, phone?: string, skipCode?: boolean): Promise<boolean> {
  const user = phone
    ? await getUserByPhone(phone)
    : email ? await getUserByEmail(email) : null;

  if (!user) throw new Error("User not found");
  if (!skipCode && user.verifyCode !== code) throw new Error("Invalid verification code");

  user.verified = true;
  await saveUser(user);
  return true;
}

export async function getUserByToken(token: string): Promise<User | null> {
  const userId = await redisGet(`session:${token}`);
  if (!userId) return null;
  return getUserById(userId);
}

export async function addOrder(userId: string, orderTotal: number, hasStack: boolean): Promise<User> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  user.orderCount++;
  user.totalSpent += orderTotal;
  user.lastOrderDate = new Date().toISOString();

  const currentMonth = new Date().toISOString().slice(0, 7);
  if (user.monthlySpentMonth !== currentMonth) {
    user.monthlySpent = 0;
    user.monthlySpentMonth = currentMonth;
  }
  user.monthlySpent += orderTotal;

  let points = Math.floor(orderTotal / 10);
  if (hasStack) points += 25;

  const tierMult = getTierMultiplier(user.tier);
  points = Math.floor(points * tierMult);

  const { multiplier } = await getPointsMultiplier();
  points = Math.floor(points * multiplier);

  user.loyaltyPoints += points;

  if (user.orderCount % 5 === 0) user.bonusCredit += 50;
  if (user.monthlySpent >= 1000 && (user.monthlySpent - orderTotal) < 1000) user.bonusCredit += 75;

  user.tier = calculateTier(user.totalSpent);
  await saveUser(user);
  return user;
}

export async function addReviewPoints(userId: string): Promise<User> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  user.reviewCount++;
  user.loyaltyPoints += 20;
  await saveUser(user);
  return user;
}

export async function checkBirthdayReward(userId: string): Promise<{ eligible: boolean; code?: string }> {
  const user = await getUserById(userId);
  if (!user || !user.birthday) return { eligible: false };

  const today = new Date();
  const birthday = new Date(user.birthday);
  const currentYear = today.getFullYear().toString();

  const bMonth = birthday.getMonth();
  const bDay = birthday.getDate();
  const thisYearBday = new Date(today.getFullYear(), bMonth, bDay);
  const diffDays = Math.abs(Math.floor((today.getTime() - thisYearBday.getTime()) / (1000 * 60 * 60 * 24)));

  if (diffDays <= 3 && user.birthdayRewardUsed !== currentYear) {
    user.birthdayRewardUsed = currentYear;
    await saveUser(user);
    const code = "BDAY-" + user.referralCode.slice(4, 8);
    return { eligible: true, code };
  }

  return { eligible: false };
}

export async function getUserByReferralCode(code: string): Promise<User | null> {
  const id = await redisGet(`user-referral:${code}`);
  if (!id) return null;
  return getUserById(id);
}

export async function logout(token: string) {
  await redisCommand(["DEL", `session:${token}`]);
}
