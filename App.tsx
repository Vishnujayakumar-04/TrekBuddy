import React, { useEffect } from 'react';
import { View, StyleSheet, LogBox, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Updates from 'expo-updates';
import StackNavigator from './src/navigation/StackNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { getColors } from './src/theme/colors';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed',
  'AsyncStorage has been extracted',
  'Failed to download remote update',
  'java.io.IOException',
  'New update available',
  'downloading',
  'exp.direct',
  'Loading from',
]);

// Suppress update-related errors (works in both dev and production)
const originalError = console.error;
console.error = (...args) => {
  const firstArg = args[0];
  if (typeof firstArg === 'string') {
    const lowerArg = firstArg.toLowerCase();
    if (
      lowerArg.includes('failed to download remote update') ||
      lowerArg.includes('java.io.ioexception') ||
      lowerArg.includes('remote update') ||
      lowerArg.includes('new update available') ||
      lowerArg.includes('downloading') ||
      lowerArg.includes('exp.direct') ||
      lowerArg.includes('loading from') ||
      (lowerArg.includes('update') && lowerArg.includes('download')) ||
      (lowerArg.includes('update') && lowerArg.includes('ioexception'))
    ) {
      // Silently ignore update-related errors
      return;
    }
  }
  // Check if error object is passed
  if (firstArg instanceof Error) {
    const errorMessage = firstArg.message?.toLowerCase() || '';
    const errorStack = firstArg.stack?.toLowerCase() || '';
    if (
      errorMessage.includes('failed to download remote update') ||
      errorMessage.includes('java.io.ioexception') ||
      errorMessage.includes('remote update') ||
      errorStack.includes('update') ||
      (errorMessage.includes('update') && errorMessage.includes('download'))
    ) {
      return;
    }
  }
  originalError(...args);
};

// Handle unhandled promise rejections
if (typeof global !== 'undefined') {
  const originalUnhandledRejection = (global as any).onunhandledrejection;
  (global as any).onunhandledrejection = (event: any) => {
    const error = event?.reason || event;
    const errorMessage = error?.message || error?.toString() || '';
    const lowerMessage = errorMessage.toLowerCase();
    
    if (
      lowerMessage.includes('failed to download remote update') ||
      lowerMessage.includes('java.io.ioexception') ||
      lowerMessage.includes('remote update') ||
      (lowerMessage.includes('update') && lowerMessage.includes('download'))
    ) {
      // Suppress update-related promise rejections
      event?.preventDefault?.();
      return;
    }
    if (originalUnhandledRejection) {
      originalUnhandledRejection(event);
    }
  };
}

function AppContent() {
  const { loading } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  // Aggressively prevent any update checks and downloads
  useEffect(() => {
    // Wrap in try-catch to prevent any update-related crashes
    try {
      // Override update functions to prevent any checks
      if (Updates && typeof Updates.checkForUpdateAsync === 'function') {
        // Replace with no-op functions
        (Updates as any).checkForUpdateAsync = async () => {
          return { isAvailable: false };
        };
        (Updates as any).fetchUpdateAsync = async () => {
          return { isNew: false };
        };
        (Updates as any).reloadAsync = async () => {
          // Do nothing
        };
      }
      
      // Check if updates are enabled (they shouldn't be based on app.json)
      if (Updates.isEnabled) {
        if (__DEV__) {
          console.log('[Updates] Updates disabled - all checks prevented');
        }
      }
    } catch (error: any) {
      // Silently suppress any update-related errors
      const errorMsg = error?.message || error?.toString() || '';
      if (errorMsg.toLowerCase().includes('update') || 
          errorMsg.toLowerCase().includes('download') ||
          errorMsg.toLowerCase().includes('exp.direct')) {
        // This is an update/download error - suppress it
        if (__DEV__) {
          console.warn('[Updates] Update error suppressed:', errorMsg);
        }
      } else {
        // Not an update error - log it normally
        console.error('Error in AppContent useEffect:', error);
      }
    }
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.teal} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
