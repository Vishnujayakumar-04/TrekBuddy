export const typography = {
  // Titles - Large bold, 28px
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  
  // Subtitles - 16px light gray
  subtitle: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, color: '#777777' },
  
  // Body
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  
  // Card labels - 18px bold
  cardLabel: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
  cardText: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20, color: '#666666' },
  
  // Button text - bold white
  buttonText: { fontSize: 16, fontWeight: '700' as const, lineHeight: 24, color: '#FFFFFF' },
  
  // Labels
  labelLarge: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  labelMedium: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  labelSmall: { fontSize: 10, fontWeight: '600' as const, lineHeight: 14 },
};
