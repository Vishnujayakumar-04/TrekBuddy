'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Trash2, Sparkles, MapPin, Compass } from 'lucide-react';
import { toast } from 'sonner';

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

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: getMockResponse(userMessage.text),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500);
    };

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
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-cyan-500" />
                        AI <span className="text-cyan-500">Travel Guide</span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Your 24/7 personal assistant for Puducherry</p>
                </div>
                <Button variant="outline" size="sm" onClick={clearChat} className="gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors rounded-full px-4">
                    <Trash2 className="w-4 h-4" /> Clear History
                </Button>
            </div>

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

// Simple mock logic for demo
function getMockResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('beach') || q.includes('sea')) {
        return "You must visit Promenade Beach for the sunrise and Paradise Beach for water sports! Serenity Beach is also great for surfing.";
    }
    if (q.includes('food') || q.includes('restaurant') || q.includes('eat') || q.includes('cafe')) {
        return "For French cuisine, try Villa Shanti or Carte Blanche. For local Chettinad style, Appachi is highly recommended. Don't forget to try the wood-fired pizzas at Cafe Xtasi and gelato at GMT!";
    }
    if (q.includes('temple') || q.includes('church') || q.includes('ashram')) {
        return "Manakula Vinayagar Temple is famous for its elephant blessings. The Immaculate Conception Cathedral is stunning. And of course, Sri Aurobindo Ashram is the spiritual heart of the city.";
    }
    if (q.includes('hotel') || q.includes('stay')) {
        return "If you want heritage, try Palais de Mahe. for luxury, The Promenade. For budget stays, there are many guest houses near the Ashram.";
    }
    if (q.includes('history') || q.includes('culture')) {
        return "Puducherry has a rich French colonial history. Visit the French Quarter (White Town), the Museum, and the Bharathi Park to learn more about its dual heritage.";
    }
    if (q.includes('shopping')) {
        return "Check out Sunday Market for bargains, or boutiques like Casablanca and Anokhi for curated clothes and crafts.";
    }
    return "That's an interesting question! Puducherry is full of surprises. Have you explored the Ashram area or the Sunday Market yet?";
}
