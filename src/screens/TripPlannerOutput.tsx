import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import { Card, GradientHeader, Button } from '../components/ui';
import { ExpandableDayCard } from '../components/ExpandableDayCard';
import { LottieAnimation } from '../components/LottieAnimation';
import { LOTTIE_ANIMATIONS } from '../assets/lottie/animations';
import { TripItinerary, Activity, DayItinerary, generateTripItinerary } from '../utils/gemini';
import { TripInput } from './TripPlannerInput';
import { getAllPlaces } from '../utils/api';
import { saveTrip, StoredTrip } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { saveTrip as saveTripToFirestore } from '../utils/firestore';
import { addToHistory } from '../utils/firestore';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

interface TripPlannerOutputProps {
  route?: {
    params?: {
      tripInput: TripInput;
    };
  };
  navigation?: any;
}

export default function TripPlannerOutput({ route, navigation }: TripPlannerOutputProps) {
  const { user } = useAuth();
  const { tripInput } = route?.params || {};
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (tripInput) {
      loadItinerary();
    }
  }, [tripInput]);

  const loadItinerary = async () => {
    setIsLoading(true);
    try {
      const allPlaces = await getAllPlaces();
      const result = await generateTripItinerary(
        tripInput!.startDate,
        tripInput!.endDate,
        tripInput!.budget,
        tripInput!.categories,
        tripInput!.travelMode,
        allPlaces
      );
      setItinerary(result);
    } catch (error) {
      console.error('Error loading itinerary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTripToStorage = async () => {
    if (!tripInput || !itinerary) {
      Alert.alert('Error', 'Trip data is missing');
      return;
    }

    setIsSaving(true);
    try {
      const trip: StoredTrip = {
        id: Date.now().toString(),
        startDate: tripInput.startDate,
        endDate: tripInput.endDate,
        budget: tripInput.budget,
        travelMode: tripInput.travelMode,
        categories: tripInput.categories,
        itinerary: itinerary,
        createdAt: new Date().toISOString(),
      };

      // Save to local storage (which will sync to Firestore if authenticated)
      await saveTrip(trip);

      // Also save directly to Firestore if user is authenticated
      if (user) {
        try {
          await saveTripToFirestore(user.uid, trip);
          
          // Add to history
          await addToHistory(user.uid, {
            type: 'trip',
            title: `Trip from ${tripInput.startDate} to ${tripInput.endDate}`,
            date: new Date().toISOString(),
            details: `${tripInput.categories.join(', ')} - Budget: ₹${tripInput.budget}`,
            tripId: trip.id,
          });
        } catch (firestoreError) {
          console.error('Error saving to Firestore:', firestoreError);
          // Don't fail the save - local save succeeded
        }
      }

      setIsSaved(true);
      
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (err: any) {
      console.error('Error saving trip:', err);
      Alert.alert('Error', err.message || 'Failed to save trip');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenMap = (mapUrl: string) => {
    Linking.openURL(mapUrl).catch(() => {
      console.error('Unable to open maps');
    });
  };

  const renderActivity = (activity: Activity, index: number) => (
    <View key={index} style={styles.activityItem}>
      <View style={styles.activityLeft}>
        <View style={styles.redDot} />
        <View style={styles.activityContent}>
          <Text style={styles.activityTime}>{activity.time}</Text>
          {index > 0 && activity.travelTime && activity.travelTime > 0 && (
            <Text style={styles.travelTime}>Travel: ~{activity.travelTime} min</Text>
          )}
          <Text style={styles.activityPlace}>{activity.place}</Text>
          <Text style={styles.activityCategory}>{activity.category}</Text>
          <Text style={styles.activityDuration}>{activity.duration}</Text>
          {activity.cost > 0 && (
            <Text style={styles.activityCost}>Cost: ₹{activity.cost}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => handleOpenMap(activity.mapUrl)}
      >
        <Text style={styles.mapButtonText}>Map</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDay = (dayItinerary: DayItinerary) => (
    <ExpandableDayCard
      key={dayItinerary.day}
      dayItinerary={dayItinerary}
      renderActivity={renderActivity}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <GradientHeader
          title="Your Itinerary"
          subtitle="Generating your perfect trip"
          gradientType="teal"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7C86" />
          <Text style={styles.loadingText}>Generating your trip itinerary...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!itinerary) {
    return (
      <SafeAreaView style={styles.container}>
        <GradientHeader
          title="Your Itinerary"
          subtitle="Unable to generate itinerary"
          gradientType="teal"
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to generate itinerary</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <GradientHeader
          title="Your Itinerary"
          subtitle={`${itinerary.totalDays} days in Pondicherry`}
          gradientType="teal"
        />

        <View style={styles.content}>
          {/* Summary Card */}
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Trip Summary</Text>
            <Text style={styles.summaryText}>{itinerary.summary}</Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Days</Text>
                <Text style={styles.statValue}>{itinerary.totalDays}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Budget</Text>
                <Text style={styles.statValue}>₹{itinerary.totalBudget}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Estimated Cost</Text>
                <Text style={[styles.statValue, { color: itinerary.estimatedCost <= itinerary.totalBudget ? '#48BB78' : '#ED8936' }]}>
                  ₹{itinerary.estimatedCost}
                </Text>
              </View>
            </View>
          </Card>

          {itinerary.days.map(day => renderDay(day))}
          
          {/* Save Trip Button */}
          <Button
            title={isSaved ? "Trip Saved!" : "Save Trip"}
            onPress={saveTripToStorage}
            size="large"
            style={styles.saveButton}
            loading={isSaving}
            disabled={isSaving || isSaved}
            variant={isSaved ? 'secondary' : 'primary'}
          />

          <View style={{ height: spacing.xl }} />
        </View>
      </ScrollView>

      {/* Success Animation Modal */}
      {isSaved && (
        <Modal
          transparent={true}
          visible={isSaved}
          animationType="fade"
          onRequestClose={() => setIsSaved(false)}
        >
          <View style={styles.successModal}>
            <View style={styles.successModalContent}>
              <LottieAnimation
                source={LOTTIE_ANIMATIONS.success}
                width={150}
                height={150}
                loop={false}
                autoPlay={true}
              />
              <Text style={styles.successText}>Trip Saved!</Text>
              <Text style={styles.successSubtext}>Your itinerary has been saved locally</Text>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.bodyMedium,
    color: '#666666',
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.h3,
    color: '#E84A4A',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: '#0E7C86',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  retryButtonText: {
    ...typography.buttonText,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  activityLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E84A4A',
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  activityContent: {
    flex: 1,
  },
  activityTime: {
    ...typography.labelMedium,
    color: '#2176FF',
    marginBottom: spacing.xs,
  },
  activityPlace: {
    ...typography.cardLabel,
    color: '#000000',
    marginBottom: spacing.xs,
  },
  activityCategory: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
  },
  activityDuration: {
    ...typography.bodySmall,
    color: '#777777',
  },
  travelTime: {
    ...typography.bodySmall,
    color: '#2176FF',
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  activityCost: {
    ...typography.bodySmall,
    color: '#F4C430',
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  mapButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#2176FF15',
    borderRadius: radius.md,
    marginLeft: spacing.md,
  },
  mapButtonText: {
    ...typography.labelSmall,
    color: '#2176FF',
  },
  saveButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  summaryCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  summaryTitle: {
    ...typography.h3,
    color: '#000000',
    marginBottom: spacing.md,
  },
  summaryText: {
    ...typography.bodyMedium,
    color: '#666666',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    ...typography.bodySmall,
    color: '#777777',
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h4,
    color: '#0E7C86',
    fontWeight: '700',
  },
  successModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.lg,
    minWidth: 280,
  },
  successText: {
    ...typography.h3,
    color: '#000000',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  successSubtext: {
    ...typography.bodyMedium,
    color: '#666666',
    textAlign: 'center',
  },
});
