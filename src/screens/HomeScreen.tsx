import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar, FlatList, Modal, Image, Animated, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SectionTitle } from '../components/ui';
import { CategoryCard } from '../components/CategoryCard';
import { AutoAwesomeIcon, AccessTimeIcon, PlaceIcon, InfoIcon, ChevronRightIcon } from '../components/icons';
import { getCategoryKey, getAllPlaces } from '../utils/api';
import { getVisitedCategories } from '../utils/storage';
import { generateAIRecommendation, AIRecommendation, getWeatherHint } from '../utils/gemini';
import { QUICK_CATEGORIES } from '../data/categories';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface HomeScreenProps {
  navigation?: any;
}

// Local images for marquee (Pondicherry famous places)
// Note: Excluding files with special characters to avoid Android IO exceptions
const MARQUEE_IMAGES = [
  require('../../assets/Famousplacesimg/arulmigu-manakula-vinayar-puducherry-1-attr-hero.jpg'),
  require('../../assets/Famousplacesimg/download.jpg'),
  require('../../assets/Famousplacesimg/image_2022-07-26_124514583.jpg'),
  require('../../assets/Famousplacesimg/Image-1-10_6800d3a4ec9e7.jpg'),
  require('../../assets/Famousplacesimg/unnamed.jpg'),
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [aiRecommendations, setAiRecommendations] = useState<{
    bestTime: AIRecommendation | null;
    nearbyAttraction: AIRecommendation | null;
    safetyTip: AIRecommendation | null;
  }>({
    bestTime: null,
    nearbyAttraction: null,
    safetyTip: null,
  });
  const [isLoadingAI, setIsLoadingAI] = useState({
    bestTime: false,
    nearbyAttraction: false,
    safetyTip: false,
  });
  const [showAIModal, setShowAIModal] = useState(false);
  const [weatherTip, setWeatherTip] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);
  const currentScrollX = useRef(0);

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      if (isMounted) {
        await loadAIRecommendations();
        setWeatherTip(getWeatherHint());
      }
    };
    
    init();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll marquee effect (infinite loop)
  useEffect(() => {
    const imageWidth = SCREEN_WIDTH * 0.7 + spacing.sm;

    const scrollInterval = setInterval(() => {
      const nextPosition = currentScrollX.current + imageWidth;
      const totalWidth = imageWidth * MARQUEE_IMAGES.length;
      
      // If reached the end, reset to start (infinite loop)
      const targetPosition = nextPosition >= totalWidth ? 0 : nextPosition;

      scrollViewRef.current?.scrollTo({
        x: targetPosition,
        animated: true,
      });
      
      // Update ref after a delay to account for animation
      setTimeout(() => {
        currentScrollX.current = targetPosition;
      }, 500);
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(scrollInterval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadAIRecommendations();
    }, [])
  );

  const loadAIRecommendations = async () => {
    try {
      const visitedCategories = await getVisitedCategories() || [];
      const allPlaces = await getAllPlaces() || [];

      setIsLoadingAI({ bestTime: true, nearbyAttraction: true, safetyTip: true });

      // Check if online before making AI calls
      const { isOnline } = await import('../utils/offlineCache');
      const online = await isOnline();

      if (online) {
        const [bestTime, nearbyAttraction, safetyTip] = await Promise.all([
          generateAIRecommendation('best_time', visitedCategories, allPlaces).catch(() => null),
          generateAIRecommendation('nearby_attraction', visitedCategories, allPlaces).catch(() => null),
          generateAIRecommendation('safety_tip', visitedCategories, allPlaces).catch(() => null),
        ]);

        setAiRecommendations({
          bestTime: bestTime || null,
          nearbyAttraction: nearbyAttraction || null,
          safetyTip: safetyTip || null,
        });
      } else {
        // Offline mode - set empty recommendations
        setAiRecommendations({
          bestTime: null,
          nearbyAttraction: null,
          safetyTip: null,
        });
      }
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
      // On error, still allow app to work with cached data
      setAiRecommendations({
        bestTime: null,
        nearbyAttraction: null,
        safetyTip: null,
      });
    } finally {
      setIsLoadingAI({ bestTime: false, nearbyAttraction: false, safetyTip: false });
    }
  };

  const handleCategoryPress = (categoryId: string, label: string) => {
    // Navigate to Temples screen for temples category
    if (categoryId === 'temples' || categoryId === 'religious' || label.toLowerCase().includes('temples')) {
      navigation?.navigate('ReligiousPlaces');
      return;
    }
    // Navigate to Beaches screen
    if (categoryId === 'beaches' || label.toLowerCase().includes('beaches')) {
      navigation?.navigate('Beaches');
      return;
    }
    // Navigate to Parks screen
    if (categoryId === 'parks' || label.toLowerCase().includes('parks')) {
      navigation?.navigate('Parks');
      return;
    }
    // Navigate to Nature screen
    if (categoryId === 'nature' || label.toLowerCase().includes('nature')) {
      navigation?.navigate('Nature');
      return;
    }
    // Navigate to Nightlife screen
    if (categoryId === 'nightlife' || label.toLowerCase().includes('nightlife') || label.toLowerCase().includes('evening')) {
      navigation?.navigate('Nightlife');
      return;
    }
    // Navigate to Adventure screen
    if (categoryId === 'adventure' || label.toLowerCase().includes('adventure') || label.toLowerCase().includes('outdoor')) {
      navigation?.navigate('Adventure');
      return;
    }
    // Navigate to Theatres screen
    if (categoryId === 'theatres' || categoryId === 'cinemas' || label.toLowerCase().includes('theatres') || label.toLowerCase().includes('cinemas')) {
      navigation?.navigate('Theatres');
      return;
    }
    // Navigate to Photoshoot screen
    if (categoryId === 'photoshoot' || label.toLowerCase().includes('photoshoot') || label.toLowerCase().includes('photo')) {
      navigation?.navigate('Photoshoot');
      return;
    }
    // Navigate to Shopping screen
    if (categoryId === 'shopping' || label.toLowerCase().includes('shopping')) {
      navigation?.navigate('Shopping');
      return;
    }
    // Navigate to Pubs screen
    if (categoryId === 'pubs' || categoryId === 'bars' || label.toLowerCase().includes('pubs') || label.toLowerCase().includes('bars')) {
      navigation?.navigate('Pubs');
      return;
    }
    // Navigate to Accommodation screen
    if (categoryId === 'accommodation' || label.toLowerCase().includes('accommodation') || label.toLowerCase().includes('hotel') || label.toLowerCase().includes('resort')) {
      navigation?.navigate('Accommodation');
      return;
    }
    // Navigate to Restaurants screen
    if (categoryId === 'restaurants' || categoryId === 'dining' || label.toLowerCase().includes('restaurant') || label.toLowerCase().includes('dining')) {
      navigation?.navigate('Restaurants');
      return;
    }
    const categoryKey = categoryId || getCategoryKey(label);
    navigation?.navigate('Category', { category: categoryKey, label });
  };


  const handleAIButtonPress = () => {
    setShowAIModal(true);
  };

  const handleAIModalItemPress = (type: 'best_time' | 'nearby_attraction' | 'safety_tip' | 'weather') => {
    if (type === 'weather') {
      // Weather tip is already loaded
      navigation?.navigate('AIDetail', { 
        type: 'weather', 
        recommendation: {
          type: 'safety_tip',
          title: 'Weather Tips',
          content: weatherTip,
        }
      });
    } else {
      const recommendation = 
        type === 'best_time' ? aiRecommendations.bestTime :
        type === 'nearby_attraction' ? aiRecommendations.nearbyAttraction :
        aiRecommendations.safetyTip;
      
      if (recommendation) {
        navigation?.navigate('AIDetail', { type, recommendation });
      } else {
        navigation?.navigate('Settings');
      }
    }
    setShowAIModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Custom Header with Settings Icon */}
        <LinearGradient
          colors={['#0E7C86', '#4ECDC4']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            {/* Header Text */}
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>TrekBuddy</Text>
              <Text style={styles.headerSubtitle}>Discover Pondicherry</Text>
            </View>

            {/* AI Insights Button - Top Right */}
            <TouchableOpacity 
              style={styles.aiButton}
              onPress={handleAIButtonPress}
              activeOpacity={0.7}
            >
              <AutoAwesomeIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {/* Image Marquee */}
          <View style={styles.marqueeContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled={false}
              decelerationRate="fast"
              snapToInterval={SCREEN_WIDTH * 0.7 + spacing.sm}
              contentContainerStyle={styles.marqueeContent}
              onScroll={(event) => {
                currentScrollX.current = event.nativeEvent.contentOffset.x;
              }}
              scrollEventThrottle={16}
            >
              {MARQUEE_IMAGES.map((imageSource, index) => (
                <View key={index} style={styles.marqueeImageContainer}>
                  <Image
                    source={imageSource}
                    style={styles.marqueeImage}
                    resizeMode="cover"
                    onError={(error) => {
                      console.warn(`Failed to load marquee image ${index}:`, error);
                    }}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.marqueeOverlay}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Categories Grid - 2 Columns */}
          <SectionTitle title="Quick Explore" />
          <View style={styles.categoriesGrid}>
            {(QUICK_CATEGORIES || []).map((category, index) => (
              category && (
                <View 
                  key={category.id || Math.random().toString()} 
                  style={[
                    styles.categoryGridItem,
                    index % 2 === 0 ? styles.categoryGridItemLeft : styles.categoryGridItemRight
                  ]}
                >
                  <CategoryCard
                    image={category.image || ''}
                    label={category.label || 'Category'}
                    onPress={() => handleCategoryPress(category.id || '', category.label || '')}
                    index={index}
                    animated={true}
                  />
                </View>
              )
            ))}
          </View>

          {/* Explore All Button */}
          <TouchableOpacity
            style={[styles.exploreButton, shadows.sm]}
            onPress={() => navigation?.navigate('Explore')}
            activeOpacity={0.8}
          >
            <Text style={styles.exploreButtonText}>View All Categories</Text>
          </TouchableOpacity>

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Floating AI Assistant Button */}
      <TouchableOpacity
        style={styles.floatingAIButton}
        onPress={() => navigation?.navigate('AIChatbot')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#0E7C86', '#4ECDC4']}
          style={styles.floatingAIButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <AutoAwesomeIcon size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* AI Insights Modal */}
      <Modal
        visible={showAIModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAIModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI Insights</Text>
              <TouchableOpacity 
                onPress={() => setShowAIModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Best Time */}
              <TouchableOpacity 
                style={styles.modalItem}
                onPress={() => handleAIModalItemPress('best_time')}
                activeOpacity={0.7}
              >
                <View style={styles.modalItemIcon}>
                  <AccessTimeIcon size={24} color="#0E7C86" />
                </View>
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>Best Time</Text>
                  <Text style={styles.modalItemSubtitle}>
                    {isLoadingAI.bestTime 
                      ? 'Loading...' 
                      : aiRecommendations.bestTime?.content?.substring(0, 60) + '...' || 'Get recommendations for the best time to visit'}
                  </Text>
                </View>
                <ChevronRightIcon size={20} color="#666666" />
              </TouchableOpacity>

              {/* Suggestions */}
              <TouchableOpacity 
                style={styles.modalItem}
                onPress={() => handleAIModalItemPress('nearby_attraction')}
                activeOpacity={0.7}
              >
                <View style={styles.modalItemIcon}>
                  <PlaceIcon size={24} color="#2176FF" />
                </View>
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>Suggestions</Text>
                  <Text style={styles.modalItemSubtitle}>
                    {isLoadingAI.nearbyAttraction 
                      ? 'Loading...' 
                      : aiRecommendations.nearbyAttraction?.content?.substring(0, 60) + '...' || 'Discover nearby attractions based on your interests'}
                  </Text>
                </View>
                <ChevronRightIcon size={20} color="#666666" />
              </TouchableOpacity>

              {/* Safety */}
              <TouchableOpacity 
                style={styles.modalItem}
                onPress={() => handleAIModalItemPress('safety_tip')}
                activeOpacity={0.7}
              >
                <View style={styles.modalItemIcon}>
                  <InfoIcon size={24} color="#F4C430" />
                </View>
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>Safety</Text>
                  <Text style={styles.modalItemSubtitle}>
                    {isLoadingAI.safetyTip 
                      ? 'Loading...' 
                      : aiRecommendations.safetyTip?.content?.substring(0, 60) + '...' || 'Important safety tips for your journey'}
                  </Text>
                </View>
                <ChevronRightIcon size={20} color="#666666" />
              </TouchableOpacity>

              {/* Weather Tips */}
              <TouchableOpacity 
                style={styles.modalItem}
                onPress={() => handleAIModalItemPress('weather')}
                activeOpacity={0.7}
              >
                <View style={styles.modalItemIcon}>
                  <AutoAwesomeIcon size={24} color="#E84A4A" />
                </View>
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>Weather Tips</Text>
                  <Text style={styles.modalItemSubtitle}>
                    {weatherTip || 'Get current weather conditions and tips'}
                  </Text>
                </View>
                <ChevronRightIcon size={20} color="#666666" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: STATUSBAR_HEIGHT + spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  aiButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  marqueeContainer: {
    height: 200,
    marginBottom: spacing.lg,
    marginHorizontal: -spacing.md,
  },
  marqueeContent: {
    paddingHorizontal: spacing.md,
  },
  marqueeImageContainer: {
    width: SCREEN_WIDTH * 0.7,
    height: 200,
    marginRight: spacing.sm,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  marqueeImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.lg,
  },
  marqueeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    justifyContent: 'space-between',
  },
  categoryGridItem: {
    width: '48.5%',
    marginBottom: spacing.sm,
  },
  categoryGridItemLeft: {
    // No extra padding needed
  },
  categoryGridItemRight: {
    // No extra padding needed
  },
  exploreButton: {
    backgroundColor: '#0E7C86',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginHorizontal: spacing.xs,
  },
  exploreButtonText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '80%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    ...typography.h3,
    color: '#000000',
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 20,
    color: '#666666',
    fontWeight: '600',
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  modalItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  modalItemContent: {
    flex: 1,
  },
  modalItemTitle: {
    ...typography.labelLarge,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 4,
  },
  modalItemSubtitle: {
    ...typography.bodySmall,
    color: '#666666',
  },
  floatingAIButton: {
    position: 'absolute',
    bottom: 100,
    right: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    ...shadows.lg,
    zIndex: 1000,
  },
  floatingAIButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
