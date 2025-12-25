import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  style?: TextStyle;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, style }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, style]}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: 1,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textLightGray,
    fontSize: 11,
  },
});

