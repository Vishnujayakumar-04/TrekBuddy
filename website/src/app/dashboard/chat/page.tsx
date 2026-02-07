'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Trash2, MapPin, Compass } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, limit, serverTimestamp } from 'firebase/firestore';
import { getGeminiResponse } from '@/utils/gemini';
import { getLocalResponse } from '@/utils/localKnowledge';

import { DashboardHeader } from '@/components/layout/DashboardHeader';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function AIChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm your TrekBuddy AI Guide. I can help you plan your perfect day in Puducherry. Ask me about beaches, cafes, temples, or hidden gems!",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userText = inputText.trim(); // Normalize
        const userMessage: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        try {
            // 1. Check Local Knowledge (Instant)
            const localAnswer = getLocalResponse(userText);
            if (localAnswer) {
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: localAnswer,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
                setIsTyping(false);
                return;
            }

            // 2. Check Firestore Cache
            const cacheQuery = query(
                collection(db, 'ai_cache'),
                where('question', '==', userText.toLowerCase()),
                limit(1)
            );
            const cacheSnapshot = await getDocs(cacheQuery);

            if (!cacheSnapshot.empty) {
                const cachedData = cacheSnapshot.docs[0].data();
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: cachedData.answer,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
                setIsTyping(false);
                return;
            }

            // 3. Fallback to Gemini API
            const chatHistory = messages.map(m => ({ text: m.text, sender: m.sender }));
            const responseText = await getGeminiResponse(userText, chatHistory);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);

            // 4. Save to Firestore Cache (Async, don't block UI)
            try {
                await addDoc(collection(db, 'ai_cache'), {
                    question: userText.toLowerCase(),
                    answer: responseText,
                    createdAt: serverTimestamp()
                });
            } catch (cacheError) {
                console.error("Failed to cache response:", cacheError);
            }

        } catch (error) {
            console.error('AI response error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting right now. Please try again in a moment.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            toast.error('Failed to get AI response');
        } finally {
            setIsTyping(false);
        }
    };
    // ... rest of file

    const clearChat = () => {
        setMessages([
            {
                id: Date.now().toString(),
                text: "Chat cleared. What else can I help you with today?",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
        toast.success('Chat history cleared');
    };

    return (
        <div className="container mx-auto py-8 max-w-5xl h-[calc(100vh-80px)] flex flex-col px-4">
            <DashboardHeader
                title="AI Travel Guide"
                subtitle="Your 24/7 personal assistant for Puducherry"
                backHref="/"
                backLabel="Home"
            >
                <Button variant="outline" size="sm" onClick={clearChat} className="gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors rounded-full px-4">
                    <Trash2 className="w-4 h-4" /> Clear History
                </Button>
            </DashboardHeader>

            <Card className="flex-1 flex flex-col overflow-hidden shadow-2xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth hover:scroll-auto">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}
                        >
                            <Avatar className={`h-9 w-9 ring-2 ring-offset-2 ${message.sender === 'bot' ? 'ring-cyan-100 dark:ring-cyan-900' : 'ring-slate-100 dark:ring-slate-800'}`}>
                                {message.sender === 'bot' ? (
                                    <>
                                        <AvatarImage src="/images/bot-avatar.png" />
                                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white"><Bot className="w-5 h-5" /></AvatarFallback>
                                    </>
                                ) : (
                                    <>
                                        <AvatarFallback className="bg-slate-900 dark:bg-slate-700 text-white"><User className="w-5 h-5" /></AvatarFallback>
                                    </>
                                )}
                            </Avatar>
                            <div
                                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm md:text-base shadow-sm leading-relaxed ${message.sender === 'user'
                                    ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none'
                                    }`}
                            >
                                {message.text}
                            </div>
                            <span className="text-[10px] text-slate-300 dark:text-slate-600 whitespace-nowrap mb-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-4 items-end">
                            <Avatar className="h-9 w-9 ring-2 ring-offset-2 ring-cyan-100 dark:ring-cyan-900">
                                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white"><Bot className="w-5 h-5" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5 shadow-sm w-16 justify-center">
                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-white dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleSendMessage} className="relative flex gap-3 max-w-4xl mx-auto items-center">
                        <Input
                            placeholder="Ask about places, food, or history..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 h-14 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-cyan-500/50 rounded-full px-6 shadow-inner text-base pr-14"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className={`absolute right-2 h-10 w-10 rounded-full transition-all duration-300 ${inputText.trim() ? 'bg-cyan-600 hover:bg-cyan-700 shadow-lg scale-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 scale-90'}`}
                            disabled={!inputText.trim() || isTyping}
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                    <div className="flex justify-center mt-3 gap-6 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1 hover:text-cyan-500 transition-colors cursor-pointer"><Compass className="w-3 h-3" /> Plan a trip</span>
                        <span className="flex items-center gap-1 hover:text-cyan-500 transition-colors cursor-pointer"><MapPin className="w-3 h-3" /> Find nearby</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}


