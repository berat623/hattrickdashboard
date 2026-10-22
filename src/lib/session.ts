import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { UserSession } from "@/types/hattrick";

const SESSION_COOKIE_NAME = "ht_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "hattrick-super-secret-dashboard-key-32chars-min!!"
);

export interface TokenPayload {
  user: UserSession;
  hattrickOAuth?: {
    accessToken: string;
    accessTokenSecret: string;
  };
  requestTokenSecret?: string;
  exp?: number;
}

const DEFAULT_USER: UserSession = {
  id: "guest",
  email: "",
  name: "Ziyaretçi",
  googleLoggedIn: false,
  hattrickConnected: false,
};

export async function createSession(data: Partial<TokenPayload>): Promise<string> {
  const current = await getSession();
  const payload: TokenPayload = {
    user: {
      ...(current?.user || DEFAULT_USER),
      ...(data.user || {}),
    },
    hattrickOAuth: data.hattrickOAuth ?? current?.hattrickOAuth,
    requestTokenSecret: data.requestTokenSecret ?? current?.requestTokenSecret,
  };

  const jwt = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return jwt;
}

export async function getSession(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<UserSession> {
  const session = await getSession();
  if (session?.user) {
    return session.user;
  }
  return DEFAULT_USER;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
