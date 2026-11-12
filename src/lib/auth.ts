import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import connectToDatabase from "./db";
import User from "./models/User";

const JWT_SECRET = process.env.AUTH_SECRET || "devtrack-default-jwt-secret-min-32-chars-long";
const COOKIE_NAME = "devtrack_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch (e) {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(req?: NextRequest): Promise<SessionPayload | null> {
  // 1. Check Bearer token from header
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);
      if (payload) return payload;
    }
  }

  // 2. Check cookies
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      const payload = verifyToken(token);
      if (payload) return payload;
    }
  } catch {}

  return null;
}

export async function ensureDefaultDemoUser() {
  await connectToDatabase();
  const defaultEmail = process.env.DEVTRACK_USER_EMAIL || "adityakumar07024@gmail.com";
  const defaultName = process.env.DEVTRACK_USER_NAME || "Aditya07024";

  let user = await User.findOne({ email: defaultEmail.toLowerCase() });
  if (!user) {
    const hashedPassword = await hashPassword("DevTrack2025!");
    user = await User.create({
      email: defaultEmail.toLowerCase(),
      password: hashedPassword,
      name: defaultName,
      role: "user",
    });
  }
  return user;
}
