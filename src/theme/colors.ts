// Light theme colors
const lightColors = {
  // Primary Brand Colors
  teal: '#0E7C86',
  yellow: '#F4C430',
  red: '#E84A4A',
  blue: '#2176FF',
  
  // Gradient Colors
  gradientTeal: ['#0E7C86', '#4ECDC4'], // Teal → Light teal
  gradientOrange: ['#FF6B6B', '#F4C430'], // Orange → Yellow
  gradientRed: ['#E84A4A', '#FF8A8A'], // Red → Light red
  gradientBlue: ['#2176FF', '#6BA3FF'], // Blue → Light blue
  
  // Legacy (for compatibility)
  primary: '#0E7C86',
  secondary: '#F4C430',
  accent: '#2176FF',
  
  // Backgrounds
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Text
  textPrimary: '#1A202C',
  textSecondary: '#666666', // Gray text
  textLight: '#FFFFFF',
  textLightGray: '#777777', // Light gray for subtitles
  
  // UI
  border: '#E2E8F0',
  divider: '#E2E8F0',
  
  // Status
  success: '#48BB78',
  warning: '#ED8936',
  error: '#E84A4A',
  info: '#2176FF',
};

// Dark theme colors
const darkColors = {
  // Primary Brand Colors (same for both themes)
  teal: '#0E7C86',
  yellow: '#F4C430',
  red: '#E84A4A',
  blue: '#2176FF',
  
  // Gradient Colors (same for both themes)
  gradientTeal: ['#0E7C86', '#4ECDC4'],
  gradientOrange: ['#FF6B6B', '#F4C430'],
  gradientRed: ['#E84A4A', '#FF8A8A'],
  gradientBlue: ['#2176FF', '#6BA3FF'],
  
  // Legacy (for compatibility)
  primary: '#0E7C86',
  secondary: '#F4C430',
  accent: '#2176FF',
  
  // Backgrounds (dark)
  background: '#121212',
  cardBackground: '#1E1E1E',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Text (dark)
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0', // Light gray text
  textLight: '#FFFFFF',
  textLightGray: '#999999', // Medium gray for subtitles
  
  // UI (dark)
  border: '#333333',
  divider: '#333333',
  
  // Status (same for both themes)
  success: '#48BB78',
  warning: '#ED8936',
  error: '#E84A4A',
  info: '#2176FF',
};

// Export function to get colors based on theme
export const getColors = (isDark: boolean = false) => {
  return isDark ? darkColors : lightColors;
};

// Named export for backward compatibility (light theme)
// Export directly without spread to avoid any potential issues
export const colors = lightColors;

// Also export as default for maximum compatibility
export default colors;
