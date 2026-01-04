'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    MessageSquare,
    Send,
    Search,
    User,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messageText, setMessageText] = useState('');

    const conversations = [
        {
            id: '1',
            name: 'Mrs. Adeyemi (Parent)',
            type: 'parent',
            lastMessage: 'Thank you for the update on Chioma\'s progress.',
            timestamp: '2 hours ago',
            unread: 2,
            avatar: 'Mrs-Adeyemi'
        },
        {
            id: '2',
            name: 'David Okafor (Student)',
            type: 'student',
            lastMessage: 'Can I submit my assignment tomorrow?',
            timestamp: '1 day ago',
            unread: 0,
            avatar: 'David'
        },
        {
            id: '3',
            name: 'Mr. Ibrahim (Parent)',
            type: 'parent',
            lastMessage: 'I would like to discuss Sarah\'s attendance.',
            timestamp: '3 days ago',
            unread: 1,
            avatar: 'Mr-Ibrahim'
        },
    ];

    const messages = selectedConversation ? [
        { id: '1', sender: 'them', text: 'Good morning, I wanted to discuss my child\'s recent test results.', time: '10:30 AM' },
        { id: '2', sender: 'me', text: 'Good morning! I\'d be happy to discuss that. Your child scored 85% on the recent mathematics test.', time: '10:35 AM' },
        { id: '3', sender: 'them', text: 'Thank you for the update on Chioma\'s progress.', time: '10:40 AM' },
    ] : [];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Messages
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Communicate with parents and students.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
                {/* Conversations List */}
                <Card className="glass border-none shadow-soft overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-white/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search conversations..."
                                className="h-10 pl-9 pr-4 rounded-lg border-gray-200 text-sm font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={cn(
                                    "p-3 rounded-xl cursor-pointer transition-colors flex items-start gap-3",
                                    selectedConversation?.id === conv.id ? "bg-brand-50 border border-brand-100" : "hover:bg-gray-50 border border-transparent"
                                )}
                            >
                                <Avatar className="w-10 h-10 border border-white">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.avatar}`} />
                                    <AvatarFallback>{conv.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-bold text-sm text-gray-900 truncate">{conv.name}</p>
                                        {conv.unread > 0 && (
                                            <Badge className="bg-brand-600 text-white hover:bg-brand-600 text-xs h-5 min-w-[20px] px-1">
                                                {conv.unread}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate font-medium">{conv.lastMessage}</p>
                                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{conv.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Message Thread */}
                <Card className="lg:col-span-2 glass border-none shadow-soft overflow-hidden flex flex-col">
                    {selectedConversation ? (
                        <>
                            <div className="p-4 border-b border-gray-100 bg-white/50 flex items-center gap-3">
                                <Avatar className="w-10 h-10 border border-white">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation.avatar}`} />
                                    <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-gray-900">{selectedConversation.name}</p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        {selectedConversation.type === 'parent' ? <User className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                                        <span className="font-medium capitalize">{selectedConversation.type}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex",
                                            msg.sender === 'me' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "max-w-[70%] p-3 rounded-2xl",
                                            msg.sender === 'me'
                                                ? "bg-brand-600 text-white rounded-br-sm"
                                                : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
                                        )}>
                                            <p className="text-sm font-medium">{msg.text}</p>
                                            <p className={cn(
                                                "text-[10px] mt-1 font-medium",
                                                msg.sender === 'me' ? "text-brand-100" : "text-gray-400"
                                            )}>
                                                {msg.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-gray-100 bg-white/50">
                                <div className="flex gap-2">
                                    <Textarea
                                        placeholder="Type your message..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        className="min-h-[60px] resize-none font-medium"
                                    />
                                    <Button className="h-[60px] px-6 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl">
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center p-8">
                            <div>
                                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">Select a conversation to start messaging</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
