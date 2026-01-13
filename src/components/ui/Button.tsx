import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, Animated, View } from 'react-native';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { shadows } from '../../theme/shadows';
import { usePulseAnimation } from '../../hooks/usePulseAnimation';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  pulse?: boolean; // Enable pulse animation
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  pulse = false,
}) => {
  const pulseStyle = pulse ? usePulseAnimation(0.98, 1.02, 2000) : null;
  const getBackgroundColor = () => {
    if (disabled) return '#E2E8F0';
    switch (variant) {
      case 'primary':
        return '#0E7C86';
      case 'secondary':
        return '#2176FF';
      case 'outline':
        return 'transparent';
      default:
        return '#0E7C86';
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return '#0E7C86';
    return '#FFFFFF';
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      case 'medium':
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
      case 'large':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
    }
  };

  const buttonStyle = [
    styles.button,
    {
      backgroundColor: getBackgroundColor(),
      borderWidth: variant === 'outline' ? 2 : 0,
      borderColor: variant === 'outline' ? '#0E7C86' : 'transparent',
      ...getPadding(),
    },
    style,
  ];

  const ButtonContent = (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Wrap with Animated.View if pulse is enabled
  if (pulse && pulseStyle) {
    return <Animated.View style={pulseStyle}>{ButtonContent}</Animated.View>;
  }

  return ButtonContent;
};

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  text: {
    ...typography.buttonText,
  },
});

