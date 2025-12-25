import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseApp } from "./firebaseConfig";

// Initialize Auth with AsyncStorage persistence for React Native
// Use getAuth if already initialized, otherwise initializeAuth
let auth;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error: any) {
  // Auth already initialized, get the existing instance
  // Firebase throws an error if auth is already initialized
  if (error.code === 'auth/already-initialized' || error.message?.includes('already been initialized')) {
    auth = getAuth(firebaseApp);
  } else {
    // Re-throw if it's a different error
    throw error;
  }
}

export { auth };

