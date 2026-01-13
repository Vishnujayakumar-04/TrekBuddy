import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking, Platform, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFadeInAnimation } from '../hooks/useFadeInAnimation';
import { Card, SectionTitle } from '../components/ui';
import { LottieAnimation } from '../components/LottieAnimation';
import { LOTTIE_ANIMATIONS } from '../assets/lottie/animations';
import { PhoneEmergencyIcon, HospitalIcon, PoliceBadgeIcon, FireIcon, PharmacyIcon } from '../components/icons';
import { getCategoryData, Place } from '../utils/api';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface EmergencyScreenTabProps {
  navigation?: any;
}

export default function EmergencyScreenTab({ navigation }: EmergencyScreenTabProps) {
  const fadeInStyle = useFadeInAnimation(300, 0);
  const [hospitals, setHospitals] = useState<Place[]>([]);
  const [police, setPolice] = useState<Place[]>([]);
  const [fire, setFire] = useState<Place[]>([]);
  const [pharmacies, setPharmacies] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [hospitalsData, policeData, fireData, pharmaciesData] = await Promise.all([
          getCategoryData('hospitals'),
          getCategoryData('police'),
          getCategoryData('fire'),
          getCategoryData('pharmacy'),
        ]);
        setHospitals(hospitalsData);
        setPolice(policeData);
        setFire(fireData);
        setPharmacies(pharmaciesData);
      } catch (error) {
        console.error('Error loading emergency data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      console.error('Unable to make call');
    });
  };

  // Get colors inside component to avoid module initialization issues
  const emergencyBlocks = [
    { id: 'ambulance', label: 'Ambulance', phone: '108', color: '#E84A4A' },
    { id: 'police', label: 'Police', phone: '100', color: '#2176FF' },
    { id: 'fire', label: 'Fire', phone: '101', color: '#E84A4A' },
  ];

  const renderEmergencyBlock = (block: typeof emergencyBlocks[0]) => (
    <TouchableOpacity
      key={block.id}
      style={[styles.emergencyBlock, { backgroundColor: block.color + '15', borderColor: block.color }]}
      onPress={() => handleCall(block.phone)}
      activeOpacity={0.7}
    >
      <Text style={[styles.emergencyBlockLabel, { color: block.color }]}>{block.label}</Text>
      <Text style={[styles.emergencyBlockPhone, { color: block.color }]}>{block.phone}</Text>
    </TouchableOpacity>
  );

  const renderServiceCard = (service: any, icon: React.ReactNode) => (
    <Card key={service.id} style={styles.serviceCard}>
      <View style={styles.serviceContent}>
        <View style={styles.serviceIconContainer}>{icon}</View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{service.name}</Text>
          {service.description && (
            <Text style={styles.serviceDescription}>{service.description}</Text>
          )}
          {service.address && (
            <Text style={styles.serviceAddress}>{service.address}</Text>
          )}
        </View>
      </View>
      {service.phone && (
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall(service.phone)}
        >
          <Text style={styles.callButtonText}>Call {service.phone}</Text>
        </TouchableOpacity>
      )}
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <LinearGradient
          colors={['#E84A4A', '#FF8A8A']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>SOS</Text>
              <Text style={styles.headerSubtitle}>Emergency Services</Text>
            </View>
            <PhoneEmergencyIcon size={40} color="#FFFFFF" />
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <LottieAnimation
            source={LOTTIE_ANIMATIONS.emergency}
            width={120}
            height={120}
            loop={true}
            autoPlay={true}
          />
          <Text style={styles.loadingText}>Loading emergency contacts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Red Gradient Header with Settings Icon */}
          <LinearGradient
            colors={['#E84A4A', '#FF8A8A']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>SOS</Text>
                <Text style={styles.headerSubtitle}>Emergency Services</Text>
              </View>
              <View style={{ opacity: 0.9 }}>
                <LottieAnimation
                  source={LOTTIE_ANIMATIONS.emergency}
                  width={50}
                  height={50}
                  loop={true}
                  autoPlay={true}
                />
              </View>
            </View>
          </LinearGradient>

        <Animated.View style={[styles.content, fadeInStyle]}>
          {/* Emergency Blocks: Ambulance, Police, Fire */}
          <View style={styles.emergencyBlocksContainer}>
            {emergencyBlocks.map(block => renderEmergencyBlock(block))}
          </View>

          {/* Hospitals Section */}
          <SectionTitle title="Hospitals" />
          {hospitals.length > 0 ? (
            hospitals.map(service => renderServiceCard(service, <HospitalIcon size={32} color="#E84A4A" />))
          ) : (
            <Card style={styles.serviceCard}>
              <View style={styles.serviceContent}>
                <View style={styles.serviceIconContainer}>
                  <HospitalIcon size={32} color="#E84A4A" />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>General Hospital</Text>
                  <Text style={styles.serviceDescription}>24/7 Emergency Services</Text>
                  <Text style={styles.serviceAddress}>Pondicherry</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall('108')}
              >
                <Text style={styles.callButtonText}>Call 108</Text>
              </TouchableOpacity>
            </Card>
          )}

          {/* Police Stations Section */}
          <SectionTitle title="Police Stations" />
          {police.length > 0 ? (
            police.map(service => renderServiceCard(service, <PoliceBadgeIcon size={32} color="#2176FF" />))
          ) : (
            <Card style={styles.serviceCard}>
              <View style={styles.serviceContent}>
                <View style={styles.serviceIconContainer}>
                  <PoliceBadgeIcon size={32} color="#2176FF" />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>Police Station</Text>
                  <Text style={styles.serviceDescription}>24/7 Emergency Services</Text>
                  <Text style={styles.serviceAddress}>Pondicherry</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall('100')}
              >
                <Text style={styles.callButtonText}>Call 100</Text>
              </TouchableOpacity>
            </Card>
          )}

          {/* Fire Department Section */}
          <SectionTitle title="Fire Department" />
          {fire.length > 0 ? (
            fire.map(service => renderServiceCard(service, <FireIcon size={32} color="#E84A4A" />))
          ) : (
            <Card style={styles.serviceCard}>
              <View style={styles.serviceContent}>
                <View style={styles.serviceIconContainer}>
                  <FireIcon size={32} color="#E84A4A" />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>Fire Station</Text>
                  <Text style={styles.serviceDescription}>24/7 Emergency Services</Text>
                  <Text style={styles.serviceAddress}>Pondicherry</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall('101')}
              >
                <Text style={styles.callButtonText}>Call 101</Text>
              </TouchableOpacity>
            </Card>
          )}

          {/* Pharmacies Section */}
          <SectionTitle title="Pharmacies" />
          {pharmacies.length > 0 ? (
            pharmacies.map(service => renderServiceCard(service, <PharmacyIcon size={32} color="#0E7C86" />))
          ) : (
            <Card style={styles.serviceCard}>
              <View style={styles.serviceContent}>
                <View style={styles.serviceIconContainer}>
                  <PharmacyIcon size={32} color="#0E7C86" />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>24/7 Pharmacy</Text>
                  <Text style={styles.serviceDescription}>Emergency Medicines Available</Text>
                  <Text style={styles.serviceAddress}>Pondicherry</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall('104')}
              >
                <Text style={styles.callButtonText}>Call 104</Text>
              </TouchableOpacity>
            </Card>
          )}

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </Animated.View>
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
  emergencyBlocksContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  emergencyBlock: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    alignItems: 'center',
    ...shadows.sm,
  },
  emergencyBlockLabel: {
    ...typography.labelMedium,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  emergencyBlockPhone: {
    ...typography.h3,
    fontWeight: '700',
  },
  serviceCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  serviceContent: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  serviceIconContainer: {
    marginRight: spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    ...typography.cardLabel,
    color: '#000000',
    marginBottom: spacing.xs,
  },
  serviceDescription: {
    ...typography.cardText,
    marginBottom: spacing.xs,
  },
  serviceAddress: {
    ...typography.bodySmall,
    color: '#777777',
  },
  callButton: {
    backgroundColor: '#E84A4A',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  callButtonText: {
    ...typography.buttonText,
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
});
