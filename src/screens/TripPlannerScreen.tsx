import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FadeInView } from '../components/animations/FadeInView';
import { Card, Button, IconButton } from '../components/ui';
import { CalendarLargeIcon, MinusIcon, PlusIcon, CheckmarkIcon } from '../components/icons';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface TripPlannerScreenProps {
  navigation?: any;
}

export default function TripPlannerScreen({ navigation }: TripPlannerScreenProps) {
  const [days, setDays] = useState(3);

  const handleMinus = () => {
    if (days > 1) {
      setDays(days - 1);
    }
  };

  const handlePlus = () => {
    if (days < 30) {
      setDays(days + 1);
    }
  };

  const handleGenerateItinerary = () => {
    navigation?.navigate('TripPlannerInput');
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
              <Text style={styles.headerTitle}>Trip Planner</Text>
              <Text style={styles.headerSubtitle}>Plan your perfect trip</Text>
            </View>

            {/* Calendar Icon */}
            <CalendarLargeIcon size={40} color="#FFFFFF" />
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {/* Days Selection Card */}
          <FadeInView delay={100}>
            <Card style={styles.daysCard}>
              <Text style={styles.daysQuestion}>How many days are you staying?</Text>
              
              <View style={styles.daysSelector}>
                <FadeInView delay={200}>
                  <IconButton
                    icon={<MinusIcon size={24} color="#0E7C86" />}
                    onPress={handleMinus}
                    size={48}
                    backgroundColor="#FFFFFF"
                  />
                </FadeInView>
                
                <FadeInView delay={250}>
                  <View style={styles.daysNumberContainer}>
                    <Text style={styles.daysNumber}>{days}</Text>
                    <Text style={styles.daysLabel}>days</Text>
                  </View>
                </FadeInView>
                
                <FadeInView delay={200}>
                  <IconButton
                    icon={<PlusIcon size={24} color="#0E7C86" />}
                    onPress={handlePlus}
                    size={48}
                    backgroundColor="#FFFFFF"
                  />
                </FadeInView>
              </View>

              {/* Generate Itinerary Button */}
              <FadeInView delay={300}>
                <Button
                  title="Generate Itinerary"
                  onPress={handleGenerateItinerary}
                  size="large"
                  style={styles.generateButton}
                  icon={<CheckmarkIcon size={20} color="#FFFFFF" />}
                  pulse={true}
                />
              </FadeInView>
            </Card>
          </FadeInView>

          {/* Quick Tips */}
          <FadeInView delay={400}>
            <Card style={[styles.tipCard, shadows.sm]}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipTitle}>Planning Tips</Text>
              <Text style={styles.tipText}>
                • Best time to visit: October to March{'\n'}
                • Weekdays are less crowded{'\n'}
                • Book accommodations in advance
              </Text>
            </Card>
          </FadeInView>

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  daysCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  daysQuestion: {
    ...typography.cardLabel,
    color: '#000000',
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  daysSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    gap: spacing.lg,
  },
  daysNumberContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  daysNumber: {
    ...typography.h1,
    color: '#0E7C86',
    fontSize: 48,
    fontWeight: '700',
  },
  daysLabel: {
    ...typography.subtitle,
    color: '#777777',
    marginTop: spacing.xs,
  },
  generateButton: {
    width: '100%',
    marginTop: spacing.md,
  },
  tipCard: {
    padding: spacing.lg,
    marginTop: spacing.lg,
    alignItems: 'center',
    backgroundColor: '#0E7C8610',
    borderWidth: 1,
    borderColor: '#0E7C8630',
  },
  tipIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  tipTitle: {
    ...typography.labelMedium,
    color: '#0E7C86',
    marginBottom: spacing.sm,
  },
  tipText: {
    ...typography.bodySmall,
    color: '#666666',
    lineHeight: 22,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
});
