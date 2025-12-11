/**
 * Environment variables configuration
 * Validates and provides type-safe access to environment variables
 */

// Server-side environment variables (only available in server components/actions)
const getServerEnv = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID is required but not set");
  }

  if (!clientEmail) {
    throw new Error("FIREBASE_CLIENT_EMAIL is required but not set");
  }

  if (!privateKey) {
    throw new Error("FIREBASE_PRIVATE_KEY is required but not set");
  }

  return {
    FIREBASE_PROJECT_ID: projectId,
    FIREBASE_CLIENT_EMAIL: clientEmail,
    FIREBASE_PRIVATE_KEY: privateKey.replace(/\\n/g, "\n"),
  };
};

// Client-side environment variables (available in both server and client)
const getClientEnv = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is required but not set");
  }

  return {
    NEXT_PUBLIC_FIREBASE_API_KEY: apiKey,
  };
};

// Runtime environment
const getRuntimeEnv = () => {
  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    IS_PRODUCTION: process.env.NODE_ENV === "production",
    IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  };
};

// Export server-side env (only callable in server context)
export const serverEnv = getServerEnv();

// Export client-side env (safe to use anywhere)
export const clientEnv = getClientEnv();

// Export runtime env
export const runtimeEnv = getRuntimeEnv();

// Combined exports for convenience
export const env = {
  ...serverEnv,
  ...clientEnv,
  ...runtimeEnv,
} as const;
