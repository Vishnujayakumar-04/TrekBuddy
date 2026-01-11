import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar, FlatList, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, SectionTitle } from '../components/ui';
import { TransportIcon, ArrowBackIcon } from '../components/icons';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import busRoutesData from '../data/busRoutes.json';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface TransportScreenProps {
  navigation?: any;
}

interface BusRoute {
  id: string;
  routeNumber?: string;
  from: string;
  fromTamil?: string;
  to: string;
  toTamil?: string;
  stops: string[];
  stopsTamil?: string[];
  ticketPrice: string;
  frequency?: string;
  operatingHours?: string;
  routeType?: 'Local' | 'Intercity' | 'Express';
}

// Rental options
const RENTALS = [
  { id: 'bike', icon: '🏍️', label: 'Bike Rental', description: 'Two-wheeler rentals', color: '#0E7C86' },
  { id: 'cycle', icon: '🚲', label: 'Cycle Rental', description: 'Eco-friendly rides', color: '#2176FF' },
  { id: 'car', icon: '🚗', label: 'Car Rental', description: 'Self-drive cars', color: '#F4C430' },
];

// Cab options
const CABS = [
  { id: 'car-cab', icon: '🚕', label: 'Car Cab', description: 'Premium car service', color: '#F4C430' },
  { id: 'bike-taxi', icon: '🏍️', label: 'Bike Taxi', description: 'Quick bike rides', color: '#0E7C86' },
  { id: 'auto', icon: '🛺', label: 'Auto', description: 'Auto rickshaw', color: '#2176FF' },
  { id: 'share-auto', icon: '🛺', label: 'Share Auto', description: 'Shared rides', color: '#0E7C86' },
];

export default function TransportScreen({ navigation }: TransportScreenProps) {
  const [activeTab, setActiveTab] = useState<'rentals' | 'cabs' | 'public'>('rentals');
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const [showBusRoutes, setShowBusRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);


  useEffect(() => {
    try {
      const data = busRoutesData as BusRoute[];
      setBusRoutes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading bus routes:', error);
      setBusRoutes([]);
    }
  }, []);

  const handleItemPress = (category: string, label: string) => {
    navigation?.navigate('Category', { category, label });
  };

  const handleBusRoutePress = (route: BusRoute) => {
    setSelectedRoute(route);
    setShowRouteDetails(true);
  };

  const renderTransportCard = (item: typeof RENTALS[0]) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.transportCard}
      onPress={() => handleItemPress(item.id, item.label)}
      activeOpacity={0.8}
    >
      <Card style={[styles.cardContent, shadows.sm]}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
          <Text style={styles.iconEmoji}>{item.icon}</Text>
        </View>
        <Text style={styles.cardLabel}>{item.label}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Settings Icon */}
        <LinearGradient
          colors={['#2176FF', '#6BA3FF']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            {/* Header Text */}
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Transport</Text>
              <Text style={styles.headerSubtitle}>Get around Pondicherry</Text>
            </View>

            {/* Transport Icon */}
            <View style={styles.headerIcon}>
              <TransportIcon size={40} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'rentals' && styles.tabActive]}
              onPress={() => setActiveTab('rentals')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === 'rentals' && styles.tabTextActive]}>
                🚗 Rentals
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'cabs' && styles.tabActive]}
              onPress={() => setActiveTab('cabs')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === 'cabs' && styles.tabTextActive]}>
                🚕 Cabs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => navigation?.navigate('BusHome')}
              activeOpacity={0.8}
            >
              <Text style={styles.tabText}>
                🚌 Bus
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content based on active tab */}
          {activeTab === 'rentals' ? (
            <>
              <SectionTitle title="Vehicle Rentals" subtitle="Self-drive options" />
              <View style={styles.gridContainer}>
                {RENTALS.map(renderTransportCard)}
              </View>
            </>
          ) : activeTab === 'cabs' ? (
            <>
              <SectionTitle title="Cab Services" subtitle="Book a ride" />
              <View style={styles.gridContainer}>
                {CABS.map(renderTransportCard)}
              </View>
            </>
          ) : (
            <>
              <SectionTitle title="Bus Routes" subtitle="Public transport options" />
              {busRoutes.length === 0 ? (
                <Card style={[styles.emptyCard, shadows.sm]}>
                  <Text style={styles.emptyText}>No bus routes available yet</Text>
                  <Text style={styles.emptySubtext}>Bus route data will be added soon</Text>
                </Card>
              ) : (
                <FlatList
                  data={busRoutes}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.busRouteCard}
                      onPress={() => handleBusRoutePress(item)}
                      activeOpacity={0.8}
                    >
                      <Card style={[styles.routeCardContent, shadows.sm]}>
                        {item.routeNumber && (
                          <View style={styles.routeNumberBadge}>
                            <Text style={styles.routeNumberText}>Route {item.routeNumber}</Text>
                          </View>
                        )}
                        <View style={styles.routeHeader}>
                          <View style={styles.routePoint}>
                            <Text style={styles.routePointLabel}>From</Text>
                            <Text style={styles.routePointValue}>{item.from}</Text>
                          </View>
                          <Text style={styles.routeArrow}>→</Text>
                          <View style={styles.routePoint}>
                            <Text style={styles.routePointLabel}>To</Text>
                            <Text style={styles.routePointValue}>{item.to}</Text>
                          </View>
                        </View>
                        <View style={styles.routeInfo}>
                          <View style={styles.routeInfoItem}>
                            <Text style={styles.routeInfoLabel}>Stops</Text>
                            <Text style={styles.routeInfoValue}>{item.stops.length} stops</Text>
                          </View>
                          <View style={styles.routeInfoItem}>
                            <Text style={styles.routeInfoLabel}>Ticket Price</Text>
                            <Text style={styles.routeInfoValuePrice}>{item.ticketPrice}</Text>
                          </View>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  )}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </>
          )}

          {/* Quick Info Card */}
          <Card style={[styles.infoCard, shadows.sm]}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoTitle}>Quick Tip</Text>
            </View>
            <Text style={styles.infoText}>
              {activeTab === 'rentals' 
                ? 'Carry a valid driving license and ID proof for all rentals. Helmets are mandatory for two-wheelers.'
                : 'Always negotiate fares before starting your ride. Use metered autos when available for fair pricing.'}
            </Text>
          </Card>

          {/* Fare Info */}
          <Card style={[styles.fareCard, shadows.sm]}>
            <Text style={styles.fareTitle}>Estimated Fares</Text>
            <View style={styles.fareRow}>
              <View style={styles.fareItem}>
                <Text style={styles.fareLabel}>Auto (Base)</Text>
                <Text style={styles.fareValue}>₹25-30</Text>
              </View>
              <View style={styles.fareItem}>
                <Text style={styles.fareLabel}>Per Km</Text>
                <Text style={styles.fareValue}>₹10-15</Text>
              </View>
              <View style={styles.fareItem}>
                <Text style={styles.fareLabel}>Share Auto</Text>
                <Text style={styles.fareValue}>₹10-20</Text>
              </View>
            </View>
          </Card>

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bus Route Details Modal */}
      <Modal
        visible={showRouteDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRouteDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bus Route Details</Text>
              <TouchableOpacity
                onPress={() => setShowRouteDetails(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedRoute && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {selectedRoute.routeNumber && (
                  <View style={styles.modalRouteNumber}>
                    <Text style={styles.modalRouteNumberText}>Route {selectedRoute.routeNumber}</Text>
                  </View>
                )}

                <View style={styles.modalRouteHeader}>
                  <View style={styles.modalRoutePoint}>
                    <Text style={styles.modalRoutePointLabel}>From</Text>
                    <Text style={styles.modalRoutePointValue}>{selectedRoute.from}</Text>
                    {selectedRoute.fromTamil && (
                      <Text style={styles.modalRoutePointTamil}>{selectedRoute.fromTamil}</Text>
                    )}
                  </View>
                  <Text style={styles.modalRouteArrow}>→</Text>
                  <View style={styles.modalRoutePoint}>
                    <Text style={styles.modalRoutePointLabel}>To</Text>
                    <Text style={styles.modalRoutePointValue}>{selectedRoute.to}</Text>
                    {selectedRoute.toTamil && (
                      <Text style={styles.modalRoutePointTamil}>{selectedRoute.toTamil}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Ticket Price</Text>
                  <Text style={styles.modalTicketPrice}>{selectedRoute.ticketPrice}</Text>
                </View>

                {selectedRoute.operatingHours && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Operating Hours</Text>
                    <Text style={styles.modalSectionValue}>{selectedRoute.operatingHours}</Text>
                  </View>
                )}

                {selectedRoute.frequency && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Frequency</Text>
                    <Text style={styles.modalSectionValue}>{selectedRoute.frequency}</Text>
                  </View>
                )}

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Stops ({selectedRoute.stops.length})</Text>
                  <View style={styles.stopsContainer}>
                    {selectedRoute.stops.map((stop, index) => (
                      <View key={index} style={styles.stopItem}>
                        <View style={styles.stopNumber}>
                          <Text style={styles.stopNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.stopName}>{stop}</Text>
                        {selectedRoute.stopsTamil && selectedRoute.stopsTamil[index] && (
                          <Text style={styles.stopNameTamil}>{selectedRoute.stopsTamil[index]}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  headerIcon: {
    marginLeft: spacing.md,
    opacity: 0.9,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: radius.md,
    marginHorizontal: spacing.xs / 2,
  },
  tabActive: {
    backgroundColor: '#0E7C86',
  },
  tabText: {
    ...typography.labelMedium,
    color: '#666666',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.md,
  },
  transportCard: {
    width: '50%',
    padding: spacing.xs,
  },
  cardContent: {
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: radius.lg,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconEmoji: {
    fontSize: 28,
  },
  cardLabel: {
    ...typography.labelMedium,
    color: '#000000',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  cardDescription: {
    ...typography.bodySmall,
    color: '#666666',
    textAlign: 'center',
  },
  infoCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: '#0E7C8610',
    borderWidth: 1,
    borderColor: '#0E7C8630',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  infoTitle: {
    ...typography.labelMedium,
    color: '#0E7C86',
    fontWeight: '600',
  },
  infoText: {
    ...typography.bodySmall,
    color: '#666666',
    lineHeight: 20,
  },
  fareCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  fareTitle: {
    ...typography.labelMedium,
    color: '#000000',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  fareItem: {
    alignItems: 'center',
  },
  fareLabel: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
  },
  fareValue: {
    ...typography.h4,
    color: '#F4C430',
    fontWeight: '700',
  },
  busRouteCard: {
    marginBottom: spacing.md,
  },
  routeCardContent: {
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  routeNumberBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0E7C8620',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  routeNumberText: {
    ...typography.labelSmall,
    color: '#0E7C86',
    fontWeight: '600',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  routePoint: {
    flex: 1,
  },
  routePointLabel: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
  },
  routePointValue: {
    ...typography.labelMedium,
    color: '#000000',
    fontWeight: '600',
  },
  routeArrow: {
    ...typography.h3,
    color: '#0E7C86',
    marginHorizontal: spacing.sm,
    fontWeight: '700',
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  routeInfoItem: {
    flex: 1,
  },
  routeInfoLabel: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
  },
  routeInfoValue: {
    ...typography.labelMedium,
    color: '#000000',
  },
  routeInfoValuePrice: {
    ...typography.labelMedium,
    color: '#F4C430',
    fontWeight: '700',
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: radius.lg,
  },
  emptyText: {
    ...typography.labelMedium,
    color: '#000000',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: '#666666',
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
    maxHeight: '90%',
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
  modalRouteNumber: {
    alignSelf: 'flex-start',
    backgroundColor: '#0E7C8620',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  modalRouteNumberText: {
    ...typography.labelMedium,
    color: '#0E7C86',
    fontWeight: '700',
  },
  modalRouteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalRoutePoint: {
    flex: 1,
  },
  modalRoutePointLabel: {
    ...typography.bodySmall,
    color: '#666666',
    marginBottom: spacing.xs,
  },
  modalRoutePointValue: {
    ...typography.h4,
    color: '#000000',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  modalRoutePointTamil: {
    ...typography.bodySmall,
    color: '#666666',
  },
  modalRouteArrow: {
    ...typography.h2,
    color: '#0E7C86',
    marginHorizontal: spacing.md,
    fontWeight: '700',
  },
  modalSection: {
    marginBottom: spacing.lg,
  },
  modalSectionTitle: {
    ...typography.labelMedium,
    color: '#000000',
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  modalSectionValue: {
    ...typography.bodyMedium,
    color: '#666666',
  },
  modalTicketPrice: {
    ...typography.h3,
    color: '#F4C430',
    fontWeight: '700',
  },
  stopsContainer: {
    marginTop: spacing.sm,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  stopNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0E7C8620',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stopNumberText: {
    ...typography.labelSmall,
    color: '#0E7C86',
    fontWeight: '700',
  },
  stopName: {
    ...typography.bodyMedium,
    color: '#000000',
    flex: 1,
  },
  stopNameTamil: {
    ...typography.bodySmall,
    color: '#666666',
    marginTop: 2,
  },
});
