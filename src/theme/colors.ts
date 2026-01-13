// Define colors as immediate exports to prevent runtime errors

// Light theme colors object
const lightColorsObj = {
  teal: '#0E7C86',
  yellow: '#F4C430',
  red: '#E84A4A',
  blue: '#2176FF',
  gradientTeal: ['#0E7C86', '#4ECDC4'],
  gradientOrange: ['#FF6B6B', '#F4C430'],
  gradientRed: ['#E84A4A', '#FF8A8A'],
  gradientBlue: ['#2176FF', '#6BA3FF'],
  primary: '#0E7C86',
  secondary: '#F4C430',
  accent: '#2176FF',
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  textPrimary: '#1A202C',
  textSecondary: '#666666',
  textLight: '#FFFFFF',
  textLightGray: '#777777',
  border: '#E2E8F0',
  divider: '#E2E8F0',
  success: '#48BB78',
  warning: '#ED8936',
  error: '#E84A4A',
  info: '#2176FF',
};

// Dark theme colors object
const darkColorsObj = {
  teal: '#0E7C86',
  yellow: '#F4C430',
  red: '#E84A4A',
  blue: '#2176FF',
  gradientTeal: ['#0E7C86', '#4ECDC4'],
  gradientOrange: ['#FF6B6B', '#F4C430'],
  gradientRed: ['#E84A4A', '#FF8A8A'],
  gradientBlue: ['#2176FF', '#6BA3FF'],
  primary: '#0E7C86',
  secondary: '#F4C430',
  accent: '#2176FF',
  background: '#121212',
  cardBackground: '#1E1E1E',
  overlay: 'rgba(0, 0, 0, 0.7)',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textLight: '#FFFFFF',
  textLightGray: '#999999',
  border: '#333333',
  divider: '#333333',
  success: '#48BB78',
  warning: '#ED8936',
  error: '#E84A4A',
  info: '#2176FF',
};

// Export light colors as named export
export const lightColors = lightColorsObj;
export const darkColors = darkColorsObj;

// Export function to get colors based on theme
export function getColors(isDark: boolean = false) {
  return isDark ? darkColorsObj : lightColorsObj;
}

// Export colors (light theme) for backward compatibility
export const colors = lightColorsObj;

// Default export
export default lightColorsObj;
