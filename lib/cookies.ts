import { cookies } from "next/headers";
import { runtimeEnv } from "@/lib/env";

// Cookie key constants
export const COOKIE_KEYS = {
  SESSION: "session",
} as const;

// Cookie configuration constants
const SESSION_COOKIE_CONFIG = {
  httpOnly: true,
  secure: runtimeEnv.IS_PRODUCTION,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 5, // 5 days
  path: "/",
} as const;

/**
 * Sets the session cookie with the provided token
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_KEYS.SESSION, token, SESSION_COOKIE_CONFIG);
}

/**
 * Deletes/clears the session cookie
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_KEYS.SESSION);
}

/**
 * Gets the session cookie value
 */
export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_KEYS.SESSION)?.value;
}
