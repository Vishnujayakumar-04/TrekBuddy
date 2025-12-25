import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar, TextInput, Modal, Image, Alert, Switch, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { MenuIcon } from '../components/icons';
import { GoogleIcon } from '../components/icons/LoginIcons';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';
import { uploadProfilePhoto } from '../utils/storageService';
import { createUserProfile, updateUserProfile } from '../utils/firestore';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface LoginScreenProps {
  navigation?: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { language, setLanguage } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<PhoneConfirmationResult | null>(null);
  const [formData, setFormData] = useState({
    password: '',
    name: '',
    email: '',
    phone: '',
    profilePhoto: null as string | null,
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // Navigation will be handled by auth state change in StackNavigator
      // No need to navigate manually - AuthContext will update and StackNavigator will show Main
    } catch (error: any) {
      let errorMessage = 'Failed to sign in';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Upload profile photo if selected
      let profilePhotoUrl: string | undefined;
      if (formData.profilePhoto) {
        try {
          profilePhotoUrl = await uploadProfilePhoto(user.uid, formData.profilePhoto);
        } catch (error) {
          console.error('Error uploading profile photo:', error);
          // Don't fail signup if photo upload fails
        }
      }

      // Create user profile in Firestore
      await createUserProfile(user.uid, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profilePhotoUrl,
      });

      Alert.alert('Success', 'Signup successful!');
      // Reset form
      setFormData({
        password: '',
        name: '',
        email: '',
        phone: '',
        profilePhoto: null,
      });
      setIsSignup(false);
      // Navigation will be handled by auth state change in StackNavigator
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Google Sign-In can be implemented later with expo-auth-session
    Alert.alert('Coming Soon', 'Google Sign-In will be available soon');
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      // Navigation will be handled by auth state change in StackNavigator
    } catch (error: any) {
      let errorMessage = 'Failed to sign in as guest';
      if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!formData.phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      const confirmation = await sendOTP(formData.phone);
      setConfirmationResult(confirmation);
      setShowOTPModal(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || !confirmationResult) {
      Alert.alert('Error', 'Please enter OTP code');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(confirmationResult, otpCode);
      setShowOTPModal(false);
      setOtpCode('');
      setConfirmationResult(null);
      Alert.alert('Success', 'Phone authentication successful!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const [showImageConfirm, setShowImageConfirm] = useState(false);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload a profile photo');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setTempImageUri(result.assets[0].uri);
        setShowImageConfirm(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleConfirmImage = () => {
    if (tempImageUri) {
      setFormData({ ...formData, profilePhoto: tempImageUri });
      setShowImageConfirm(false);
      setTempImageUri(null);
    }
  };

  const handleCancelImage = () => {
    setShowImageConfirm(false);
    setTempImageUri(null);
  };

  const handleMenuPress = () => {
    setShowMenu(true);
  };


  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode as any);
    setShowLanguageSelection(false);
    const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    // Alert.alert('Language', `Language changed to ${selectedLang?.name}`);
  };

  const handleMenuOption = (option: string) => {
    switch (option) {
      case 'language':
        setShowLanguageSelection(true);
        break;
      case 'history':
        setShowMenu(false);
        navigation?.navigate('History');
        break;
      case 'logout':
        setShowMenu(false);
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: async () => {
            try {
              await auth.signOut();
              Alert.alert('Success', 'Logged out successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to logout');
            }
          }},
        ]);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={staticColors.gradientTeal}
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
              <MenuIcon size={24} color={staticColors.textLight} />
            </TouchableOpacity>
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{isSignup ? 'Sign Up' : 'Login'}</Text>
              <Text style={styles.headerSubtitle}>Welcome to TrekBuddy</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {isSignup ? (
            /* Signup Form */
            <>
              {/* Profile Photo */}
              <View style={styles.profilePhotoContainer}>
                <TouchableOpacity 
                  style={styles.profilePhotoButton}
                  onPress={handlePickImage}
                  disabled={isLoading}
                >
                  {formData.profilePhoto ? (
                    <Image source={{ uri: formData.profilePhoto }} style={styles.profilePhoto} />
                  ) : (
                    <View style={styles.profilePhotoPlaceholder}>
                      <Text style={styles.profilePhotoIcon}>📷</Text>
                      <Text style={styles.profilePhotoText}>Add Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {formData.profilePhoto && (
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => setFormData({ ...formData, profilePhoto: null })}
                  >
                    <Text style={styles.removePhotoText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={staticColors.textSecondary}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              {/* Email ID */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email ID *</Text>
              <TextInput
                style={styles.input}
                  placeholder="Enter your email"
                placeholderTextColor={staticColors.textSecondary}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

              {/* Phone No */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone No *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={staticColors.textSecondary}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Password */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password *</Text>
              <TextInput
                style={styles.input}
                  placeholder="Enter your password"
                placeholderTextColor={staticColors.textSecondary}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                />
            </View>

              {/* Signup Button */}
              <TouchableOpacity
                style={[styles.primaryButton, shadows.md, isLoading && styles.buttonDisabled]}
                onPress={handleSignup}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={staticColors.gradientTeal}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color={staticColors.textLight} />
                  ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Switch to Login */}
              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setIsSignup(false)}
              >
                <Text style={styles.switchText}>
                  Already have an account? <Text style={styles.switchTextBold}>Login</Text>
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            /* Login Form */
            <>
              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={staticColors.textSecondary}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={staticColors.textSecondary}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                />
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.primaryButton, shadows.md, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={staticColors.gradientTeal}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color={staticColors.textLight} />
                  ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Sign in with Google */}
              <TouchableOpacity
                style={[styles.googleButton, shadows.sm, isLoading && styles.buttonDisabled]}
                onPress={handleGoogleSignIn}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={staticColors.textPrimary} />
                ) : (
                  <>
                    <GoogleIcon size={24} color={staticColors.textPrimary} />
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Guest Login */}
              <TouchableOpacity
                style={[styles.guestButton, shadows.sm, isLoading && styles.buttonDisabled]}
                onPress={handleGuestLogin}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Text style={styles.guestButtonText}>👤 Continue as Guest</Text>
              </TouchableOpacity>

              {/* Switch to Signup */}
              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setIsSignup(true)}
              >
                <Text style={styles.switchText}>
                  Don't have an account? <Text style={styles.switchTextBold}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.menuOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />
          <View style={styles.menuContent}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity
                onPress={() => setShowMenu(false)}
                style={styles.menuCloseButton}
              >
                <Text style={styles.menuCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {/* Theme */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  navigation?.navigate('Settings', { section: 'theme' });
                }}
              >
                <Text style={styles.menuItemIcon}>🌓</Text>
                <Text style={styles.menuItemText}>Theme</Text>
              </TouchableOpacity>

              {/* App Language */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuOption('language')}
              >
                <Text style={styles.menuItemIcon}>🌐</Text>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>App Language</Text>
                  <Text style={styles.menuItemSubtext}>
                    {SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName || 'English'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* History */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuOption('history')}
              >
                <Text style={styles.menuItemIcon}>📜</Text>
                <Text style={styles.menuItemText}>History</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.menuDivider} />

              {/* Logout */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuOption('logout')}
              >
                <Text style={styles.menuItemIcon}>🚪</Text>
                <Text style={[styles.menuItemText, styles.menuItemTextLogout]}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Image Confirmation Modal */}
      <Modal
        visible={showImageConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelImage}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Photo</Text>
              <TouchableOpacity
                onPress={handleCancelImage}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {tempImageUri && (
              <Image source={{ uri: tempImageUri }} style={styles.confirmImagePreview} />
            )}
            
            <View style={styles.confirmImageActions}>
              <TouchableOpacity
                style={[styles.confirmImageButton, styles.confirmImageButtonCancel]}
                onPress={handleCancelImage}
              >
                <Text style={[styles.confirmImageButtonText, styles.confirmImageButtonTextCancel]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmImageButton, styles.confirmImageButtonSave]}
                onPress={handleConfirmImage}
              >
                <Text style={[styles.confirmImageButtonText, styles.confirmImageButtonTextSave]}>Use This Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageSelection}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageSelection(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity
                onPress={() => setShowLanguageSelection(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    language === lang.code && styles.languageOptionActive,
                  ]}
                  onPress={() => handleLanguageSelect(lang.code)}
                >
                  <View style={styles.languageOptionContent}>
                    <Text
                      style={[
                        styles.languageOptionText,
                        language === lang.code && styles.languageOptionTextActive,
                      ]}
                    >
                      {lang.nativeName}
                    </Text>
                    <Text
                      style={[
                        styles.languageOptionSubtext,
                        language === lang.code && styles.languageOptionSubtextActive,
                      ]}
                    >
                      {lang.name}
                    </Text>
        </View>
                  {language === lang.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
      </ScrollView>
          </View>
        </View>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal
        visible={showOTPModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOTPModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter OTP</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowOTPModal(false);
                  setOtpCode('');
                  setConfirmationResult(null);
                }}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.otpLabel}>Enter the OTP sent to {formData.phone}</Text>
              <TextInput
                style={styles.otpInput}
                placeholder="Enter OTP"
                placeholderTextColor={staticColors.textSecondary}
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
              <TouchableOpacity
                style={[styles.primaryButton, shadows.md, (isLoading || !otpCode) && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                activeOpacity={0.8}
                disabled={isLoading || !otpCode}
              >
                <LinearGradient
                  colors={staticColors.gradientTeal}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color={staticColors.textLight} />
                  ) : (
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Static colors (no theme switching)
const staticColors = {
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  textPrimary: '#1A202C',
  textSecondary: '#666666',
  textLight: '#FFFFFF',
  border: '#E2E8F0',
  teal: '#0E7C86',
  red: '#E84A4A',
  gradientTeal: ['#0E7C86', '#4ECDC4'],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.background,
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
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: staticColors.textLight,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    color: staticColors.textLight,
    opacity: 0.9,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.labelMedium,
    color: staticColors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: staticColors.cardBackground,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.bodyMedium,
    color: staticColors.textPrimary,
    borderWidth: 1,
    borderColor: staticColors.border,
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  profilePhotoButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: staticColors.cardBackground,
    borderWidth: 2,
    borderColor: staticColors.border,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  profilePhotoPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePhotoIcon: {
    fontSize: 40,
    marginBottom: spacing.xs,
  },
  profilePhotoText: {
    ...typography.bodySmall,
    color: staticColors.textSecondary,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: staticColors.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  confirmImagePreview: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginVertical: spacing.md,
    borderRadius: radius.md,
  },
  confirmImageActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  confirmImageButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmImageButtonCancel: {
    borderWidth: 1,
    borderColor: staticColors.border,
  },
  confirmImageButtonSave: {
    backgroundColor: staticColors.teal,
  },
  confirmImageButtonText: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  confirmImageButtonTextCancel: {
    color: staticColors.textSecondary,
  },
  confirmImageButtonTextSave: {
    color: staticColors.textLight,
  },
  primaryButton: {
    borderRadius: radius.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.labelLarge,
    color: staticColors.textLight,
    fontWeight: '700',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: staticColors.cardBackground,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: staticColors.border,
  },
  googleButtonText: {
    ...typography.labelMedium,
    color: staticColors.textPrimary,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  switchText: {
    ...typography.bodyMedium,
    color: staticColors.textSecondary,
  },
  switchTextBold: {
    color: staticColors.teal,
    fontWeight: '700',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  menuContent: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    ...shadows.lg,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: staticColors.border,
    marginBottom: spacing.md,
  },
  menuTitle: {
    ...typography.h4,
    color: staticColors.textPrimary,
    fontWeight: '700',
  },
  menuCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: staticColors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuCloseText: {
    fontSize: 18,
    color: staticColors.textSecondary,
    fontWeight: '600',
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
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    ...typography.bodyLarge,
    color: staticColors.textPrimary,
    marginBottom: spacing.xs,
  },
  menuItemSubtext: {
    ...typography.bodySmall,
    color: staticColors.textSecondary,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  themeLabel: {
    ...typography.bodySmall,
    marginHorizontal: spacing.xs,
  },
  themeLabelActive: {
    fontWeight: '600',
  },
  menuItemLogout: {
    marginTop: spacing.sm,
  },
  menuItemTextLogout: {
    color: staticColors.red,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: staticColors.border,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: staticColors.cardBackground,
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
    borderBottomColor: staticColors.border,
  },
  modalTitle: {
    ...typography.h4,
    color: staticColors.textPrimary,
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: staticColors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    color: staticColors.textSecondary,
    fontWeight: '600',
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: staticColors.border,
    backgroundColor: staticColors.cardBackground,
  },
  languageOptionActive: {
    backgroundColor: staticColors.teal + '10',
    borderColor: staticColors.teal,
  },
  languageOptionContent: {
    flex: 1,
  },
  languageOptionText: {
    ...typography.bodyLarge,
    color: staticColors.textPrimary,
    marginBottom: spacing.xs,
  },
  languageOptionTextActive: {
    color: staticColors.teal,
    fontWeight: '600',
  },
  languageOptionSubtext: {
    ...typography.bodySmall,
    color: staticColors.textSecondary,
  },
  languageOptionSubtextActive: {
    color: staticColors.teal,
  },
  checkmark: {
    ...typography.h4,
    color: staticColors.teal,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: staticColors.cardBackground,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: staticColors.border,
  },
  phoneButtonText: {
    ...typography.labelMedium,
    color: staticColors.textPrimary,
    fontWeight: '600',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: staticColors.cardBackground,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: staticColors.border,
  },
  guestButtonText: {
    ...typography.labelMedium,
    color: staticColors.textPrimary,
    fontWeight: '600',
  },
  otpLabel: {
    ...typography.bodyMedium,
    color: staticColors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  otpInput: {
    backgroundColor: staticColors.cardBackground,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.bodyLarge,
    color: staticColors.textPrimary,
    borderWidth: 1,
    borderColor: staticColors.border,
    marginBottom: spacing.lg,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
  },
});
