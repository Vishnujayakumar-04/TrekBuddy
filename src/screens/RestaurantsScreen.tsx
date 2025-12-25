import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import { ArrowBackIcon, FilterIcon } from '../components/icons';
import { Place } from '../utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

// Import restaurants data
import restaurantsData from '../data/restaurants.json';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

type Language = 'English' | 'Tamil';
type RestaurantCategory = 'Vegetarian Restaurants' | 'Non-Vegetarian Restaurants' | 'Multi-Cuisine Restaurants' | 'Chinese' | 'Continental' | 'South Indian' | 'North Indian' | 'Breakfast Spots' | 'Lunch Restaurants' | 'Dinner Restaurants' | 'Cafés & Bakeries' | 'Street Food Spots';

interface RestaurantPlace {
  id: string;
  name: string;
  nameTamil?: string;
  category: string;
  location: string;
  address: string;
  mapsUrl: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  openingTimeWeekdays?: string;
  closingTimeWeekdays?: string;
  openingTimeWeekends?: string;
  closingTimeWeekends?: string;
  description?: {
    whenEstablished?: string;
    whoOwns?: string;
    specialFeatures?: string;
    facilities?: string[];
    cuisineType?: string;
    signatureDishes?: string[];
    priceRange?: string;
    visitorPurpose?: string;
  };
  images: string[];
  entryFee?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  crowdLevel?: string;
  famousThings?: string[];
  rating?: number;
}

interface RestaurantsScreenProps {
  navigation?: any;
}

const CUISINE_CATEGORIES: { id: RestaurantCategory; label: string; labelTamil: string; image: string }[] = [
  { 
    id: 'Vegetarian Restaurants', 
    label: 'Vegetarian', 
    labelTamil: 'சைவ உணவகங்கள்', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' 
  },
  { 
    id: 'Non-Vegetarian Restaurants', 
    label: 'Non-Vegetarian', 
    labelTamil: 'அசைவ உணவகங்கள்', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' 
  },
  { 
    id: 'Multi-Cuisine Restaurants', 
    label: 'Multi-Cuisine', 
    labelTamil: 'பல சமையல்', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' 
  },
  { 
    id: 'Chinese', 
    label: 'Chinese', 
    labelTamil: 'சீன உணவு', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' 
  },
  { 
    id: 'Continental', 
    label: 'Continental', 
    labelTamil: 'கண்டினென்டல்', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' 
  },
  { 
    id: 'South Indian', 
    label: 'South Indian', 
    labelTamil: 'தென்னிந்திய', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' 
  },
  { 
    id: 'North Indian', 
    label: 'North Indian', 
    labelTamil: 'வட இந்திய', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' 
  },
];

const MEAL_CATEGORIES: { id: RestaurantCategory; label: string; labelTamil: string; image: string }[] = [
  { 
    id: 'Breakfast Spots', 
    label: 'Breakfast Spots', 
    labelTamil: 'காலை உணவு இடங்கள்', 
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800' 
  },
  { 
    id: 'Lunch Restaurants', 
    label: 'Lunch Restaurants', 
    labelTamil: 'மதிய உணவகங்கள்', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' 
  },
  { 
    id: 'Dinner Restaurants', 
    label: 'Dinner Restaurants', 
    labelTamil: 'இரவு உணவகங்கள்', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' 
  },
  { 
    id: 'Cafés & Bakeries', 
    label: 'Cafés & Bakeries', 
    labelTamil: 'கஃபே & பேக்கரிகள்', 
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800' 
  },
  { 
    id: 'Street Food Spots', 
    label: 'Street Food Spots', 
    labelTamil: 'தெரு உணவு இடங்கள்', 
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800' 
  },
];

export default function RestaurantsScreen({ navigation }: RestaurantsScreenProps) {
  const [places, setPlaces] = useState<RestaurantPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<RestaurantPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<RestaurantCategory | null>(null);
  const [showCategoryView, setShowCategoryView] = useState(true);
  const [language, setLanguage] = useState<Language>('English');
  const [showFilters, setShowFilters] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const data = restaurantsData as RestaurantPlace[];
        if (isMounted) {
          setPlaces(Array.isArray(data) ? data : []);
          setFilteredPlaces(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading restaurants:', error);
        if (isMounted) {
          setPlaces([]);
          setFilteredPlaces([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let filtered = [...places];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredPlaces(filtered);
  }, [selectedCategory, places]);

  const handleCategoryPress = (category: RestaurantCategory) => {
    setSelectedCategory(category);
    setShowCategoryView(false);
  };

  const handlePlacePress = (place: RestaurantPlace) => {
    const placeForDetails: Place = {
      id: place.id,
      name: getDisplayName(place),
      image: place.images && place.images.length > 0 ? place.images[0] : '',
      description: getDisplayDescription(place),
      opening: place.openingTimeWeekdays ? `${place.openingTimeWeekdays} - ${place.closingTimeWeekdays}` : 'Open',
      entryFee: place.description?.priceRange || place.entryFee || 'Varies',
      rating: place.rating || 0,
      mapUrl: place.mapsUrl,
      phone: place.phoneNumber || '',
      category: place.category.toLowerCase(),
    };
    navigation?.navigate('PlaceDetails', { place: placeForDetails, restaurantPlace: place });
  };

  const getDisplayName = (place: RestaurantPlace): string => {
    if (language === 'Tamil' && place.nameTamil) {
      return place.nameTamil;
    }
    return place.name;
  };

  const getDisplayDescription = (place: RestaurantPlace): string => {
    const desc = place.description;
    if (!desc) return 'Restaurant in Pondicherry';
    
    let fullDesc = '';
    if (desc.specialFeatures) fullDesc += desc.specialFeatures + '\n\n';
    if (desc.signatureDishes && desc.signatureDishes.length > 0) {
      fullDesc += 'Signature Dishes: ' + desc.signatureDishes.join(', ') + '\n\n';
    }
    if (desc.cuisineType) fullDesc += 'Cuisine: ' + desc.cuisineType + '\n\n';
    if (desc.visitorPurpose) fullDesc += desc.visitorPurpose;
    
    return fullDesc || 'Restaurant in Pondicherry';
  };

  const getLanguageCode = (): string => {
    switch (language) {
      case 'Tamil': return 'TA';
      default: return 'EN';
    }
  };

  const renderCategoryCard = ({ item, index }: { item: typeof CUISINE_CATEGORIES[0] | typeof MEAL_CATEGORIES[0]; index: number }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      onPress={() => handleCategoryPress(item.id)}
      activeOpacity={0.85}
    >
      <View style={styles.categoryImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        />
      </View>
      <View style={styles.categoryLabelContainer}>
        <Text style={styles.categoryLabel}>
          {language === 'Tamil' ? item.labelTamil : item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPlaceCard = ({ item, index }: { item: RestaurantPlace; index: number }) => (
    <TouchableOpacity
      style={[
        styles.placeCard,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      onPress={() => handlePlacePress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/300x200' }}
        style={styles.placeImage}
        resizeMode="cover"
      />
      <View style={styles.placeInfo}>
        <Text style={styles.placeName} numberOfLines={2}>
          {getDisplayName(item)}
        </Text>
        <Text style={styles.placeLocation} numberOfLines={1}>
          {item.location}
        </Text>
        <View style={styles.placeMetaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
        </View>
        {item.rating && item.rating > 0 && (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderActiveFilters = () => {
    if (!selectedCategory) return null;

    return (
      <View style={styles.activeFiltersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.activeFilterTag}>
            <Text style={styles.activeFilterText}>{selectedCategory}</Text>
          </View>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => {
              setSelectedCategory(null);
              setShowCategoryView(true);
            }}
          >
            <Text style={styles.clearFiltersText}>Show All Categories</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.teal} />
        <Text style={styles.loadingText}>Loading restaurants...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (showCategoryView) {
              navigation?.goBack();
            } else {
              setShowCategoryView(true);
              setSelectedCategory(null);
            }
          }}
        >
          <ArrowBackIcon size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {showCategoryView ? 'Restaurants & Dining' : selectedCategory || 'All Restaurants'}
        </Text>
        
        <View style={styles.headerActions}>
          {/* Language Selector */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowLanguageMenu(true)}
          >
            <Text style={styles.languageCode}>{getLanguageCode()}</Text>
          </TouchableOpacity>
          
          {/* Filter Button - Only show when viewing places */}
          {!showCategoryView && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowFilters(true)}
            >
              <FilterIcon size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Active Filters Display */}
      {renderActiveFilters()}

      {/* Categories View */}
      {showCategoryView ? (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Cuisine Categories Section */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Cuisine Type</Text>
            <View style={styles.categoriesGrid}>
              {CUISINE_CATEGORIES.map((item, index) => (
                <View 
                  key={item.id} 
                  style={[
                    styles.categoryCardWrapper,
                    index % 2 === 0 ? styles.cardLeft : styles.cardRight,
                  ]}
                >
                  {renderCategoryCard({ item, index })}
                </View>
              ))}
            </View>
          </View>

          {/* Meal-based Section */}
          <View style={styles.mealSectionContainer}>
            <View style={styles.mealSectionHeader}>
              <View style={styles.mealSectionLine} />
              <Text style={styles.mealSectionTitle}>Meal-based</Text>
              <View style={styles.mealSectionLine} />
            </View>
            <View style={styles.categoriesGrid}>
              {MEAL_CATEGORIES.map((item, index) => (
                <View 
                  key={item.id} 
                  style={[
                    styles.categoryCardWrapper,
                    index % 2 === 0 ? styles.cardLeft : styles.cardRight,
                  ]}
                >
                  {renderCategoryCard({ item, index })}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <>
          {/* Results Count */}
          <View style={styles.resultsBar}>
            <Text style={styles.resultsText}>
              {filteredPlaces.length} {filteredPlaces.length === 1 ? 'restaurant' : 'restaurants'} found
            </Text>
          </View>

          {/* Places Grid */}
          <FlatList
            data={filteredPlaces}
            renderItem={renderPlaceCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No restaurants found</Text>
                <Text style={styles.emptySubtext}>Try selecting a different category</Text>
              </View>
            }
          />
        </>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Restaurants</Text>
              <TouchableOpacity
                onPress={() => setShowFilters(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Cuisine Categories */}
              <Text style={styles.filterLabel}>Cuisine Type</Text>
              <View style={styles.filterOptions}>
                {CUISINE_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.filterOption,
                      selectedCategory === cat.id && styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedCategory(cat.id);
                      setShowFilters(false);
                      setShowCategoryView(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedCategory === cat.id && styles.filterOptionTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Meal Categories */}
              <Text style={[styles.filterLabel, { marginTop: spacing.lg }]}>Meal-based</Text>
              <View style={styles.filterOptions}>
                {MEAL_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.filterOption,
                      selectedCategory === cat.id && styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedCategory(cat.id);
                      setShowFilters(false);
                      setShowCategoryView(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedCategory === cat.id && styles.filterOptionTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageMenu(false)}
        >
          <View style={styles.languageModalContent}>
            <View style={styles.languageModalHeader}>
              <Text style={styles.languageModalTitle}>Select Language</Text>
              <TouchableOpacity
                onPress={() => setShowLanguageMenu(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.languageOption, language === 'English' && styles.languageOptionActive]}
                onPress={() => {
                  setLanguage('English');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[styles.languageOptionText, language === 'English' && styles.languageOptionTextActive]}>English</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.languageOption, language === 'Tamil' && styles.languageOptionActive]}
                onPress={() => {
                  setLanguage('Tamil');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[styles.languageOptionText, language === 'Tamil' && styles.languageOptionTextActive]}>தமிழ் (Tamil)</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
    ...shadows.sm,
  },
  languageCode: {
    ...typography.labelMedium,
    color: colors.teal,
    fontWeight: '700',
  },
  activeFiltersContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardBackground,
  },
  activeFilterTag: {
    backgroundColor: colors.teal + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.teal,
  },
  activeFilterText: {
    ...typography.labelSmall,
    color: colors.teal,
  },
  clearFiltersButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  clearFiltersText: {
    ...typography.labelSmall,
    color: colors.red,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
  },
  mealSectionContainer: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg,
    marginTop: spacing.md,
  },
  mealSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  mealSectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  mealSectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    fontWeight: '700',
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCardWrapper: {
    width: '48.5%',
    marginBottom: spacing.sm,
  },
  resultsBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  resultsText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  listContainer: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '100%',
    height: 140,
    backgroundColor: colors.cardBackground,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardLeft: {
    marginRight: spacing.xs,
  },
  cardRight: {
    marginLeft: spacing.xs,
  },
  categoryImageContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  categoryImage: {
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
  categoryLabelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  categoryLabel: {
    ...typography.labelLarge,
    color: colors.textLight,
    fontWeight: '700',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  placeCard: {
    width: '48.5%',
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },
  placeImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.border,
  },
  placeInfo: {
    padding: spacing.sm,
  },
  placeName: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  placeLocation: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  placeMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: colors.red + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  categoryBadgeText: {
    ...typography.labelSmall,
    color: colors.red,
    fontSize: 9,
  },
  ratingRow: {
    marginTop: 4,
  },
  ratingText: {
    ...typography.labelSmall,
    color: colors.yellow,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.h4,
    color: colors.textSecondary,
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
    ...typography.h4,
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
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  filterLabel: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.cardBackground,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  filterOptionText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
  filterOptionTextActive: {
    color: colors.textLight,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: colors.teal,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    ...typography.labelMedium,
    color: colors.textLight,
    fontWeight: '600',
  },
  languageModalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: spacing.xl,
    marginTop: 'auto',
  },
  languageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageModalTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  languageOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageOptionActive: {
    backgroundColor: colors.teal + '10',
  },
  languageOptionText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  languageOptionTextActive: {
    color: colors.teal,
    fontWeight: '600',
  },
});
