'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Trash2 } from 'lucide-react';
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
            text: "Hello! I'm TrekBuddy AI. Ask me anything about Puducherry - best beaches, history, or food spots!",
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
        setMessages([]);
        toast.success('Chat history cleared');
    };

    return (
        <div className="container py-8 max-w-4xl h-[calc(100vh-80px)] flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">AI <span className="text-cyan-500">Guide</span></h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your personal travel assistant for Puducherry</p>
                </div>
                <Button variant="outline" size="sm" onClick={clearChat} className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" /> Clear Chat
                </Button>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden shadow-xl border-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-md ring-1 ring-slate-200 dark:ring-slate-800">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <Avatar className="h-10 w-10 mt-1 ring-2 ring-offset-2 ring-slate-100 dark:ring-slate-800">
                                {message.sender === 'bot' ? (
                                    <>
                                        <AvatarImage src="/images/bot-avatar.png" />
                                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white"><Bot className="w-5 h-5" /></AvatarFallback>
                                    </>
                                ) : (
                                    <>
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-slate-900 dark:bg-slate-700 text-white"><User className="w-5 h-5" /></AvatarFallback>
                                    </>
                                )}
                            </Avatar>
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-sm ${message.sender === 'user'
                                    ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                    }`}
                            >
                                {message.text}
                                <div className={`text-[10px] mt-2 text-right ${message.sender === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-4">
                            <Avatar className="h-10 w-10 mt-1">
                                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white"><Bot className="w-5 h-5" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-1 shadow-sm">
                                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-t border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleSendMessage} className="flex gap-3 max-w-3xl mx-auto">
                        <Input
                            placeholder="Ask about places, food, or history..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-cyan-500 rounded-full px-6 shadow-inner"
                        />
                        <Button type="submit" size="icon" className="h-12 w-12 rounded-full bg-cyan-600 hover:bg-cyan-700 shadow-lg hover:shadow-cyan-500/25 transition-all" disabled={!inputText.trim() || isTyping}>
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
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
    if (q.includes('food') || q.includes('restaurant') || q.includes('eat')) {
        return "For French cuisine, try Villa Shanti or Carte Blanche. For local Chettinad style, Appachi is highly recommended. Don't forget to try the wood-fired pizzas at Cafe Xtasi!";
    }
    if (q.includes('temple')) {
        return "Manakula Vinayagar Temple is the most famous one, dedicated to Lord Ganesha. The architectural details are stunning.";
    }
    if (q.includes('history') || q.includes('culture')) {
        return "Puducherry has a rich French colonial history. Visit the French Quarter (White Town), the Museum, and the Bharathi Park to learn more.";
    }
    return "That's an interesting question! Puducherry is full of surprises. Have you explored the Ashram area yet?";
}
