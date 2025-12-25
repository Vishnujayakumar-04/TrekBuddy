import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowBackIcon } from '../components/icons';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { auth } from '../firebase';
import { getGeminiChatResponse } from '../utils/geminiChat';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserSubcollectionPath } from '../firebase/firestoreStructure';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  createdAt?: any;
}

interface AIChatbotScreenProps {
  navigation?: any;
}

export default function AIChatbotScreen({ navigation }: AIChatbotScreenProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      Alert.alert('Login Required', 'Please login to use AI Assistant', [
        { text: 'OK', onPress: () => navigation?.goBack() },
      ]);
      return;
    }

    // Load chat history from Firestore
    loadChatHistory();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToChatHistory();
    
    // Listen to auth state changes
    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigation?.goBack();
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
      authUnsubscribe();
    };
  }, []);

  const loadChatHistory = async () => {
    if (!auth.currentUser) return;

    try {
      setLoadingHistory(true);
      const chatsPath = getUserSubcollectionPath(auth.currentUser.uid, 'chats');
      const chatsRef = collection(db, chatsPath);
      const q = query(chatsRef, orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const history: ChatMessage[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          question: data.question || '',
          answer: data.answer || '',
          timestamp: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          createdAt: data.createdAt,
        };
      });
      
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const subscribeToChatHistory = () => {
    if (!auth.currentUser) return () => {};

    try {
      const chatsPath = getUserSubcollectionPath(auth.currentUser.uid, 'chats');
      const chatsRef = collection(db, chatsPath);
      const q = query(chatsRef, orderBy('createdAt', 'asc'));
      
      return onSnapshot(
        q,
        (querySnapshot) => {
          const history: ChatMessage[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              question: data.question || '',
              answer: data.answer || '',
              timestamp: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              createdAt: data.createdAt,
            };
          });
          setMessages(history);
          setLoadingHistory(false);
        },
        (error) => {
          console.error('Error in chat history subscription:', error);
          setLoadingHistory(false);
          // Continue without real-time updates if there's an error
        }
      );
    } catch (error) {
      console.error('Error subscribing to chat history:', error);
      setLoadingHistory(false);
      return () => {};
    }
  };

  const handleAskAI = async () => {
    if (!input.trim()) {
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Login Required', 'Please login to use AI Assistant');
      return;
    }

    // Check internet connection (basic check)
    // Note: For production, install @react-native-community/netinfo
    // For now, we'll catch network errors in the try-catch

    const question = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      question,
      answer: '',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Get AI response
      const aiReply = await getGeminiChatResponse(question);

      // Update message with answer
      const updatedMessage: ChatMessage = {
        ...userMessage,
        answer: aiReply,
      };
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? updatedMessage : msg)));

      // Save to Firestore
      if (auth.currentUser) {
        try {
          const chatsPath = getUserSubcollectionPath(auth.currentUser.uid, 'chats');
          await addDoc(collection(db, chatsPath), {
            question,
            answer: aiReply,
            createdAt: serverTimestamp(),
          });
        } catch (firestoreError: any) {
          console.error('Error saving chat to Firestore:', firestoreError);
          // Don't fail the chat if Firestore save fails (might be offline)
          // User can still see the response
        }
      }
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      
      // Check if it's a network error
      const errorMessage = error.message || '';
      if (errorMessage.includes('Network') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
        Alert.alert('No Internet', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', errorMessage || 'Failed to get AI response. Please try again.');
      }
      
      // Remove the message if it failed
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  if (loadingHistory) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.teal} />
          <Text style={styles.loadingText}>Loading chat history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <LinearGradient
        colors={colors.gradientTeal}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowBackIcon size={24} color={colors.textLight} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>AI Travel Assistant</Text>
            <Text style={styles.headerSubtitle}>Ask me anything about Pondicherry</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🤖</Text>
            <Text style={styles.emptyTitle}>Start a Conversation</Text>
            <Text style={styles.emptyText}>
              Ask me about places, food, culture, or anything related to Pondicherry!
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <View key={message.id}>
              {/* User Question */}
              <View style={styles.userMessageContainer}>
                <View style={styles.userMessage}>
                  <Text style={styles.userMessageText}>{message.question}</Text>
                </View>
              </View>

              {/* AI Answer */}
              {message.answer ? (
                <View style={styles.aiMessageContainer}>
                  <View style={styles.aiMessage}>
                    <Text style={styles.aiMessageText}>{message.answer}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.aiMessageContainer}>
                  <ActivityIndicator size="small" color={colors.teal} />
                </View>
              )}
            </View>
          ))
        )}
        {isLoading && (
          <View style={styles.aiMessageContainer}>
            <ActivityIndicator size="small" color={colors.teal} />
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about places, food, culture..."
          placeholderTextColor={colors.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, shadows.md, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleAskAI}
          activeOpacity={0.8}
          disabled={!input.trim() || isLoading}
        >
          <LinearGradient
            colors={colors.gradientTeal}
            style={styles.sendButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  header: {
    paddingTop: STATUSBAR_HEIGHT + spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
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
    color: colors.textLight,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    color: colors.textLight,
    opacity: 0.9,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
  },
  userMessage: {
    backgroundColor: colors.teal,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: '80%',
  },
  userMessageText: {
    ...typography.bodyMedium,
    color: colors.textLight,
  },
  aiMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.md,
  },
  aiMessage: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiMessageText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  sendButtonText: {
    ...typography.labelMedium,
    color: colors.textLight,
    fontWeight: '600',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

