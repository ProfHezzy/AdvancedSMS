'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Send,
    MoreVertical,
    Paperclip,
    Smile,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function GroupChatPage() {
    const [activeGroup, setActiveGroup] = useState(1);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hey guys, did anyone solve question 5?', sender: 'Alice', time: '10:30 AM', isMe: false },
        { id: 2, text: 'Yeah, it uses the Pythagoras theorem.', sender: 'Bob', time: '10:32 AM', isMe: false },
        { id: 3, text: 'Thanks Bob! I was stuck on that.', sender: 'Me', time: '10:33 AM', isMe: true },
    ]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setMessages([...messages, {
            id: Date.now(),
            text: message,
            sender: 'Me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        }]);
        setMessage('');
    };

    return (
        <div className="h-[calc(100vh-100px)] p-6 gap-6 grid grid-cols-1 lg:grid-cols-4 animate-fade-in text-gray-900">
            {/* Sidebar List */}
            <Card className="lg:col-span-1 glass border-none shadow-soft flex flex-col overflow-hidden h-full">
                <div className="p-4 border-b border-brand-50 bg-white/40">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search groups..." className="pl-9 bg-white border-brand-100 h-10 rounded-xl" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {[
                        { id: 1, name: 'JSS 1 Science Club', lastMsg: 'Meeting at 2 PM', time: '10 min' },
                        { id: 2, name: 'Math Study Group', lastMsg: 'Thanks Bob!', time: '1 hr' },
                        { id: 3, name: 'Football Team', lastMsg: 'Practice cancelled', time: 'Yesterday' },
                    ].map((group) => (
                        <button
                            key={group.id}
                            onClick={() => setActiveGroup(group.id)}
                            className={cn(
                                "w-full p-3 rounded-xl flex items-center gap-3 transition-colors text-left",
                                activeGroup === group.id ? "bg-brand-600 text-white shadow-md" : "hover:bg-brand-50 text-gray-700"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs",
                                activeGroup === group.id ? "bg-white/20 text-white" : "bg-brand-100 text-brand-700"
                            )}>
                                {group.name.substring(0, 2)}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-sm truncate">{group.name}</p>
                                    <span className={cn("text-[10px] font-bold", activeGroup === group.id ? "text-brand-100" : "text-gray-400")}>{group.time}</span>
                                </div>
                                <p className={cn("text-xs truncate", activeGroup === group.id ? "text-brand-100 opacity-90" : "text-gray-500")}>{group.lastMsg}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-3 glass border-none shadow-soft flex flex-col overflow-hidden h-full">
                <div className="p-4 border-b border-brand-50 bg-white/40 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                            JS
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">JSS 1 Science Club</h3>
                            <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                12 Online
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-brand-50/10">
                    {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex gap-3", msg.isMe ? "flex-row-reverse" : "")}>
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className={cn("text-xs font-black", msg.isMe ? "bg-brand-600 text-white" : "bg-gray-200 text-gray-600")}>
                                    {msg.sender.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className={cn(
                                "max-w-[70%] p-3 rounded-2xl text-sm font-medium shadow-sm",
                                msg.isMe
                                    ? "bg-brand-600 text-white rounded-br-none"
                                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                            )}>
                                <p>{msg.text}</p>
                                <span className={cn("text-[10px] font-bold block mt-1 text-right", msg.isMe ? "text-brand-100" : "text-gray-400")}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white/60 backdrop-blur border-t border-brand-50">
                    <form onSubmit={handleSend} className="flex items-center gap-2">
                        <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-brand-600">
                            <Paperclip className="w-5 h-5" />
                        </Button>
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-white border-brand-100 h-12 rounded-xl focus:ring-brand-500 focus:border-brand-500"
                        />
                        <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-brand-600">
                            <Smile className="w-5 h-5" />
                        </Button>
                        <Button type="submit" size="icon" className="h-12 w-12 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-lg btn-shine">
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
