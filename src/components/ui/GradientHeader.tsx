import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type GradientType = 'teal' | 'orange' | 'red' | 'blue';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  gradientType?: GradientType;
  height?: number;
  children?: React.ReactNode;
}

// Get status bar height for Android
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export const GradientHeader: React.FC<GradientHeaderProps> = ({
  title,
  subtitle,
  icon,
  gradientType = 'teal',
  height = 100,
  children,
}) => {
  const getGradientColors = () => {
    switch (gradientType) {
      case 'teal':
        return colors.gradientTeal;
      case 'orange':
        return colors.gradientOrange;
      case 'red':
        return colors.gradientRed;
      case 'blue':
        return colors.gradientBlue;
      default:
        return colors.gradientTeal;
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.gradient, { minHeight: height + STATUSBAR_HEIGHT }]}
    >
      <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
          {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {children}
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT + 8 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: 'center',
    opacity: 0.9,
  },
});
