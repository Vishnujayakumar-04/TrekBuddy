import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { SearchBar } from '../components/SearchBar';
import { CategoryCard } from '../components/CategoryCard';
import { getCategoryKey } from '../utils/api';
import { ALL_CATEGORIES, Category } from '../data/categories';
import { ArrowBackIcon } from '../components/icons';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface ExploreScreenProps {
  navigation?: any;
}

export default function ExploreScreen({ navigation }: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter categories based on search
  const filteredCategories = searchQuery
    ? ALL_CATEGORIES.filter(cat => 
        cat.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ALL_CATEGORIES;

  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
        >
          <ArrowBackIcon size={20} color="#000000" />
        </TouchableOpacity>
          <Text style={styles.title}>Explore</Text>
      </View>

        {/* Search Bar */}
      <View style={styles.searchContainer}>
          <SearchBar
          placeholder="Search categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
      </View>

      {/* Categories Grid */}
          <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      >
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Results (${filteredCategories.length})` : 'All Categories'}
        </Text>
        
        <View style={styles.grid}>
          {filteredCategories.map((item, index) => (
            <View key={item.id} style={styles.gridItem}>
                <CategoryCard
                image={item.image}
                  label={item.label}
                onPress={() => handleCategoryPress(item.id, item.label)}
                  index={index}
                  animated={true}
                />
              </View>
            ))}
        </View>

        {filteredCategories.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  title: {
    ...typography.h4,
    color: '#000000',
  },
  searchContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  gridContainer: {
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    ...typography.labelMedium,
    color: '#666666',
    marginLeft: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  gridItem: {
    width: '48.5%',
    marginBottom: spacing.sm,
  },
  emptyState: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodySmall,
    color: '#666666',
  },
});
