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
import { ArrowBackIcon, FilterIcon, LanguageIcon } from '../components/icons';
import { Place } from '../utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

// Import nature data
import natureData from '../data/nature.json';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

type Language = 'English' | 'Tamil';
type NatureCategory = 'All' | 'Garden' | 'Zoo' | 'Bird Sanctuary' | 'Waterfall' | 'Dam' | 'Lake' | 'River';

interface NaturePlace {
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
  openingTimeWeekdays: string;
  closingTimeWeekdays: string;
  openingTimeWeekends: string;
  closingTimeWeekends: string;
  description: {
    whenFormed?: string;
    whoNamed?: string;
    whyCreated?: string;
    maintenance?: string;
    typeOfPlace?: string;
    whatCanBeSeen?: string[];
    visitorPurpose?: string;
    specialFeatures?: string;
  };
  images: string[];
  entryFee: string;
  dressCode: string;
  phoneNumber: string;
  emergencyContact?: string;
  policeHelpline?: string;
  crowdLevel: string;
  famousThings: string[];
  famousMonths: string;
  famousMonthsTamil?: string;
  whatHappensDuringFamousTimes?: {
    peakSeason?: string;
    migratoryBirds?: string;
    monsoonWaterflow?: string;
    festivals?: string;
    specialEvents?: string;
  };
  activitiesAndSafety?: {
    activitiesAllowed?: string[];
    activitiesNotAllowed?: string[];
    safetyRules?: string[];
    environmentalProtection?: string[];
  };
  rating: number;
}

interface NatureScreenProps {
  navigation?: any;
}

const NATURE_CATEGORIES: { id: NatureCategory; label: string; labelTamil: string; image: string }[] = [
  { id: 'Garden', label: 'Gardens', labelTamil: 'பூங்காக்கள்', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800' },
  { id: 'Zoo', label: 'Zoo', labelTamil: 'விலங்குக் காட்சிச்சாலை', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800' },
  { id: 'Bird Sanctuary', label: 'Bird Sanctuary', labelTamil: 'பறவை சரணாலயம்', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800' },
  { id: 'Waterfall', label: 'Waterfalls', labelTamil: 'அருவிகள்', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
  { id: 'Dam', label: 'Dams', labelTamil: 'அணைகள்', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800' },
  { id: 'Lake', label: 'Lakes', labelTamil: 'ஏரிகள்', image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800' },
  { id: 'River', label: 'Rivers', labelTamil: 'ஆறுகள்', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800' },
];

export default function NatureScreen({ navigation }: NatureScreenProps) {
  const [places, setPlaces] = useState<NaturePlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<NaturePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<NatureCategory>('All');
  const [showCategoryView, setShowCategoryView] = useState(true); // Show categories first
  const [language, setLanguage] = useState<Language>('English');
  const [showFilters, setShowFilters] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const data = natureData as NaturePlace[];
        if (isMounted) {
          setPlaces(Array.isArray(data) ? data : []);
          setFilteredPlaces(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading nature places:', error);
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
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredPlaces(filtered);
  }, [selectedCategory, places]);

  const handleCategoryPress = (category: NatureCategory) => {
    setSelectedCategory(category);
    setShowCategoryView(false);
  };

  const handlePlacePress = (place: NaturePlace) => {
    // Convert NaturePlace to Place format for PlaceDetailsScreen
    const placeForDetails: Place = {
      id: place.id,
      name: getDisplayName(place),
      image: place.images && place.images.length > 0 ? place.images[0] : '',
      description: getDisplayDescription(place),
      opening: `${place.openingTimeWeekdays} - ${place.closingTimeWeekdays}`,
      entryFee: place.entryFee || 'Free',
      rating: place.rating || 0,
      mapUrl: place.mapsUrl,
      phone: place.phoneNumber,
      category: place.category.toLowerCase(),
    };
    navigation?.navigate('PlaceDetails', { place: placeForDetails, naturePlace: place });
  };

  const getDisplayName = (place: NaturePlace): string => {
    if (language === 'Tamil' && place.nameTamil) {
      return place.nameTamil;
    }
    return place.name;
  };

  const getDisplayDescription = (place: NaturePlace): string => {
    const desc = place.description;
    let fullDesc = '';
    
    if (desc.specialFeatures) fullDesc += desc.specialFeatures + '\n\n';
    if (desc.visitorPurpose) fullDesc += desc.visitorPurpose;
    
    return fullDesc || 'Beautiful nature place in Pondicherry';
  };

  const getLanguageCode = (): string => {
    switch (language) {
      case 'Tamil': return 'TA';
      default: return 'EN';
    }
  };

  const renderCategoryCard = ({ item, index }: { item: typeof NATURE_CATEGORIES[0]; index: number }) => (
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

  const renderPlaceCard = ({ item, index }: { item: NaturePlace; index: number }) => (
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
        {item.rating > 0 && (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderActiveFilters = () => {
    if (selectedCategory === 'All') return null;

    return (
      <View style={styles.activeFiltersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.activeFilterTag}>
            <Text style={styles.activeFilterText}>{selectedCategory}</Text>
          </View>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => {
              setSelectedCategory('All');
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
        <ActivityIndicator size="large" color="#0E7C86" />
        <Text style={styles.loadingText}>Loading nature places...</Text>
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
              setSelectedCategory('All');
            }
          }}
        >
          <ArrowBackIcon size={24} color="#000000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {showCategoryView ? 'Nature' : selectedCategory === 'All' ? 'All Nature Places' : selectedCategory}
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
              <FilterIcon size={20} color="#000000" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Active Filters Display */}
      {renderActiveFilters()}

      {/* Categories View */}
      {showCategoryView ? (
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          <FlatList
            data={NATURE_CATEGORIES}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <>
          {/* Results Count */}
          <View style={styles.resultsBar}>
            <Text style={styles.resultsText}>
              {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found
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
                <Text style={styles.emptyText}>No places found</Text>
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
              <Text style={styles.modalTitle}>Filter Places</Text>
              <TouchableOpacity
                onPress={() => setShowFilters(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Category Filter */}
              <Text style={styles.filterLabel}>Category</Text>
              <View style={styles.filterOptions}>
                {(['All', ...NATURE_CATEGORIES.map(c => c.id)] as NatureCategory[]).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.filterOption,
                      selectedCategory === cat && styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setShowFilters(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedCategory === cat && styles.filterOptionTextActive,
                      ]}
                    >
                      {cat}
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
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    ...typography.bodyMedium,
    color: '#666666',
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h4,
    color: '#000000',
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
    ...shadows.sm,
  },
  languageCode: {
    ...typography.labelMedium,
    color: '#0E7C86',
    fontWeight: '700',
  },
  activeFiltersContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  activeFilterTag: {
    backgroundColor: '#0E7C8620',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: '#0E7C86',
  },
  activeFilterText: {
    ...typography.labelSmall,
    color: '#0E7C86',
  },
  clearFiltersButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  clearFiltersText: {
    ...typography.labelSmall,
    color: '#E84A4A',
    fontWeight: '600',
  },
  categoriesContainer: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: '#000000',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  resultsBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  resultsText: {
    ...typography.bodySmall,
    color: '#666666',
  },
  listContainer: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48.5%',
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
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
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  placeCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },
  placeImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  placeInfo: {
    padding: spacing.sm,
  },
  placeName: {
    ...typography.labelMedium,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 4,
  },
  placeLocation: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
  },
  placeMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: '#48BB78' + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  categoryBadgeText: {
    ...typography.labelSmall,
    color: '#48BB78',
    fontSize: 9,
  },
  ratingRow: {
    marginTop: 4,
  },
  ratingText: {
    ...typography.labelSmall,
    color: '#F4C430',
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
    color: '#666666',
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: '#666666',
    marginTop: spacing.xs,
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
    ...typography.h4,
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
    fontSize: 18,
    color: '#666666',
    fontWeight: '600',
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  filterLabel: {
    ...typography.labelMedium,
    color: '#000000',
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
    backgroundColor: '#FFFFFF',
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterOptionActive: {
    backgroundColor: '#0E7C86',
    borderColor: '#0E7C86',
  },
  filterOptionText: {
    ...typography.labelSmall,
    color: '#666666',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#0E7C86',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  languageModalContent: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#E2E8F0',
  },
  languageModalTitle: {
    ...typography.h4,
    color: '#000000',
    fontWeight: '700',
  },
  languageOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  languageOptionActive: {
    backgroundColor: '#0E7C8610',
  },
  languageOptionText: {
    ...typography.bodyMedium,
    color: '#000000',
  },
  languageOptionTextActive: {
    color: '#0E7C86',
    fontWeight: '600',
  },
});
