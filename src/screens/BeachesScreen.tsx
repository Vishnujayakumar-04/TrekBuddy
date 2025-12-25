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
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

// Import beaches data
import beachesData from '../data/beaches.json';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

type Language = 'English' | 'Tamil';
type BeachType = 'All' | 'Urban Beach' | 'Island Beach' | 'Surfing Beach' | 'Quiet Beach' | 'Blue Flag Beach' | 'Private Beach' | 'Secluded Beach' | 'Fishing Village Beach' | 'Fishing Harbor Beach' | 'Backwater';
type CrowdLevel = 'All' | 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';

interface Beach {
  id: string;
  name: string;
  nameTamil?: string;
  type: string;
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
    nameOrigin?: string;
    historicalImportance?: string;
    naturalFeatures?: string;
    maintenance?: string;
    facilities?: string[];
    nearbyShops?: string[];
    specialFeatures?: string;
  };
  images: string[];
  entryFee: string;
  dressCode: string;
  phoneNumber: string;
  emergencyContact?: string;
  policeHelpline?: string;
  lifeguardAvailable: boolean;
  crowdLevel: string;
  peakTime?: string;
  famousThings: string[];
  famousMonths: string;
  famousMonthsTamil?: string;
  safetyAndActivities: {
    swimmingAllowed: boolean;
    swimmingNote?: string;
    waveIntensity?: string;
    lifeguardAvailability?: string;
    activitiesAllowed?: string[];
    safetyWarnings?: string[];
  };
  bestTimeToVisit?: string;
  rating: number;
}

interface BeachesScreenProps {
  navigation?: any;
}

export default function BeachesScreen({ navigation }: BeachesScreenProps) {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [filteredBeaches, setFilteredBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<BeachType>('All');
  const [selectedCrowd, setSelectedCrowd] = useState<CrowdLevel>('All');
  const [language, setLanguage] = useState<Language>('English');
  const [showFilters, setShowFilters] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const beachTypes: BeachType[] = ['All', 'Urban Beach', 'Island Beach', 'Surfing Beach', 'Blue Flag Beach', 'Quiet Beach', 'Fishing Village Beach', 'Backwater'];
  const crowdLevels: CrowdLevel[] = ['All', 'Very Low', 'Low', 'Medium', 'High', 'Very High'];

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const data = beachesData as Beach[];
        if (isMounted) {
          setBeaches(Array.isArray(data) ? data : []);
          setFilteredBeaches(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading beaches:', error);
        if (isMounted) {
          setBeaches([]);
          setFilteredBeaches([]);
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
    let filtered = [...beaches];

    // Filter by type
    if (selectedType !== 'All') {
      filtered = filtered.filter(b => b.type === selectedType);
    }

    // Filter by crowd level
    if (selectedCrowd !== 'All') {
      filtered = filtered.filter(b => b.crowdLevel.includes(selectedCrowd));
    }

    setFilteredBeaches(filtered);
  }, [selectedType, selectedCrowd, beaches]);

  const handleBeachPress = (beach: Beach) => {
    // Convert Beach to Place format for PlaceDetailsScreen
    const placeForDetails: Place = {
      id: beach.id,
      name: getDisplayName(beach),
      image: beach.images && beach.images.length > 0 ? beach.images[0] : '',
      description: getDisplayDescription(beach),
      opening: `${beach.openingTimeWeekdays}`,
      entryFee: beach.entryFee || 'Free',
      rating: beach.rating || 0,
      mapUrl: beach.mapsUrl,
      phone: beach.phoneNumber,
      category: 'beaches',
    };
    navigation?.navigate('PlaceDetails', { place: placeForDetails, beachData: beach });
  };

  const getDisplayName = (beach: Beach): string => {
    if (language === 'Tamil' && beach.nameTamil) {
      return beach.nameTamil;
    }
    return beach.name;
  };

  const getDisplayDescription = (beach: Beach): string => {
    const desc = beach.description;
    let fullDesc = '';
    
    if (desc.nameOrigin) fullDesc += desc.nameOrigin + '\n\n';
    if (desc.specialFeatures) fullDesc += desc.specialFeatures;
    
    return fullDesc || 'Beautiful beach in Pondicherry';
  };

  const getLanguageCode = (): string => {
    switch (language) {
      case 'Tamil': return 'TA';
      default: return 'EN';
    }
  };

  const renderBeachCard = ({ item, index }: { item: Beach; index: number }) => (
    <TouchableOpacity
      style={[
        styles.placeCard,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      onPress={() => handleBeachPress(item)}
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
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{item.type}</Text>
          </View>
          <View style={[
            styles.crowdBadge,
            item.crowdLevel.includes('High') ? styles.crowdHigh :
            item.crowdLevel.includes('Low') ? styles.crowdLow : styles.crowdMedium
          ]}>
            <Text style={styles.crowdBadgeText}>{item.crowdLevel}</Text>
          </View>
        </View>
        <View style={styles.swimmingRow}>
          <Text style={styles.swimmingText}>
            {item.safetyAndActivities.swimmingAllowed ? '🏊 Swimming Allowed' : '⚠️ No Swimming'}
          </Text>
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
    const activeFilters = [];
    if (selectedType !== 'All') activeFilters.push(selectedType);
    if (selectedCrowd !== 'All') activeFilters.push(`Crowd: ${selectedCrowd}`);

    if (activeFilters.length === 0) return null;

    return (
      <View style={styles.activeFiltersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {activeFilters.map((filter, index) => (
            <View key={index} style={styles.activeFilterTag}>
              <Text style={styles.activeFilterText}>{filter}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => {
              setSelectedType('All');
              setSelectedCrowd('All');
            }}
          >
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.teal} />
        <Text style={styles.loadingText}>Loading beaches...</Text>
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
          onPress={() => navigation?.goBack()}
        >
          <ArrowBackIcon size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Beaches</Text>
        
        <View style={styles.headerActions}>
          {/* Language Selector */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowLanguageMenu(true)}
          >
            <Text style={styles.languageCode}>{getLanguageCode()}</Text>
          </TouchableOpacity>
          
          {/* Filter Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowFilters(true)}
          >
            <FilterIcon size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters Display */}
      {renderActiveFilters()}

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          {filteredBeaches.length} {filteredBeaches.length === 1 ? 'beach' : 'beaches'} found
        </Text>
      </View>

      {/* Beaches Grid */}
      <FlatList
        data={filteredBeaches}
        renderItem={renderBeachCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No beaches found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
      />

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
              <Text style={styles.modalTitle}>Filter Beaches</Text>
              <TouchableOpacity
                onPress={() => setShowFilters(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Beach Type Filter */}
              <Text style={styles.filterLabel}>Beach Type</Text>
              <View style={styles.filterOptions}>
                {beachTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      selectedType === type && styles.filterOptionActive,
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedType === type && styles.filterOptionTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Crowd Level Filter */}
              <Text style={styles.filterLabel}>Crowd Level</Text>
              <View style={styles.filterOptions}>
                {crowdLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.filterOption,
                      selectedCrowd === level && styles.filterOptionActive,
                    ]}
                    onPress={() => setSelectedCrowd(level)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedCrowd === level && styles.filterOptionTextActive,
                      ]}
                    >
                      {level}
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
  placeCard: {
    width: '48%',
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
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
  typeBadge: {
    backgroundColor: colors.blue + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginRight: 4,
    marginBottom: 4,
  },
  typeBadgeText: {
    ...typography.labelSmall,
    color: colors.blue,
    fontSize: 9,
  },
  crowdBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  crowdLow: {
    backgroundColor: colors.green + '20',
  },
  crowdMedium: {
    backgroundColor: colors.yellow + '20',
  },
  crowdHigh: {
    backgroundColor: colors.red + '20',
  },
  crowdBadgeText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    fontSize: 9,
  },
  swimmingRow: {
    marginTop: 4,
  },
  swimmingText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    fontSize: 10,
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
