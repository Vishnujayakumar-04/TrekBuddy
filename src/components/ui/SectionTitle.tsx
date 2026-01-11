import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
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
    color: '#000000',
    marginBottom: 1,
  },
  subtitle: {
    ...typography.bodySmall,
    color: '#777777',
    fontSize: 11,
  },
});

