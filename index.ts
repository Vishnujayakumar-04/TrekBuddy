// CRITICAL: Set up error handlers BEFORE any imports to catch native-level errors
// Global error handler to catch update-related errors before they reach React
const isUpdateError = (error: Error | string | any): boolean => {
  if (!error) return false;
  const errorMessage = typeof error === 'string' ? error : error?.message || error?.toString() || '';
  const errorStack = typeof error === 'string' ? '' : error?.stack || '';
  const combined = `${errorMessage} ${errorStack}`.toLowerCase();
  
  return (
    combined.includes('failed to download remote update') ||
    combined.includes('java.io.ioexception') ||
    combined.includes('remote update') ||
    combined.includes('expo-updates') ||
    combined.includes('new update available') ||
    combined.includes('downloading') ||
    combined.includes('exp.direct') ||
    combined.includes('loading from') ||
    (combined.includes('update') && combined.includes('download')) ||
    (combined.includes('update') && combined.includes('ioexception'))
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
        if (__DEV__) {
          console.warn('[Suppressed] Update error (updates disabled):', error?.message || error);
        }
        return;
      }
      // Call original handler for other errors
      if (originalGlobalHandler) {
        originalGlobalHandler(error, isFatal);
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

// Now import and register the app
import { registerRootComponent } from 'expo';
import App from './App';

// Suppress expo-updates errors if the module tries to initialize
try {
  // Try to require expo-updates and suppress any initialization errors
  const Updates = require('expo-updates');
  if (Updates && typeof Updates.checkForUpdateAsync === 'function') {
    // Override checkForUpdateAsync to prevent any checks
    const originalCheck = Updates.checkForUpdateAsync;
    Updates.checkForUpdateAsync = async () => {
      // Return a mock response indicating no update available
      return { isAvailable: false };
    };
  }
} catch (e) {
  // expo-updates might not be available or might error - that's fine
  // We're suppressing update checks anyway
}

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
      // If it still fails, log but don't crash
      console.error('Failed to register app after update error recovery:', retryError);
    }
  } else {
    // For other errors, re-throw
    throw error;
  }
}
