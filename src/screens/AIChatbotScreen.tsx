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
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { auth } from '../firebase/auth';
import {
  sendAIMessage,
  getChatHistory,
  subscribeToChatHistory,
  ChatMessage
} from '../utils/firebaseAI';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

// ChatMessage interface is imported from firebaseAI

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
    const unsubscribe = setupChatSubscription();

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
      const history = await getChatHistory(auth.currentUser.uid);
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const setupChatSubscription = () => {
    if (!auth.currentUser) return () => { };

    try {
      return subscribeToChatHistory(auth.currentUser.uid, (messages) => {
        setMessages(messages);
        setLoadingHistory(false);
      });
    } catch (error) {
      console.error('Error setting up chat subscription:', error);
      setLoadingHistory(false);
      return () => { };
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
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Get AI response and save to Firestore using Firebase AI service
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const { answer: aiReply, messageId } = await sendAIMessage(
        auth.currentUser.uid,
        question
      );

      // Update message with answer
      const updatedMessage: ChatMessage = {
        ...userMessage,
        id: messageId,
        answer: aiReply,
      };
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? updatedMessage : msg)));
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
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7C86" />
          <Text style={styles.loadingText}>Loading chat history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <LinearGradient
        colors={['#0E7C86', '#4ECDC4']}
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
            <ArrowBackIcon size={24} color="#FFFFFF" />
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
                  <ActivityIndicator size="small" color="#0E7C86" />
                </View>
              )}
            </View>
          ))
        )}
        {isLoading && (
          <View style={styles.aiMessageContainer}>
            <ActivityIndicator size="small" color="#0E7C86" />
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about places, food, culture..."
          placeholderTextColor="#666666"
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
            colors={['#0E7C86', '#4ECDC4']}
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
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodyMedium,
    color: '#666666',
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
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
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
    color: '#000000',
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: '#666666',
    textAlign: 'center',
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
  },
  userMessage: {
    backgroundColor: '#0E7C86',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: '80%',
  },
  userMessageText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
  },
  aiMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.md,
  },
  aiMessage: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiMessageText: {
    ...typography.bodyMedium,
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.bodyMedium,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

