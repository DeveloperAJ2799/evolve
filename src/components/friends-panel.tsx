'use client';

import { useState } from 'react';
import type { Friend } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Users, Send, MessageSquareText } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

type Message = {
    sender: 'user' | 'friend';
    text: string;
    timestamp: Date;
};

const FriendReport = ({ friend }: { friend: Friend }) => {
    return (
        <Card className="animate-in fade-in-20">
            <CardHeader>
                <CardTitle className="text-lg font-headline">{friend.name}'s Report</CardTitle>
                <CardDescription>A quick look at how they're doing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    <Badge variant={friend.mood === 'Happy' || friend.mood === 'Excited' ? 'secondary' : 'outline'}>
                        {friend.status}
                    </Badge>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Recent Mood</span>
                     <p className="text-sm font-medium">{friend.mood}</p>
                </div>
            </CardContent>
        </Card>
    );
};


export function FriendsPanel({ friends }: { friends: Friend[] }) {
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');

    const handleFriendSelect = (friend: Friend) => {
        setSelectedFriend(friend);
        // Simulate loading a chat history
        setMessages([
            { sender: 'friend', text: `Hey! Just checking in.`, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
            { sender: 'user', text: `Hey ${friend.name}, thanks for reaching out.`, timestamp: new Date(Date.now() - 1000 * 60 * 4) }
        ]);
    };
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim() === '' || !selectedFriend) return;

        const newMessage: Message = {
            sender: 'user',
            text: messageInput,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        setMessageInput('');

        // Simulate a reply
        setTimeout(() => {
            const reply: Message = {
                sender: 'friend',
                text: 'Got it!',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <Users className="text-primary"/>
                            Support Circle
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[calc(100vh-250px)]">
                            <div className="space-y-4">
                                {friends.map(friend => (
                                    <div 
                                        key={friend.id} 
                                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedFriend?.id === friend.id ? 'bg-accent' : 'hover:bg-muted'}`}
                                        onClick={() => handleFriendSelect(friend)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={friend.avatarUrl} alt={friend.name} />
                                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{friend.name}</p>
                                                <p className="text-sm text-muted-foreground">Connected</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">Support</Badge>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            
            <div className="md:col-span-2">
                {selectedFriend ? (
                    <div className="space-y-6">
                        <FriendReport friend={selectedFriend} />
                    
                        <Card className="flex-1 flex flex-col animate-in fade-in-20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <MessageSquareText className="h-6 w-6 text-primary" />
                                    Chat with {selectedFriend.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 p-0">
                                <ScrollArea className="h-[240px] p-6">
                                    <div className="space-y-4">
                                        {messages.map((msg, index) => (
                                            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                                {msg.sender === 'friend' && (
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={selectedFriend.avatarUrl} alt={selectedFriend.name} />
                                                    </Avatar>
                                                )}
                                                <div className={`rounded-lg px-3 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                    <p className="text-sm">{msg.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="pt-4 border-t">
                                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                                    <Input
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type a message..."
                                    />
                                    <Button type="submit" size="icon">
                                        <Send className="h-4 w-4" />
                                        <span className="sr-only">Send</span>
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </div>
                ) : (
                    <Card className="flex h-full items-center justify-center bg-muted/50">
                        <div className="text-center">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-medium">Select a friend</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Choose someone from your support circle to view their report and start a conversation.
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}