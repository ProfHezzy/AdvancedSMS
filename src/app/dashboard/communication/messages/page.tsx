'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Send,
    Search,
    User,
    MessageSquare,
    Plus,
    Phone,
    Video,
    Info,
    MoreVertical,
    CheckCheck,
    Clock
} from 'lucide-react';

export default function MessagesPage() {
    const [activeChat, setActiveChat] = useState<string | null>('1');
    const [newMessage, setNewMessage] = useState('');

    // Mock contacts
    const contacts = [
        { id: '1', name: 'John Smith (Parent)', role: 'Parent', lastMessage: 'Thank you for the update on John.', time: '10:30 AM', unread: 0, status: 'online' },
        { id: '2', name: 'Mrs. Adebayo (Principal)', role: 'Principal', lastMessage: 'Please review the staff memo.', time: 'Yesterday', unread: 2, status: 'away' },
        { id: '3', name: 'David Jones (Math)', role: 'Teacher', lastMessage: 'The project guidelines are ready.', time: 'Jan 02', unread: 0, status: 'offline' },
    ];

    // Mock messages for active chat
    const messages = [
        { id: '1', senderId: 'teacher-1', content: 'Hello Mr. Smith, just wanted to inform you that John did exceptionally well in the recent Mathematics quiz.', time: '10:15 AM', status: 'read' },
        { id: '2', senderId: '1', content: 'That is great news! Thank you for the update on John. He has been studying hard lately.', time: '10:30 AM', status: 'read' },
        { id: '3', senderId: 'teacher-1', content: 'You are welcome. We will keep encouraging him. Please ensure he completes the weekend assignment.', time: '10:35 AM', status: 'sent' },
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Sidebar / Contact List */}
            <div className="w-80 border-r border-white/10 glass flex flex-col">
                <div className="p-6 border-b border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Messages</h2>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-brand-600 hover:bg-brand-50">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input className="pl-9 h-10 border-white/10 glass text-sm" placeholder="Search contacts..." />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className={`p-4 flex gap-3 cursor-pointer transition-colors ${activeChat === contact.id ? 'bg-brand-50/50' : 'hover:bg-white/5'}`}
                            onClick={() => setActiveChat(contact.id)}
                        >
                            <div className="relative shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg">
                                    {contact.name.charAt(0)}
                                </div>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${contact.status === 'online' ? 'bg-green-500' : contact.status === 'away' ? 'bg-amber-500' : 'bg-gray-400'
                                    }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <p className={`font-semibold truncate ${activeChat === contact.id ? 'text-brand-950' : ''}`}>{contact.name}</p>
                                    <span className="text-[10px] text-muted-foreground uppercase">{contact.time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                            </div>
                            {contact.unread > 0 && (
                                <div className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-bold">
                                    {contact.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-sm">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 glass flex justify-between items-center px-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                                    {contacts.find(c => c.id === activeChat)?.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold">{contacts.find(c => c.id === activeChat)?.name}</p>
                                    <p className="text-xs text-green-600 font-medium">Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-brand-600"><Phone className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-brand-600"><Video className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-brand-600"><Info className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-brand-600"><MoreVertical className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {messages.map((msg) => {
                                const isMe = msg.senderId === 'teacher-1';
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-4 rounded-2xl shadow-sm ${isMe
                                                    ? 'bg-brand-600 text-white rounded-tr-none'
                                                    : 'bg-white glass text-gray-800 rounded-tl-none border-white/20'
                                                }`}>
                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                            </div>
                                            <div className="flex items-center gap-2 px-1">
                                                <span className="text-[10px] text-muted-foreground uppercase">{msg.time}</span>
                                                {isMe && (
                                                    msg.status === 'read'
                                                        ? <CheckCheck className="w-3 h-3 text-brand-500" />
                                                        : <Clock className="w-3 h-3 text-muted-foreground" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Message Input */}
                        <div className="p-6 border-t border-white/10 glass">
                            <div className="flex gap-4 items-center max-w-5xl mx-auto">
                                <div className="flex-1 relative">
                                    <textarea
                                        className="w-full h-12 py-3 px-4 glass border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none pr-12 shadow-inner"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), setNewMessage(''))}
                                    />
                                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-600">
                                        😀
                                    </Button>
                                </div>
                                <Button
                                    className="h-12 w-12 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-lg shrink-0"
                                    onClick={() => setNewMessage('')}
                                    disabled={!newMessage}
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-10 h-10 text-brand-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Select a conversation</h3>
                            <p className="text-muted-foreground">Choose a contact from the left to start messaging.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
