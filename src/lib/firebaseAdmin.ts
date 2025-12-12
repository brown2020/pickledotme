import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getOptionalEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

export function hasFirebaseAdminConfig() {
  return Boolean(
    getOptionalEnv("FIREBASE_ADMIN_PROJECT_ID") &&
      getOptionalEnv("FIREBASE_ADMIN_CLIENT_EMAIL") &&
      getOptionalEnv("FIREBASE_ADMIN_PRIVATE_KEY")
  );
}

/**
 * Firebase Admin initialization.
 *
 * Expects the following env vars:
 * - FIREBASE_ADMIN_PROJECT_ID
 * - FIREBASE_ADMIN_CLIENT_EMAIL
 * - FIREBASE_ADMIN_PRIVATE_KEY (with \\n escaped newlines)
 */
export function getFirebaseAdminAuth() {
  if (!getApps().length) {
    if (!hasFirebaseAdminConfig()) {
      throw new Error(
        "Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY."
      );
    }

    initializeApp({
      credential: cert({
        projectId: getOptionalEnv("FIREBASE_ADMIN_PROJECT_ID")!,
        clientEmail: getOptionalEnv("FIREBASE_ADMIN_CLIENT_EMAIL")!,
        privateKey: getOptionalEnv("FIREBASE_ADMIN_PRIVATE_KEY")!.replace(
          /\\n/g,
          "\n"
        ),
      }),
    });
  }

  return getAuth();
}
