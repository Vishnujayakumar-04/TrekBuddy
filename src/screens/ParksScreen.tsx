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

// Import parks data
import parksData from '../data/parks.json';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

type Language = 'English' | 'Tamil';

interface Park {
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
  openingTimeWeekdays?: string;
  closingTimeWeekdays?: string;
  openingTimeWeekends?: string;
  closingTimeWeekends?: string;
  description?: {
    nameOrigin?: string;
    historicalImportance?: string;
    naturalFeatures?: string;
    maintenance?: string;
    facilities?: string[];
    nearbyShops?: string[];
    specialFeatures?: string;
  };
  images: string[];
  entryFee?: string;
  dressCode?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  policeHelpline?: string;
  crowdLevel?: string;
  peakTime?: string;
  famousThings?: string[];
  famousMonths?: string;
  famousMonthsTamil?: string;
  activitiesAndSuitability?: {
    activitiesAvailable?: string[];
    suitableFor?: any;
    restrictions?: string[];
  };
  bestTimeToVisit?: string;
  seasonalNotes?: string;
  rating?: number;
}

interface ParksScreenProps {
  navigation?: any;
}

export default function ParksScreen({ navigation }: ParksScreenProps) {
  const [parks, setParks] = useState<Park[]>([]);
  const [filteredParks, setFilteredParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('English');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const data = parksData as Park[];
        if (isMounted) {
          setParks(Array.isArray(data) ? data : []);
          setFilteredParks(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading parks:', error);
        if (isMounted) {
          setParks([]);
          setFilteredParks([]);
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
    let filtered = [...parks];

    // Filter by type
    if (selectedType !== 'All') {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    setFilteredParks(filtered);
  }, [selectedType, parks]);

  const handleParkPress = (park: Park) => {
    const placeForDetails: Place = {
      id: park.id,
      name: getDisplayName(park),
      image: park.images && park.images.length > 0 ? park.images[0] : '',
      description: getDisplayDescription(park),
      opening: park.openingTimeWeekdays ? `${park.openingTimeWeekdays} - ${park.closingTimeWeekdays}` : 'Open',
      entryFee: park.entryFee || 'Free',
      rating: park.rating || 0,
      mapUrl: park.mapsUrl,
      phone: park.phoneNumber || '',
      category: park.type.toLowerCase(),
    };
    navigation?.navigate('PlaceDetails', { place: placeForDetails, park: park });
  };

  const getDisplayName = (park: Park): string => {
    if (language === 'Tamil' && park.nameTamil) {
      return park.nameTamil;
    }
    return park.name;
  };

  const getDisplayDescription = (park: Park): string => {
    const desc = park.description;
    if (!desc) return 'Park in Pondicherry';
    
    let fullDesc = '';
    if (desc.specialFeatures) fullDesc += desc.specialFeatures + '\n\n';
    if (desc.facilities && desc.facilities.length > 0) {
      fullDesc += 'Facilities: ' + desc.facilities.join(', ') + '\n\n';
    }
    if (desc.naturalFeatures) fullDesc += desc.naturalFeatures;
    
    return fullDesc || 'Park in Pondicherry';
  };

  const getLanguageCode = (): string => {
    switch (language) {
      case 'Tamil': return 'TA';
      default: return 'EN';
    }
  };

  const getUniqueTypes = (): string[] => {
    const types = parks.map(p => p.type).filter((type, index, self) => self.indexOf(type) === index);
    return ['All', ...types];
  };

  const renderParkCard = ({ item, index }: { item: Park; index: number }) => (
    <TouchableOpacity
      style={[
        styles.parkCard,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      onPress={() => handleParkPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/300x200' }}
        style={styles.parkImage}
        resizeMode="cover"
      />
      <View style={styles.parkInfo}>
        <Text style={styles.parkName} numberOfLines={2}>
          {getDisplayName(item)}
        </Text>
        <Text style={styles.parkLocation} numberOfLines={1}>
          {item.location}
        </Text>
        <View style={styles.parkMetaRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{item.type}</Text>
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
    if (selectedType === 'All') return null;

    return (
      <View style={styles.activeFiltersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.activeFilterTag}>
            <Text style={styles.activeFilterText}>{selectedType}</Text>
          </View>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => {
              setSelectedType('All');
            }}
          >
            <Text style={styles.clearFiltersText}>Clear Filter</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.teal} />
        <Text style={styles.loadingText}>Loading parks...</Text>
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
        
        <Text style={styles.headerTitle}>Parks</Text>
        
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
          {filteredParks.length} {filteredParks.length === 1 ? 'park' : 'parks'} found
        </Text>
      </View>

      {/* Parks Grid */}
      <FlatList
        data={filteredParks}
        renderItem={renderParkCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No parks found</Text>
            <Text style={styles.emptySubtext}>Try selecting a different filter</Text>
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
              <Text style={styles.modalTitle}>Filter Parks</Text>
              <TouchableOpacity
                onPress={() => setShowFilters(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Type Filter */}
              <Text style={styles.filterLabel}>Park Type</Text>
              <View style={styles.filterOptions}>
                {getUniqueTypes().map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      selectedType === type && styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedType(type);
                      setShowFilters(false);
                    }}
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
  parkCard: {
    width: '48.5%',
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
  parkImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.border,
  },
  parkInfo: {
    padding: spacing.sm,
  },
  parkName: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  parkLocation: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  parkMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  typeBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  typeBadgeText: {
    ...typography.labelSmall,
    color: colors.success,
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
