import { initializeAuth, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseApp } from "./firebaseConfig";

// For React Native, Firebase handles persistence automatically
// We use getAuth which works for both web and React Native
let auth;
try {
  // Try to initialize with persistence if available
  // Note: getReactNativePersistence may not be available in all Firebase versions
  // For Firebase v12+, getAuth should work fine with React Native
  auth = getAuth(firebaseApp);
} catch (error: any) {
  // If getAuth fails, try initializeAuth
  try {
    auth = initializeAuth(firebaseApp);
  } catch (initError: any) {
    // If already initialized, just get the existing instance
    if (initError.code === 'auth/already-initialized' || initError.message?.includes('already been initialized')) {
      auth = getAuth(firebaseApp);
    } else {
      throw initError;
    }
  }
}

export { auth };

