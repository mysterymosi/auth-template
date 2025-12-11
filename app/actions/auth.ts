"use server";

import { redirect } from "next/navigation";
import { setSessionCookie, deleteSessionCookie } from "@/lib/cookies";
import { ROUTES } from "@/lib/constants";
import { clientEnv } from "@/lib/env";

export type AuthState = {
  error?: string;
  success?: boolean;
};

// Firebase Auth API Response Types
type FirebaseAuthError = {
  code: number;
  message: string;
  errors: Array<{
    message: string;
    domain: string;
    reason: string;
  }>;
};

type FirebaseAuthErrorResponse = {
  error: FirebaseAuthError;
};

type FirebaseAuthSuccessResponse = {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
};

type FirebaseAuthResponse =
  | FirebaseAuthErrorResponse
  | FirebaseAuthSuccessResponse;

function isErrorResponse(
  data: FirebaseAuthResponse
): data is FirebaseAuthErrorResponse {
  return "error" in data;
}

export async function loginAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validation
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (!email.includes("@")) {
    return { error: "Please enter a valid email address" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    // Sign in with email and password using Firebase Admin SDK
    // Note: Firebase Admin SDK doesn't have signInWithEmailAndPassword
    // We need to use the REST API or Firebase Client SDK for authentication
    // For server-side, we'll use the REST API approach

    // Use Firebase REST API to sign in
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = (await response.json()) as FirebaseAuthResponse;

    if (!response.ok || isErrorResponse(data)) {
      const errorData = data as FirebaseAuthErrorResponse;
      const errorMessage =
        errorData.error.message === "INVALID_LOGIN_CREDENTIALS"
          ? "Invalid email or password"
          : "Authentication failed. Please try again.";
      return { error: errorMessage };
    }

    const successData = data as FirebaseAuthSuccessResponse;

    // Set session cookie
    // Note: Token verification happens in middleware/protected routes when the token is used
    await setSessionCookie(successData.idToken);

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function registerAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation
  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (!email.includes("@")) {
    return { error: "Please enter a valid email address" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    // Use Firebase REST API to create user
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = (await response.json()) as FirebaseAuthResponse;

    if (!response.ok || isErrorResponse(data)) {
      const errorData = data as FirebaseAuthErrorResponse;
      const errorMessage =
        errorData.error.message === "EMAIL_EXISTS"
          ? "An account with this email already exists"
          : errorData.error.message === "INVALID_EMAIL"
          ? "Please enter a valid email address"
          : errorData.error.message === "WEAK_PASSWORD"
          ? "Password is too weak"
          : errorData.error.message === "OPERATION_NOT_ALLOWED"
          ? "Email/password accounts are not enabled. Please contact support."
          : "Registration failed. Please try again.";
      return { error: errorMessage };
    }

    const successData = data as FirebaseAuthSuccessResponse;

    // Set session cookie
    // Note: Token verification happens in middleware/protected routes when the token is used
    await setSessionCookie(successData.idToken);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function logoutAction() {
  await deleteSessionCookie();
  redirect(ROUTES.LOGIN);
}
