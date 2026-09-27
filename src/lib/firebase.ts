import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { 
  initializeFirestore, 
  doc, 
  getDocFromServer 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Primary Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDK13MJ6rO6PN3Z7siPdQqLIL6czkGyjCE",
  authDomain: "patowary-130b2.firebaseapp.com",
  projectId: "patowary-130b2",
  storageBucket: "patowary-130b2.firebasestorage.app",
  messagingSenderId: "46020954854",
  appId: "1:46020954854:web:17acd52c9d3a70cf188927",
  measurementId: "G-P2G6R9BJ7Z"
};

// Reusable singleton app instance
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Safe Analytics initialization - supports environments where analytics may not be supported
export let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn("Firebase Analytics is not supported in this environment:", err);
  });
}

// Authentication
export const auth = getAuth(app);

// Firestore instance
export const db = initializeFirestore(app, { 
  experimentalForceLongPolling: true 
});

// Storage instance
export const storage = getStorage(app);

// Validation check to see if database connection is live
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network status.", error);
    }
  }
}
testConnection();

// Dynamic Error Handling system
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
