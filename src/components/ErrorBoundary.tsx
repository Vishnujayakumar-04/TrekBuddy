import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// Use direct color values to avoid module initialization issues in ErrorBoundary
// ErrorBoundary must work even if theme module has issues
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';

// Direct color values for ErrorBoundary (must work even if colors module fails)
const errorBoundaryColors = {
  background: '#FFFFFF',
  textPrimary: '#1A202C',
  textSecondary: '#666666',
  red: '#E84A4A',
  teal: '#0E7C86',
  textLight: '#FFFFFF',
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Don't show error UI for update-related errors or loading errors
    const errorMessage = error?.message || '';
    const errorStack = error?.stack || '';
    const errorName = error?.name || '';
    const combined = `${errorMessage} ${errorStack} ${errorName}`.toLowerCase();
    
    if (
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
    ) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Ignore update-related errors - they're not critical
    const errorMessage = error?.message || '';
    const errorStack = error?.stack || '';
    const errorName = error?.name || '';
    const errorInfoString = errorInfo?.componentStack || '';
    const combined = `${errorMessage} ${errorStack} ${errorName} ${errorInfoString}`.toLowerCase();
    
    if (
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
    ) {
      console.warn('Update error ignored (updates are disabled):', error.message);
      // Reset error state to allow app to continue
      this.setState({ hasError: false, error: null });
      return;
    }
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            The app encountered an error. Please try again.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorDetail} numberOfLines={3}>
              {this.state.error.message}
            </Text>
          )}
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: errorBoundaryColors.background,
    padding: spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: errorBoundaryColors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMedium,
    color: errorBoundaryColors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  errorDetail: {
    ...typography.bodySmall,
    color: errorBoundaryColors.red,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  button: {
    backgroundColor: errorBoundaryColors.teal,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  buttonText: {
    ...typography.labelMedium,
    color: errorBoundaryColors.textLight,
  },
});

export default ErrorBoundary;
