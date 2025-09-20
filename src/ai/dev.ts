'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-journal-sentiment.ts';
import '@/ai/flows/generate-personalized-affirmations.ts';
import '@/ai/flows/recommend-tailored-meditations.ts';
import '@/ai/flows/recommend-meditations-based-on-sentiment.ts';
import '@/ai/flows/generate-meditation-audio.ts';
import '@/ai/flows/suggest-social-service.ts';
import '@/ai/flows/analyze-weekly-sentiment.ts';
