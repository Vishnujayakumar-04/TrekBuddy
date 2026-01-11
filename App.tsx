import React from 'react';
import { View, StyleSheet, LogBox, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StackNavigator from './src/navigation/StackNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';

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
  'Network request failed',
  'Unable to resolve',
  'ECONNREFUSED',
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
      lowerArg.includes('java.ioexception') ||
      lowerArg.includes('remote update') ||
      lowerArg.includes('expo-updates') ||
      lowerArg.includes('expo_updates') ||
      lowerArg.includes('new update available') ||
      lowerArg.includes('downloading') ||
      lowerArg.includes('exp.direct') ||
      lowerArg.includes('loading from') ||
      lowerArg.includes('update failed') ||
      lowerArg.includes('update error') ||
      (lowerArg.includes('update') && lowerArg.includes('download')) ||
      (lowerArg.includes('update') && lowerArg.includes('ioexception')) ||
      (lowerArg.includes('ioexception') && lowerArg.includes('update'))
    ) {
      // Silently ignore update-related errors
      return;
    }
  }
  // Check if error object is passed
  if (firstArg instanceof Error) {
    const errorMessage = firstArg.message?.toLowerCase() || '';
    const errorStack = firstArg.stack?.toLowerCase() || '';
    const errorName = firstArg.name?.toLowerCase() || '';
    const combined = `${errorMessage} ${errorStack} ${errorName}`;
    if (
      combined.includes('failed to download remote update') ||
      combined.includes('java.io.ioexception') ||
      combined.includes('java.ioexception') ||
      combined.includes('remote update') ||
      combined.includes('expo-updates') ||
      combined.includes('expo_updates') ||
      combined.includes('update failed') ||
      combined.includes('update error') ||
      (combined.includes('update') && combined.includes('download')) ||
      (combined.includes('update') && combined.includes('ioexception')) ||
      (combined.includes('ioexception') && combined.includes('update'))
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
    const errorStack = error?.stack || '';
    const errorName = error?.name || '';
    const lowerMessage = `${errorMessage} ${errorStack} ${errorName}`.toLowerCase();
    
    if (
      lowerMessage.includes('failed to download remote update') ||
      lowerMessage.includes('java.io.ioexception') ||
      lowerMessage.includes('java.ioexception') ||
      lowerMessage.includes('remote update') ||
      lowerMessage.includes('expo-updates') ||
      lowerMessage.includes('expo_updates') ||
      lowerMessage.includes('update failed') ||
      lowerMessage.includes('update error') ||
      (lowerMessage.includes('update') && lowerMessage.includes('download')) ||
      (lowerMessage.includes('update') && lowerMessage.includes('ioexception')) ||
      (lowerMessage.includes('ioexception') && lowerMessage.includes('update'))
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
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#FFFFFF' }]}>
        <ActivityIndicator size="large" color="#0E7C86" />
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
