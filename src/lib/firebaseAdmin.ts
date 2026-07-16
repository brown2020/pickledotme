import "server-only";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

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
function getFirebaseAdminApp() {
  if (!getApps().length) {
    if (!hasFirebaseAdminConfig()) {
      throw new Error(
        "Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY."
      );
    }

    return initializeApp({
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

  return getApp();
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminFirestore() {
  return getFirestore(getFirebaseAdminApp());
}
