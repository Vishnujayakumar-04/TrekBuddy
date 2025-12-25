import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

interface SearchBarProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search destinations...',
  onChangeText,
  value,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        onChangeText={onChangeText}
        value={value}
      />
      <View style={styles.icon}>🔍</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: spacing.md,
    paddingRight: 40,
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    position: 'absolute',
    right: spacing.md,
    fontSize: 16,
  },
});
