// Simple auth system — upgrade to a real DB later (Supabase, Firebase, etc.)

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
  createdAt: string;
}

// In-memory user store — upgrade to Vercel KV or database for persistence
const users: Map<string, User> = new Map();
const sessions: Map<string, string> = new Map(); // sessionToken -> userId

export function createUser(email: string, name: string, password: string): User {
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
    createdAt: new Date().toISOString(),
  };

  users.set(id, user);
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

export function addOrder(userId: string): User {
  const user = users.get(userId);
  if (!user) throw new Error("User not found");

  user.orderCount++;
  user.loyaltyPoints += 10; // 10 points per order

  // Every 5 orders = 50 AED bonus credit
  if (user.orderCount % 5 === 0) {
    user.bonusCredit += 50;
  }

  return user;
}

export function logout(token: string) {
  sessions.delete(token);
}
