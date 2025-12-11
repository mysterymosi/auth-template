import {
  initializeApp,
  getApps,
  cert,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { serverEnv } from "@/lib/env";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  const serviceAccount: ServiceAccount = {
    projectId: serverEnv.FIREBASE_PROJECT_ID,
    clientEmail: serverEnv.FIREBASE_CLIENT_EMAIL,
    privateKey: serverEnv.FIREBASE_PRIVATE_KEY,
  };

  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminAuth = getAuth();

// Helper to verify session token
export async function verifySessionToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch {
    return null;
  }
}
