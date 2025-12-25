import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import { typography } from '../theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - spacing.md * 2 - spacing.sm) / 2;
const CARD_HEIGHT = 140;

interface CategoryCardProps {
  icon?: string;
  image?: string;
  label: string;
  onPress?: () => void;
  index?: number; // For staggered animation
  animated?: boolean; // Enable animations
}

// Get first letter for placeholder
const getPlaceholderText = (label: string) => {
  return label.charAt(0).toUpperCase();
};

// Get gradient colors based on label for variety
const getPlaceholderGradient = (label: string): [string, string] => {
  const gradientOptions: [string, string][] = [
    [colors.teal, '#0D9488'],
    [colors.blue, '#2563EB'],
    ['#8B5CF6', '#7C3AED'],
    ['#EC4899', '#DB2777'],
    ['#F59E0B', '#D97706'],
    ['#10B981', '#059669'],
  ];
  const index = label.length % gradientOptions.length;
  return gradientOptions[index];
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  icon, 
  image, 
  label, 
  onPress,
  index = 0,
  animated = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Animation values
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  // Staggered entrance animation
  useEffect(() => {
    if (animated) {
      const delay = index * 50; // Stagger delay
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          delay,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animated, index]);
  
  // Press animation
  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };
  
  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };
  
  const renderContent = () => {
    // If image exists and hasn't errored, show it
    if (image && !imageError) {
      return (
        <>
          <Image 
            source={{ uri: image }} 
            style={styles.image} 
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          {/* Gradient overlay for better text visibility */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradientOverlay}
          />
        </>
      );
    }
    
    // Fallback: Show colored gradient placeholder with letter
    return (
      <LinearGradient
        colors={getPlaceholderGradient(label)}
        style={styles.placeholder}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.placeholderText}>{getPlaceholderText(label)}</Text>
      </LinearGradient>
    );
  };

  const animatedStyle = animated ? {
    opacity,
    transform: [{ translateY }, { scale }],
  } : {};

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity 
        style={[styles.card, shadows.md, isPressed && styles.cardPressed]} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.imageContainer}>
          {renderContent()}
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label} numberOfLines={2}>{label}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    backgroundColor: colors.cardBackground,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  cardPressed: {
    ...shadows.lg, // Enhanced shadow on press
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.textLight,
    opacity: 0.9,
  },
  labelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  label: {
    ...typography.labelLarge,
    color: colors.textLight,
    fontWeight: '700',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
