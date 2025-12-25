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
import { getAllReligionData, ReligionPlace, ReligionType, SubType, getSubTypesForReligion } from '../data/religion/religionDataFetcher';
import { Place } from '../utils/api';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

type Language = 'English' | 'Tamil' | 'Hindi' | 'Telugu' | 'Malayalam' | 'Kannada' | 'French';

interface ReligiousPlacesScreenProps {
  navigation?: any;
}

export default function ReligiousPlacesScreen({ navigation }: ReligiousPlacesScreenProps) {
  const [places, setPlaces] = useState<ReligionPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<ReligionPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReligion, setSelectedReligion] = useState<ReligionType | 'All'>('All');
  const [selectedSubType, setSelectedSubType] = useState<SubType | 'All'>('All');
  const [language, setLanguage] = useState<Language>('English');
  const [showFilters, setShowFilters] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const religions: ReligionType[] = ['Hindu', 'Christian', 'Muslim', 'Jain', 'Buddhist'];

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getAllReligionData();
        if (isMounted) {
          setPlaces(Array.isArray(data) ? data : []);
          setFilteredPlaces(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading temples:', error);
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

    // Filter by religion
    if (selectedReligion !== 'All') {
      filtered = filtered.filter(p => p.religion === selectedReligion);
    }

    // Filter by sub-type
    if (selectedSubType !== 'All') {
      filtered = filtered.filter(p => p.subType === selectedSubType);
    }

    setFilteredPlaces(filtered);
  }, [selectedReligion, selectedSubType, places]);

  const handlePlacePress = (place: ReligionPlace) => {
    // Convert ReligionPlace to Place format for PlaceDetailsScreen
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
      category: place.religion.toLowerCase(),
    };
    navigation?.navigate('PlaceDetails', { place: placeForDetails, religionPlace: place });
  };

  const handleReligionFilter = (religion: ReligionType | 'All') => {
    setSelectedReligion(religion);
    setSelectedSubType('All'); // Reset sub-type when religion changes
  };

  const handleSubTypeFilter = (subType: SubType | 'All') => {
    setSelectedSubType(subType);
  };

  const getDisplayName = (place: ReligionPlace): string => {
    switch (language) {
      case 'Tamil':
        return place.nameTamil || place.name;
      case 'Hindi':
        return place.nameHindi || place.name;
      case 'Telugu':
        return place.nameTelugu || place.name;
      case 'Malayalam':
        return place.nameMalayalam || place.name;
      case 'Kannada':
        return place.nameKannada || place.name;
      case 'French':
        return place.nameFrench || place.name;
      default:
        return place.name;
    }
  };

  const getDisplayDescription = (place: ReligionPlace): string => {
    switch (language) {
      case 'Tamil':
        return place.descriptionTamil || place.description;
      case 'Hindi':
        return place.descriptionHindi || place.description;
      case 'Telugu':
        return place.descriptionTelugu || place.description;
      case 'Malayalam':
        return place.descriptionMalayalam || place.description;
      case 'Kannada':
        return place.descriptionKannada || place.description;
      case 'French':
        return place.descriptionFrench || place.description;
      default:
        return place.description;
    }
  };

  const renderPlaceCard = ({ item }: { item: ReligionPlace }) => {
    if (!item) return null;
    
    return (
      <TouchableOpacity
        style={[styles.card, shadows.md]}
        onPress={() => handlePlacePress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          {item.images && item.images.length > 0 ? (
            <Image 
              source={{ uri: item.images[0] }} 
              style={styles.imageCover} 
              resizeMode="cover"
              onError={() => {}}
            />
          ) : (
            <View style={styles.fallbackImage} />
          )}
          <View style={styles.ratingBadge}>
            <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || 'N/A'}</Text>
          </View>
          <View style={styles.religionBadge}>
            <Text style={styles.religionText}>{item.religion}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.placeName} numberOfLines={2}>
            {getDisplayName(item)}
          </Text>
          <Text style={styles.subType}>{item.subType}</Text>
          <Text style={styles.subType} numberOfLines={1}>{item.subType}</Text>
          <Text style={styles.deity} numberOfLines={1}>{item.mainDeity}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⏰</Text>
            <Text style={styles.infoText} numberOfLines={1}>
              {item.openingTimeWeekdays} - {item.closingTimeWeekdays}
            </Text>
          </View>

          <View style={styles.crowdBadge}>
            <Text style={styles.crowdText}>
              {item.crowdLevel}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const availableSubTypes = selectedReligion === 'All' 
    ? [] 
    : getSubTypesForReligion(selectedReligion);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.teal} />
          <Text style={styles.loadingText}>Loading Temples...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ArrowBackIcon size={18} color={colors.teal} />
            <Text style={[styles.backButton, { marginLeft: spacing.xs }]}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Temples</Text>
        <View style={styles.headerActions}>
          {/* Language Selector */}
          <TouchableOpacity 
            onPress={() => setShowLanguageMenu(true)}
            style={styles.languageButton}
          >
            <LanguageIcon size={20} color={colors.teal} />
            <Text style={styles.languageText}>
              {language === 'English' ? 'EN' : 
               language === 'Tamil' ? 'TA' :
               language === 'Hindi' ? 'HI' :
               language === 'Telugu' ? 'TE' :
               language === 'Malayalam' ? 'ML' :
               language === 'Kannada' ? 'KN' :
               language === 'French' ? 'FR' : 'EN'}
            </Text>
          </TouchableOpacity>
          
          {/* Filter Button */}
          <TouchableOpacity 
            onPress={() => setShowFilters(true)}
            style={styles.filterButton}
          >
            <FilterIcon size={20} color={colors.teal} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters Display */}
      {(selectedReligion !== 'All' || selectedSubType !== 'All') && (
        <View style={styles.activeFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedReligion !== 'All' && (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterText}>{selectedReligion}</Text>
                <TouchableOpacity onPress={() => handleReligionFilter('All')}>
                  <Text style={styles.removeFilter}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            {selectedSubType !== 'All' && (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterText}>{selectedSubType}</Text>
                <TouchableOpacity onPress={() => handleSubTypeFilter('All')}>
                  <Text style={styles.removeFilter}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsCount}>
        <Text style={styles.resultsText}>
          {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found
        </Text>
      </View>

      {/* Place List - 2 Column Grid */}
      {filteredPlaces.length > 0 ? (
        <FlatList
          data={filteredPlaces}
          renderItem={renderPlaceCard}
          keyExtractor={(item, index) => item?.id || `place-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🕉️</Text>
          <Text style={styles.emptyTitle}>No Places Found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your filters to see more places.
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => {
              setSelectedReligion('All');
              setSelectedSubType('All');
            }}
          >
            <Text style={styles.emptyButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
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
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Religion Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Religion</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      selectedReligion === 'All' && styles.filterOptionActive
                    ]}
                    onPress={() => handleReligionFilter('All')}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedReligion === 'All' && styles.filterOptionTextActive
                    ]}>All</Text>
                  </TouchableOpacity>
                  {religions.map((religion) => (
                    <TouchableOpacity
                      key={religion}
                      style={[
                        styles.filterOption,
                        selectedReligion === religion && styles.filterOptionActive
                      ]}
                      onPress={() => handleReligionFilter(religion)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedReligion === religion && styles.filterOptionTextActive
                      ]}>{religion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sub-Type Filter */}
              {availableSubTypes.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Sub-Type</Text>
                  <View style={styles.filterOptions}>
                    <TouchableOpacity
                      style={[
                        styles.filterOption,
                        selectedSubType === 'All' && styles.filterOptionActive
                      ]}
                      onPress={() => handleSubTypeFilter('All')}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedSubType === 'All' && styles.filterOptionTextActive
                      ]}>All</Text>
                    </TouchableOpacity>
                    {availableSubTypes.map((subType) => (
                      <TouchableOpacity
                        key={subType}
                        style={[
                          styles.filterOption,
                          selectedSubType === subType && styles.filterOptionActive
                        ]}
                        onPress={() => handleSubTypeFilter(subType)}
                      >
                        <Text style={[
                          styles.filterOptionText,
                          selectedSubType === subType && styles.filterOptionTextActive
                        ]}>{subType}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
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
          <View style={styles.languageMenu}>
            <View style={styles.languageMenuHeader}>
              <Text style={styles.languageMenuTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageMenu(false)}>
                <Text style={styles.languageMenuClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.languageMenuBody} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'English' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('English');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'English' && styles.languageOptionTextActive
                ]}>🇬🇧 English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'Tamil' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('Tamil');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'Tamil' && styles.languageOptionTextActive
                ]}>🇮🇳 தமிழ் (Tamil)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'Hindi' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('Hindi');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'Hindi' && styles.languageOptionTextActive
                ]}>🇮🇳 हिंदी (Hindi)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'Telugu' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('Telugu');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'Telugu' && styles.languageOptionTextActive
                ]}>🇮🇳 తెలుగు (Telugu)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'Malayalam' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('Malayalam');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'Malayalam' && styles.languageOptionTextActive
                ]}>🇮🇳 മലയാളം (Malayalam)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'Kannada' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('Kannada');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'Kannada' && styles.languageOptionTextActive
                ]}>🇮🇳 ಕನ್ನಡ (Kannada)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  language === 'French' && styles.languageOptionActive
                ]}
                onPress={() => {
                  setLanguage('French');
                  setShowLanguageMenu(false);
                }}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === 'French' && styles.languageOptionTextActive
                ]}>🇫🇷 Français (French)</Text>
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
    ...typography.labelMedium,
    color: colors.teal,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.teal + '15',
    borderRadius: radius.sm,
    gap: spacing.xs,
  },
  languageText: {
    ...typography.labelSmall,
    color: colors.teal,
    fontWeight: '600',
  },
  filterButton: {
    padding: spacing.xs,
  },
  activeFilters: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.teal + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  activeFilterText: {
    ...typography.labelSmall,
    color: colors.teal,
  },
  removeFilter: {
    fontSize: 18,
    color: colors.teal,
    fontWeight: 'bold',
  },
  resultsCount: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.cardBackground,
  },
  resultsText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    flex: 1,
    marginHorizontal: spacing.xs,
    maxWidth: '48%',
  },
  imageContainer: {
    height: 140,
    backgroundColor: colors.background,
    position: 'relative',
  },
  imageCover: {
    width: '100%',
    height: '100%',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  rating: {
    ...typography.labelSmall,
    color: colors.textLight,
    fontSize: 11,
  },
  religionBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.blue,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  religionText: {
    ...typography.labelSmall,
    color: colors.textLight,
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    padding: spacing.sm,
  },
  placeName: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: 4,
    fontWeight: '600',
    fontSize: 13,
  },
  subType: {
    ...typography.bodySmall,
    color: colors.teal,
    marginBottom: 2,
    fontWeight: '500',
    fontSize: 10,
  },
  deity: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 2,
    fontSize: 10,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 14,
    fontSize: 10,
  },
  location: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 2,
    fontSize: 9,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  infoLabel: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginRight: 2,
    fontWeight: '600',
    fontSize: 9,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    fontSize: 9,
  },
  crowdBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.yellow + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginTop: 4,
  },
  crowdText: {
    ...typography.labelSmall,
    color: colors.yellow,
    fontSize: 9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: colors.teal,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  emptyButtonText: {
    ...typography.labelMedium,
    color: colors.textLight,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  modalClose: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  modalBody: {
    padding: spacing.lg,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterSectionTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  filterOptionText: {
    ...typography.labelMedium,
    color: colors.textSecondary,
  },
  filterOptionTextActive: {
    color: colors.textLight,
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
    backgroundColor: colors.teal,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  applyButtonText: {
    ...typography.labelMedium,
    color: colors.textLight,
  },
  languageMenu: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.xl,
    margin: spacing.lg,
    maxHeight: '70%',
    overflow: 'hidden',
    ...shadows.lg,
  },
  languageMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageMenuTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  languageMenuClose: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  languageMenuBody: {
    maxHeight: 400,
  },
  languageOption: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageOptionActive: {
    backgroundColor: colors.teal + '15',
  },
  languageOptionText: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  languageOptionTextActive: {
    color: colors.teal,
    fontWeight: '600',
  },
});
