import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar, FlatList, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SectionTitle } from '../components/ui';
import { CategoryCard } from '../components/CategoryCard';
import { AutoAwesomeIcon, AccessTimeIcon, PlaceIcon, InfoIcon, ChevronRightIcon } from '../components/icons';
import { getCategoryKey, getAllPlaces } from '../utils/api';
import { getVisitedCategories } from '../utils/storage';
import { generateAIRecommendation, AIRecommendation, getWeatherHint } from '../utils/gemini';
import { QUICK_CATEGORIES } from '../data/categories';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface HomeScreenProps {
  navigation?: any;
}

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
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
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
          colors={colors.gradientTeal}
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
              <AutoAwesomeIcon size={24} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {/* AI Travel Assistant Card */}
          <TouchableOpacity
            style={[styles.aiChatbotCard, shadows.md]}
            onPress={() => navigation?.navigate('AIChatbot')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={colors.gradientTeal}
              style={styles.aiChatbotCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.aiChatbotCardContent}>
                <View style={styles.aiChatbotIconContainer}>
                  <AutoAwesomeIcon size={32} color={colors.textLight} />
                </View>
                <View style={styles.aiChatbotTextContainer}>
                  <Text style={styles.aiChatbotTitle}>AI Travel Assistant</Text>
                  <Text style={styles.aiChatbotSubtitle}>Ask me anything about Pondicherry</Text>
                </View>
                <ChevronRightIcon size={24} color={colors.textLight} />
              </View>
            </LinearGradient>
          </TouchableOpacity>

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
                  <AccessTimeIcon size={24} color={colors.teal} />
                </View>
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>Best Time</Text>
                  <Text style={styles.modalItemSubtitle}>
                    {isLoadingAI.bestTime 
                      ? 'Loading...' 
                      : aiRecommendations.bestTime?.content?.substring(0, 60) + '...' || 'Get recommendations for the best time to visit'}
                  </Text>
                </View>
                <ChevronRightIcon size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Suggestions */}
              <TouchableOpacity 
                style={styles.modalItem}
                onPress={() => handleAIModalItemPress('nearby_attraction')}
                activeOpacity={0.7}
              >
                <View style={styles.modalItemIcon}>
                  <PlaceIcon size={24} color={colors.blue} />
                </View>
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>Suggestions</Text>
                  <Text style={styles.modalItemSubtitle}>
                    {isLoadingAI.nearbyAttraction 
                      ? 'Loading...' 
                      : aiRecommendations.nearbyAttraction?.content?.substring(0, 60) + '...' || 'Discover nearby attractions based on your interests'}
                  </Text>
                </View>
                <ChevronRightIcon size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Safety */}
              <TouchableOpacity 
                style={styles.modalItem}
                onPress={() => handleAIModalItemPress('safety_tip')}
                activeOpacity={0.7}
              >
                <View style={styles.modalItemIcon}>
                  <InfoIcon size={24} color={colors.yellow} />
                </View>
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>Safety</Text>
                  <Text style={styles.modalItemSubtitle}>
                    {isLoadingAI.safetyTip 
                      ? 'Loading...' 
                      : aiRecommendations.safetyTip?.content?.substring(0, 60) + '...' || 'Important safety tips for your journey'}
                  </Text>
                </View>
                <ChevronRightIcon size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Weather Tips */}
              <TouchableOpacity 
                style={styles.modalItem}
                onPress={() => handleAIModalItemPress('weather')}
                activeOpacity={0.7}
              >
                <View style={styles.modalItemIcon}>
                  <AutoAwesomeIcon size={24} color={colors.red} />
                </View>
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>Weather Tips</Text>
                  <Text style={styles.modalItemSubtitle}>
                    {weatherTip || 'Get current weather conditions and tips'}
                  </Text>
                </View>
                <ChevronRightIcon size={20} color={colors.textSecondary} />
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
    backgroundColor: colors.background,
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
    color: colors.textLight,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    color: colors.textLight,
    opacity: 0.9,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
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
    backgroundColor: colors.teal,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginHorizontal: spacing.xs,
  },
  exploreButtonText: {
    ...typography.labelMedium,
    color: colors.textLight,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
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
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  modalItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  modalItemContent: {
    flex: 1,
  },
  modalItemTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalItemSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  aiChatbotCard: {
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  aiChatbotCardGradient: {
    padding: spacing.lg,
  },
  aiChatbotCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiChatbotIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  aiChatbotTextContainer: {
    flex: 1,
  },
  aiChatbotTitle: {
    ...typography.h4,
    color: colors.textLight,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  aiChatbotSubtitle: {
    ...typography.bodySmall,
    color: colors.textLight,
    opacity: 0.9,
  },
});
