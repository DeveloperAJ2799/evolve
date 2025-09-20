'use client';

import { useState, useTransition, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { analyzeJournalSentiment } from '@/ai/flows/analyze-journal-sentiment-safe';
import { generatePersonalizedAffirmations } from '@/ai/flows/generate-personalized-affirmations';
import { recommendMeditationBasedOnSentiment } from '@/ai/flows/recommend-meditations-based-on-sentiment';
import { generateMeditationAudio } from '@/ai/flows/generate-meditation-audio';
import { suggestSocialService } from '@/ai/flows/suggest-social-service-safe';
import { analyzeWeeklySentiment } from '@/ai/flows/analyze-weekly-sentiment-safe';

import type { Goal, JournalEntry, Friend } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BookHeart, BrainCircuit, LineChart, Loader2, Quote, Trophy, User, HeartHandshake } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Slider } from './ui/slider';
import { Logo } from './icons/logo';
import { Avatar, AvatarFallback } from './ui/avatar';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FriendsPanel } from './friends-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityPanel } from './community-panel';
import { z } from 'zod';
import { Skeleton } from './ui/skeleton';

const journalSchema = z.string().min(1, { message: 'Journal entry cannot be empty.' }).max(5000);

const initialJournalEntries: JournalEntry[] = [
  { id: '1', date: new Date(new Date().setDate(new Date().getDate() - 4)), content: 'Feeling great today!', sentiment: 'positive', moodKeywords: ['happy', 'energetic'] },
  { id: '2', date: new Date(new Date().setDate(new Date().getDate() - 3)), content: 'A bit stressed with work.', sentiment: 'negative', moodKeywords: ['stressed', 'anxious'] },
  { id: '3', date: new Date(new Date().setDate(new Date().getDate() - 2)), content: 'Feeling okay, just a regular day.', sentiment: 'neutral', moodKeywords: ['calm', 'neutral'] },
  { id: '4', date: new Date(new Date().setDate(new Date().getDate() - 1)), content: 'Excited about the weekend!', sentiment: 'positive', moodKeywords: ['excited', 'happy'] },
];

const initialGoal: Goal = {
  id: 'g1',
  title: 'Weekly Volunteering',
  description: 'Dedicate time to a cause you care about.',
  target: 5,
  progress: 2,
};

const initialFriends: Friend[] = [
    { id: 'f1', name: 'Alex', avatarUrl: 'https://picsum.photos/seed/friend1/100/100', status: "Feeling great!", mood: "Happy" },
    { id: 'f2', name: 'Sam', avatarUrl: 'https://picsum.photos/seed/friend2/100/100', status: "A bit under the weather.", mood: "Sad" },
    { id: 'f3', name: 'Jordan', avatarUrl: 'https://picsum.photos/seed/friend3/100/100', status: "Looking forward to the weekend!", mood: "Excited" },
];

function JournalingForm({
  isPending,
  onSubmit,
}: {
  isPending: boolean;
  onSubmit: (text: string) => void;
}) {
  const [journalText, setJournalText] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(journalText);
    setJournalText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <BookHeart className="text-primary" />
          Today's Journal
        </CardTitle>
        <CardDescription>How are you feeling today? Let it all out.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          name="journal"
          placeholder="Start writing here..."
          className="min-h-[150px] resize-none"
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          disabled={isPending}
        />
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Evolving...
            </>
          ) : (
            'Save Entry'
          )}
        </Button>
      </CardFooter>
    </form>
  );
}

function EvolveAppComponent() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [goal, setGoal] = useState<Goal>(initialGoal);
  const [friends] = useState<Friend[]>(initialFriends);
  const [affirmation, setAffirmation] = useState<string>('Embrace the journey of self-discovery and growth today.');
  const [meditation, setMeditation] = useState<string | null>(null);
  const [meditationAudio, setMeditationAudio] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const meditationImage = PlaceHolderImages.find(img => img.id === 'meditation-calm');

  const handleJournalSubmit = async (journalText: string) => {
    startTransition(() => {
        setIsProcessing(true);
        setMeditation(null);
        setMeditationAudio(null);
    });

    try {
        const validatedJournal = journalSchema.safeParse(journalText);
        if (!validatedJournal.success) {
            toast({ variant: 'destructive', title: 'Error', description: validatedJournal.error.errors.map((e) => e.message).join(', ')});
            startTransition(() => setIsProcessing(false));
            return;
        }
        const journalEntry = validatedJournal.data;

        // --- Stage 1: Initial Analysis & Save ---
        const sentimentAnalysis = await analyzeJournalSentiment({ journalEntry });
        const mood = sentimentAnalysis.moodKeywords.join(', ') || sentimentAnalysis.sentiment;
        const sentimentPayload = { sentiment: sentimentAnalysis.sentiment, moodKeywords: sentimentAnalysis.moodKeywords };

        const newEntry: JournalEntry = {
            id: new Date().toISOString(),
            date: new Date(),
            content: journalEntry,
            sentiment: sentimentAnalysis.sentiment,
            moodKeywords: sentimentAnalysis.moodKeywords,
        };

        startTransition(() => {
            setJournalEntries(prev => [...prev, newEntry]);
            toast({ title: 'Journal Entry Saved', description: 'Your thoughts have been recorded. Generating insights...'});
        });

        // --- Stage 2: Get Meditation Recommendation ---
        const meditationResult = await recommendMeditationBasedOnSentiment(sentimentPayload);
        startTransition(() => {
            setMeditation(meditationResult.meditationRecommendation);
        });


        // --- Stage 3: Parallel Content Generation (Affirmation, Social Service) ---
        const [affirmationResult, socialServiceResult] = await Promise.all([
            generatePersonalizedAffirmations({ mood }),
            suggestSocialService(sentimentPayload),
        ]);

        startTransition(() => {
            setAffirmation(affirmationResult.affirmation);
             if (socialServiceResult) {
                setGoal(g => ({
                    ...g,
                    title: socialServiceResult.title,
                    description: socialServiceResult.description,
                    progress: 0,
                }));
            }
            setIsGeneratingAudio(true); // Start audio generation indicator
        });

        // --- Stage 4: Audio Generation (slowest part) ---
        try {
            const audioResult = await generateMeditationAudio(meditationResult.meditationRecommendation);
            startTransition(() => {
                setMeditationAudio(audioResult.audioDataUri);
            });
        } catch (audioError: any) {
            console.error('Audio generation failed:', audioError);
            if (audioError.message && audioError.message.includes('429')) {
                 toast({
                    variant: 'destructive',
                    title: 'Audio Generation Limit Reached',
                    description: "You've exceeded the free quota for audio generation. Please try again later.",
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Audio Generation Failed',
                    description: 'Could not generate meditation audio at this time.',
                });
            }
        } finally {
            startTransition(() => {
                setIsGeneratingAudio(false);
            });
        }


        // --- Stage 5: Weekly Analysis (can run in background) ---
        const allEntries = [...journalEntries, newEntry];
        const latestEntries = allEntries.slice(-6);
        const currentEntryForAnalysis = {
            date: new Date().toISOString(),
            content: journalEntry,
            sentiment: sentimentAnalysis.sentiment
        };
        const weekEntries = [...latestEntries, currentEntryForAnalysis];

        if (weekEntries.length >= 4) {
            const weeklyAnalysisResult = await analyzeWeeklySentiment({
                journalEntries: weekEntries.map(e => ({
                    date: new Date(e.date).toLocaleDateString(),
                    content: e.content,
                    sentiment: e.sentiment,
                }))
            });
            if (weeklyAnalysisResult?.needsSupport) {
                toast({
                    variant: 'destructive',
                    title: "We've Notified Your Friends",
                    description: "It looks like you've had a tough week. We've reached out to your support circle for you.",
                });
            }
        }

    } catch (error) {
        console.error('Error processing journal entry:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({ variant: 'destructive', title: 'Server Error', description: errorMessage});
    } finally {
        startTransition(() => {
            setIsProcessing(false);
            // We handle isGeneratingAudio in its own finally block
        });
    }
  };

  const moodChartData = journalEntries.slice(-7).map(entry => ({
      date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sentiment: entry.sentiment === 'positive' ? 1 : entry.sentiment === 'negative' ? -1 : 0,
      mood: entry.moodKeywords[0] || 'neutral',
  }));

  const moodChartConfig = {
    sentiment: {
      label: 'Sentiment Score',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  const goalChartData = [{ name: goal.title, value: goal.progress }];

  const goalChartConfig = {
    value: { label: 'Progress' },
  } satisfies ChartConfig;

  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'journal';


  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-body">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">EVOLVE</h1>
        </div>
        <div className="ml-auto">
           <Avatar>
            <AvatarFallback><User/></AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="journal">Journal</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="journal" className="py-6">
              <div className="grid gap-6">
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Quote className="text-primary-foreground/80" /> Daily Affirmation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl italic">
                    {isProcessing && !affirmation.includes('Embrace') ? <Skeleton className="h-6 w-3/4" /> : affirmation}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <JournalingForm isPending={isProcessing} onSubmit={handleJournalSubmit} />
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="insights" className="py-6">
              <div className="grid gap-6">
                <Card className="animate-in fade-in-50 slide-in-from-bottom-5">
                      <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline">
                        <BrainCircuit className="text-primary" />
                        Mindful Moment
                      </CardTitle>
                      <CardDescription>A meditation tailored to your current mood.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isProcessing && !meditation ? (
                         <div className="flex flex-col sm:flex-row gap-4">
                            <Skeleton className="h-[100px] w-[150px] rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                         </div>
                      ) : meditation ? (
                        <div className="flex flex-col sm:flex-row gap-4">
                            {meditationImage && (
                            <Image
                                src={meditationImage.imageUrl}
                                alt={meditationImage.description}
                                width={150}
                                height={100}
                                className="rounded-lg object-cover"
                                data-ai-hint={meditationImage.imageHint}
                            />
                            )}
                            <div className="flex-1 space-y-2">
                            <p className="text-foreground/90">{meditation}</p>
                            {isGeneratingAudio ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                    Generating audio...
                                </div>
                            ) : meditationAudio ? (
                                <audio controls src={meditationAudio} className="w-full">
                                Your browser does not support the audio element.
                                </audio>
                            ) : null}
                            </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Your personalized meditation will appear here after you write a journal entry.</p>
                      )}
                    </CardContent>
                  </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                      <LineChart className="text-primary" />
                      Your Mood Journey
                    </CardTitle>
                    <CardDescription>Visualizing your emotional trends over the last 7 entries.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={moodChartConfig} className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={moodChartData} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                              <CartesianGrid vertical={false} strokeDasharray="3 3" />
                              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis domain={[-1, 1]} tickCount={3} tickFormatter={(value) => (value === 1 ? '😊' : value === -1 ? '😢' : '😐')} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="sentiment" fill="hsl(var(--chart-1))" radius={4} />
                          </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
            </div>
          </TabsContent>
          <TabsContent value="goals" className="py-6">
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Trophy className="text-primary" />
                  Weekly Well-being Goal
                </CardTitle>
                 {isProcessing && !goal.title.includes('Volunteering') ? (
                    <Skeleton className="h-5 w-3/5" />
                 ) : (
                    <CardDescription>{goal.description}</CardDescription>
                 )}
              </CardHeader>
              <CardContent className="grid gap-4 pt-4">
                <div className="relative mx-auto h-40 w-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <HeartHandshake className="h-16 w-16 text-primary/20" />
                    </div>
                  <ChartContainer config={goalChartConfig} className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        data={goalChartData}
                        startAngle={90}
                        endAngle={-270}
                        innerRadius="80%"
                        outerRadius="100%"
                      >
                        <PolarAngleAxis type="number" domain={[0, goal.target]} tick={false} />
                        <RadialBar
                          dataKey="value"
                          background={{ fill: 'hsl(var(--muted))' }}
                          cornerRadius={10}
                          className="fill-primary"
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-headline text-primary">
                      {Math.round((goal.progress / goal.target) * 100)}%
                    </span>
                    <span className="text-xs text-muted-foreground">complete</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between text-sm">
                     {isProcessing && !goal.title.includes('Volunteering') ? (
                        <Skeleton className="h-5 w-2/5" />
                     ) : (
                        <span className="font-medium">{goal.title}</span>
                     )}
                    <span className="text-muted-foreground">{goal.progress} / {goal.target} hrs</span>
                  </div>
                  <Slider
                    value={[goal.progress]}
                    max={goal.target}
                    step={0.5}
                    onValueChange={(value) => setGoal(g => ({ ...g, progress: value[0] }))}
                  />
                </div>
              </CardContent>
                <CardFooter>
                  <div className="w-full text-center text-sm text-muted-foreground">
                      Your progress towards making a difference.
                  </div>
                </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="community" className="py-6">
             <div className="mx-auto max-w-6xl">
                <CommunityPanel />
             </div>
          </TabsContent>
          <TabsContent value="friends" className="py-6">
            <div className="mx-auto max-w-4xl">
              <FriendsPanel friends={friends} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export function EvolveApp() {
    return (
        <Suspense>
            <EvolveAppComponent />
        </Suspense>
    )
}
