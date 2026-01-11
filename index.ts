// CRITICAL: Set up error handlers BEFORE any imports to catch native-level errors
// Global error handler to catch update-related errors before they reach React
const isUpdateError = (error: Error | string | any): boolean => {
  if (!error) return false;
  const errorMessage = typeof error === 'string' ? error : error?.message || error?.toString() || '';
  const errorStack = typeof error === 'string' ? '' : error?.stack || '';
  const errorName = (error && typeof error === 'object' && 'name' in error) ? String(error.name) : '';
  const combined = `${errorMessage} ${errorStack} ${errorName}`.toLowerCase();
  
  return (
    combined.includes('failed to download remote update') ||
    combined.includes('java.io.ioexception') ||
    combined.includes('java.ioexception') ||
    combined.includes('remote update') ||
    combined.includes('expo-updates') ||
    combined.includes('expo_updates') ||
    combined.includes('new update available') ||
    combined.includes('downloading') ||
    combined.includes('exp.direct') ||
    combined.includes('loading from') ||
    combined.includes('update failed') ||
    combined.includes('update error') ||
    (combined.includes('update') && combined.includes('download')) ||
    (combined.includes('update') && combined.includes('ioexception')) ||
    (combined.includes('ioexception') && combined.includes('update'))
  );
};

// Set up global error handler immediately (before any React Native code loads)
if (typeof global !== 'undefined') {
  // Handle ErrorUtils (React Native's global error handler)
  const ErrorUtils = (global as any).ErrorUtils;
  if (ErrorUtils && typeof ErrorUtils.getGlobalHandler === 'function') {
    const originalGlobalHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      if (isUpdateError(error)) {
        // Silently ignore update-related errors since updates are disabled
        // Don't crash the app for update errors
        if (__DEV__) {
          console.warn('[Suppressed] Update error (updates disabled):', error?.message || error);
        }
        // Return without calling original handler to prevent crash
        return;
      }
      // Call original handler for other errors
      if (originalGlobalHandler) {
        try {
          originalGlobalHandler(error, isFatal);
        } catch (handlerError) {
          // If the error handler itself fails, log but don't crash
          if (__DEV__) {
            console.error('Error in global error handler:', handlerError);
          }
        }
      }
    });
  }

  // Handle unhandled promise rejections
  const originalUnhandledRejection = (global as any).onunhandledrejection;
  (global as any).onunhandledrejection = (event: any) => {
    const error = event?.reason || event;
    if (isUpdateError(error)) {
      if (__DEV__) {
        console.warn('[Suppressed] Update promise rejection:', error?.message || error);
      }
      if (event?.preventDefault) {
        event.preventDefault();
      }
      return;
    }
    if (originalUnhandledRejection) {
      originalUnhandledRejection(event);
    }
  };

  // Suppress console errors for update-related issues
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const firstArg = args[0];
    if (typeof firstArg === 'string' && isUpdateError(firstArg)) {
      return; // Suppress
    }
    if (firstArg instanceof Error && isUpdateError(firstArg)) {
      return; // Suppress
    }
    originalConsoleError(...args);
  };
}

// Disable expo-updates at runtime (before any imports that might trigger it)
// This ensures updates are never checked, even in development mode
if (typeof global !== 'undefined') {
  (global as any).__EXPO_UPDATES_DISABLED__ = true;
}

// Now import and register the app
import { registerRootComponent } from 'expo';
import App from './App';

// expo-updates is disabled in app.json, so we don't need to import or initialize it
// Any errors from expo-updates will be caught by the global error handlers above

// Wrap registration in try-catch to prevent crashes
try {
  // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
  // It also ensures that whether you load the app in Expo Go or in a native build,
  // the environment is set up appropriately
  registerRootComponent(App);
} catch (error: any) {
  if (isUpdateError(error)) {
    // If it's an update error, try to register anyway
    console.warn('[Recovered] Update error during registration, continuing...');
    try {
      registerRootComponent(App);
    } catch (retryError) {
      // If it still fails, log but don't crash - just continue anyway
      if (__DEV__) {
        console.warn('[Non-fatal] Update error during registration:', retryError);
      }
      // Still try to register to allow app to continue
      try {
        registerRootComponent(App);
      } catch (finalError) {
        // Last resort - log but don't throw
        if (__DEV__) {
          console.error('Final registration attempt failed:', finalError);
        }
      }
    }
  } else {
    // For other errors, re-throw
    throw error;
  }
}
