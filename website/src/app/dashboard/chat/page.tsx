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
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">AI Guide</h1>
                    <p className="text-sm text-muted-foreground">Your personal travel assistant for Puducherry</p>
                </div>
                <Button variant="outline" size="sm" onClick={clearChat} className="gap-2">
                    <Trash2 className="w-4 h-4" /> Clear Chat
                </Button>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden shadow-md">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <Avatar className="h-8 w-8 mt-1">
                                {message.sender === 'bot' ? (
                                    <>
                                        <AvatarImage src="/images/bot-avatar.png" />
                                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="w-4 h-4" /></AvatarFallback>
                                    </>
                                ) : (
                                    <>
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-secondary text-secondary-foreground"><User className="w-4 h-4" /></AvatarFallback>
                                    </>
                                )}
                            </Avatar>
                            <div
                                className={`max-w-[80%] rounded-lg p-3 text-sm ${message.sender === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-card border shadow-sm'
                                    }`}
                            >
                                {message.text}
                                <div className={`text-[10px] mt-1 text-right ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-3">
                            <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="w-4 h-4" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-card border shadow-sm rounded-lg p-3 flex items-center gap-1">
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                            placeholder="Ask about places to visit..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!inputText.trim() || isTyping}>
                            <Send className="w-4 h-4" />
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
