'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Award, Globe, Heart, Home, Sprout, Trash2, Users, CalendarDays, MapPin } from 'lucide-react';
import { Separator } from './ui/separator';

const communityGroups = [
    {
        id: 'cg1',
        title: 'Orphanage Support',
        description: 'Spend time with children, help with homework, and organize fun activities.',
        icon: <Heart className="text-primary" />,
        image: PlaceHolderImages.find(img => img.id === 'volunteering-community')
    },
    {
        id: 'cg2',
        title: 'Elderly Care Companions',
        description: 'Visit senior citizens in old age homes, read to them, or simply have a conversation.',
        icon: <Home className="text-primary" />,
        image: PlaceHolderImages.find(img => img.id === 'senior-care')
    },
    {
        id: 'cg3',
        title: 'Beach Cleanup Crew',
        description: 'Join a team of volunteers to clean up local beaches and protect marine life.',
        icon: <Trash2 className="text-primary" />,
        image: PlaceHolderImages.find(img => img.id === 'beach-cleanup')
    },
    {
        id: 'cg4',
        title: 'Animal Shelter Aid',
        description: 'Assist with feeding, cleaning, and playing with animals at a local shelter.',
        icon: <Award className="text-primary" />,
        image: PlaceHolderImages.find(img => img.id === 'animal-shelter')
    },
    {
        id: 'cg5',
        title: 'Community Garden Project',
        description: 'Help grow fresh produce for local food banks and learn about sustainable agriculture.',
        icon: <Sprout className="text-primary" />,
        image: PlaceHolderImages.find(img => img.id === 'community-garden')
    },
];

const upcomingEvents = [
    {
        id: 'e1',
        title: 'Charity Run 5K',
        date: 'August 15, 2024',
        location: 'Central Park',
        image: PlaceHolderImages.find(img => img.id === 'charity-run')
    },
    {
        id: 'e2',
        title: 'Food Bank Drive',
        date: 'August 22, 2024',
        location: 'Community Center',
        image: PlaceHolderImages.find(img => img.id === 'food-drive')
    },
    {
        id: 'e3',
        title: 'Park Beautification Day',
        date: 'September 1, 2024',
        location: 'Sunnyvale Park',
        image: PlaceHolderImages.find(img => img.id === 'park-cleanup')
    }
];

export function CommunityPanel() {
    return (
        <div>
            <Card className="mb-6 border-none shadow-none bg-transparent">
                <CardHeader className="text-center px-0">
                    <CardTitle className="flex items-center justify-center gap-3 font-headline text-3xl">
                        <Globe className="h-8 w-8 text-primary"/>
                        Community Hub
                    </CardTitle>
                    <CardDescription>
                        Connect with like-minded people and make a positive impact together.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Events Panel */}
                <div className="lg:col-span-1">
                    <Card className="bg-primary text-primary-foreground">
                        <CardHeader>
                            <CardTitle className="font-headline">Upcoming Events</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {upcomingEvents.map((event, index) => (
                                <div key={event.id}>
                                    <div className="flex flex-col space-y-4">
                                        {event.image && (
                                            <Image 
                                                src={event.image.imageUrl} 
                                                alt={event.image.description} 
                                                width={400} 
                                                height={200} 
                                                className="rounded-lg object-cover w-full h-32" 
                                                data-ai-hint={event.image.imageHint}
                                            />
                                        )}
                                        <div className='space-y-2'>
                                            <h3 className="font-semibold">{event.title}</h3>
                                            <div className="text-sm text-primary-foreground/80 flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4"/>
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="text-sm text-primary-foreground/80 flex items-center gap-2">
                                                <MapPin className="h-4 w-4"/>
                                                 <span>{event.location}</span>
                                            </div>
                                            <Button variant="secondary" size="sm" className="w-full">RSVP</Button>
                                        </div>
                                    </div>
                                    {index < upcomingEvents.length - 1 && <Separator className="my-4 bg-primary-foreground/20" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Community Groups Panel */}
                <div className="lg:col-span-2">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {communityGroups.map((group) => (
                            <Card key={group.id} className="flex flex-col">
                                {group.image && (
                                    <Image 
                                        src={group.image.imageUrl} 
                                        alt={group.image.description} 
                                        width={400} 
                                        height={250} 
                                        className="rounded-t-lg object-cover w-full h-40" 
                                        data-ai-hint={group.image.imageHint}
                                    />
                                )}
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        {group.icon}
                                        {group.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-muted-foreground">{group.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="secondary" className="w-full">
                                        <Users className="mr-2"/>
                                        Join Group
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
