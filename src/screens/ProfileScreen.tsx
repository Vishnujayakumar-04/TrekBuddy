import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { uploadProfilePhoto } from '../utils/storageService';
import { updateUserProfile } from '../utils/firestore';
import { MenuIcon, ArrowBackIcon } from '../components/icons';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface ProfileScreenProps {
  navigation?: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { isDark } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (userProfile?.profilePhotoUrl) {
      setSelectedImageUri(null); // Reset when profile loads
    }
  }, [userProfile]);

  const handleMenuPress = () => {
    setShowMenu(true);
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload a profile photo');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
        setShowImagePicker(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedImageUri || !user) {
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Firebase Storage
      const profilePhotoUrl = await uploadProfilePhoto(user.uid, selectedImageUri);
      
      // Update Firestore profile
      await updateUserProfile(user.uid, {
        profilePhotoUrl,
      });

      // Refresh user profile
      await refreshUserProfile();

      setSelectedImageUri(null);
      Alert.alert('Success', 'Profile photo updated successfully!');
    } catch (error: any) {
      console.error('Error saving profile photo:', error);
      Alert.alert('Error', error.message || 'Failed to save profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMenuOption = (option: string) => {
    setShowMenu(false);
    switch (option) {
      case 'theme':
        navigation?.navigate('Settings', { section: 'theme' });
        break;
      case 'language':
        navigation?.navigate('Settings', { section: 'language' });
        break;
      case 'history':
        navigation?.navigate('History');
        break;
      case 'logout':
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            onPress: async () => {
              try {
                const { auth } = await import('../firebase');
                await auth.signOut();
                Alert.alert('Success', 'Logged out successfully');
              } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to logout');
              }
            },
          },
        ]);
        break;
    }
  };

  const displayName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';
  const displayEmail = userProfile?.email || user?.email || '';
  const profilePhotoUrl = userProfile?.profilePhotoUrl || user?.photoURL || null;
  const currentPhotoUri = selectedImageUri || profilePhotoUrl;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <LinearGradient
        colors={['#0E7C86', '#4ECDC4']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <MenuIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Your account</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Photo Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity
              style={styles.profilePhotoContainer}
              onPress={() => setShowImagePicker(true)}
              disabled={isUploading}
            >
              {currentPhotoUri ? (
                <Image source={{ uri: currentPhotoUri }} style={styles.profilePhoto} />
              ) : (
                <View style={[styles.profilePhotoPlaceholder, { backgroundColor: '#FFFFFF' }]}>
                  <Text style={styles.profilePhotoIcon}>👤</Text>
                </View>
              )}
              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
              )}
              <View style={[styles.editBadge, { backgroundColor: '#0E7C86' }]}>
                <Text style={styles.editBadgeText}>✏️</Text>
              </View>
            </TouchableOpacity>

            <Text style={[styles.profileName, { color: '#000000' }]}>{displayName}</Text>
            {displayEmail && (
              <Text style={[styles.profileEmail, { color: '#666666' }]}>{displayEmail}</Text>
            )}

            {/* Save Photo Button (only show if image is selected but not saved) */}
            {selectedImageUri && !isUploading && (
              <TouchableOpacity
                style={[styles.savePhotoButton, { backgroundColor: '#0E7C86' }, shadows.md]}
                onPress={handleSavePhoto}
              >
                <Text style={styles.savePhotoButtonText}>Save Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* User Info Section */}
          <View style={[styles.infoSection, { backgroundColor: '#FFFFFF' }]}>
            <Text style={[styles.sectionTitle, { color: '#000000' }]}>Account Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: '#666666' }]}>Name</Text>
              <Text style={[styles.infoValue, { color: '#000000' }]}>
                {userProfile?.name || displayName}
              </Text>
            </View>

            {displayEmail && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: '#666666' }]}>Email</Text>
                <Text style={[styles.infoValue, { color: '#000000' }]}>{displayEmail}</Text>
              </View>
            )}

            {userProfile?.phone && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: '#666666' }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: '#000000' }]}>{userProfile.phone}</Text>
              </View>
            )}
          </View>

          {/* Settings Section */}
          <View style={[styles.settingsSection, { backgroundColor: '#FFFFFF' }]}>
            <Text style={[styles.sectionTitle, { color: '#000000' }]}>Settings</Text>
            
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation?.navigate('Settings')}
            >
              <Text style={styles.settingsItemIcon}>⚙️</Text>
              <Text style={[styles.settingsItemText, { color: '#000000' }]}>App Settings</Text>
              <Text style={styles.settingsItemArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.imagePickerOverlay}>
          <View style={[styles.imagePickerContent, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.imagePickerHeader}>
              <Text style={[styles.imagePickerTitle, { color: '#000000' }]}>Select Photo</Text>
              <TouchableOpacity
                onPress={() => setShowImagePicker(false)}
                style={styles.imagePickerCloseButton}
              >
                <Text style={[styles.imagePickerCloseText, { color: '#666666' }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.imagePickerOption, { borderBottomColor: '#E2E8F0' }]}
              onPress={handlePickImage}
            >
              <Text style={[styles.imagePickerOptionText, { color: '#000000' }]}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={[styles.imagePickerOptionText, { color: '#666666' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.menuOverlay}>
          <TouchableOpacity
            style={styles.menuOverlayTouchable}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />
          <View style={[styles.menuContent, { backgroundColor: '#FFFFFF' }]}>
            <View style={[styles.menuHeader, { borderBottomColor: '#E2E8F0' }]}>
              <Text style={[styles.menuTitle, { color: '#000000' }]}>Menu</Text>
              <TouchableOpacity
                onPress={() => setShowMenu(false)}
                style={styles.menuCloseButton}
              >
                <Text style={[styles.menuCloseText, { color: '#666666' }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuScrollView}>
              {/* Theme */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuOption('theme')}
              >
                <Text style={styles.menuItemIcon}>🌓</Text>
                <Text style={[styles.menuItemText, { color: '#000000' }]}>Theme</Text>
              </TouchableOpacity>

              {/* App Language */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuOption('language')}
              >
                <Text style={styles.menuItemIcon}>🌐</Text>
                <Text style={[styles.menuItemText, { color: '#000000' }]}>App Language</Text>
              </TouchableOpacity>

              {/* History */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuOption('history')}
              >
                <Text style={styles.menuItemIcon}>📜</Text>
                <Text style={[styles.menuItemText, { color: '#000000' }]}>History</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={[styles.menuDivider, { backgroundColor: '#E2E8F0' }]} />

              {/* Logout */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuOption('logout')}
              >
                <Text style={styles.menuItemIcon}>🚪</Text>
                <Text style={[styles.menuItemText, styles.menuItemTextLogout, { color: '#E84A4A' }]}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: STATUSBAR_HEIGHT,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  menuButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h3,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    padding: spacing.md,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  profilePhotoContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profilePhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profilePhotoIcon: {
    fontSize: 48,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editBadgeText: {
    fontSize: 18,
  },
  profileName: {
    ...typography.h4,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.bodyMedium,
    marginBottom: spacing.md,
  },
  savePhotoButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  savePhotoButtonText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoSection: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.labelLarge,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  infoLabel: {
    ...typography.bodyMedium,
  },
  infoValue: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  settingsSection: {
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingsItemIcon: {
    fontSize: 24,
    marginRight: spacing.md,
    width: 32,
  },
  settingsItemText: {
    ...typography.bodyLarge,
    flex: 1,
  },
  settingsItemArrow: {
    fontSize: 24,
    color: '#999999',
  },
  menuOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  menuOverlayTouchable: {
    flex: 1,
  },
  menuContent: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    ...shadows.lg,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  menuTitle: {
    ...typography.h4,
    fontWeight: '700',
  },
  menuCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuCloseText: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuScrollView: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: spacing.md,
    width: 32,
  },
  menuItemText: {
    ...typography.bodyLarge,
    flex: 1,
  },
  menuItemTextLogout: {
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  imagePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  imagePickerContent: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: spacing.xl,
  },
  imagePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  imagePickerTitle: {
    ...typography.h4,
    fontWeight: '700',
  },
  imagePickerCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerCloseText: {
    fontSize: 18,
    fontWeight: '600',
  },
  imagePickerOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  imagePickerOptionText: {
    ...typography.bodyLarge,
  },
});

