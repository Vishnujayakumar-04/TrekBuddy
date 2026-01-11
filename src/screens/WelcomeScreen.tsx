import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface WelcomeScreenProps {
  navigation?: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const titleOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    // Start animation sequence
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Logo animation: fade in + scale (0.8 → 1.05 → 1.0)
    logoOpacity.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.ease) });
    logoScale.value = withTiming(1.05, { 
      duration: 800, 
      easing: Easing.out(Easing.ease) 
    }, () => {
      // Scale back to 1.0 after reaching 1.05
      logoScale.value = withSpring(1.0, { damping: 15, stiffness: 200 });
    });

    // App name: slide up + fade in (after 400ms)
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(400, withSpring(0, { damping: 15, stiffness: 100 }));

    // Tagline: fade in (after 700ms)
    taglineOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));

    // Button: fade in + slide up (after 1200ms)
    buttonOpacity.value = withDelay(1200, withTiming(1, { duration: 500 }));
    buttonTranslateY.value = withDelay(1200, withSpring(0, { damping: 15, stiffness: 100 }));
  };

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: interpolate(logoScale.value, [0, 1], [0.8, logoScale.value]) },
    ],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const handleExplore = () => {
    // Add button press animation before navigation
    buttonTranslateY.value = withSpring(5, { damping: 15, stiffness: 200 });
    
    // Navigate after a brief delay for visual feedback
    setTimeout(() => {
      navigation?.navigate('Login');
    }, 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <LinearGradient
        colors={['#0E7C86', '#4ECDC4']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Background Logo with Opacity */}
        <ImageBackground
          source={require('../../assets/logo-bg.png')}
          style={styles.backgroundLogo}
          imageStyle={styles.backgroundLogoImage}
          resizeMode="contain"
        />
        
        {/* Content Container */}
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Animated.View style={logoAnimatedStyle}>
              <Image
                source={require('../../assets/tb-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>
            
            <Animated.Text style={[styles.appName, titleAnimatedStyle]}>
              TrekBuddy
            </Animated.Text>
            
            <Animated.Text style={[styles.tagline, taglineAnimatedStyle]}>
              Your smart travel companion
            </Animated.Text>
          </View>

          {/* Bottom Section with Button */}
          <View style={styles.bottomSection}>
            <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity
                style={[styles.exploreButton, shadows.md]}
                onPress={handleExplore}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#ffffff', '#f8f8f8']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
          >
                  <Text style={styles.buttonText}>Explore TrekBuddy</Text>
                  <Text style={styles.buttonArrow}>→</Text>
                </LinearGradient>
          </TouchableOpacity>
            </Animated.View>

            {/* Decorative dots */}
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT + spacing.xl,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  logoImage: {
    width: 220,
    height: 220,
    marginBottom: spacing.lg,
  },
  backgroundLogo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  backgroundLogoImage: {
    opacity: 0.15,
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  bottomSection: {
    paddingBottom: spacing.xl + 20,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  exploreButton: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.xl,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0E7C86',
    marginRight: spacing.sm,
  },
  buttonArrow: {
    fontSize: 20,
    color: '#0E7C86',
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  // Decorative elements
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -50,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
