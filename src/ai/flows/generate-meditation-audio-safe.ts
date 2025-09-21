'use server';
/**
 * @fileOverview Flow to generate meditation audio based on meditation content.
 * Safe version with fallback when API is unavailable.
 */

import { z } from 'zod';

const GenerateMeditationAudioInputSchema = z.object({
  meditationContent: z.string().describe('The meditation content to convert to audio.'),
});

export type GenerateMeditationAudioInput = z.infer<typeof GenerateMeditationAudioInputSchema>;

const GenerateMeditationAudioOutputSchema = z.object({
  audioDataUri: z.string().describe('Base64 encoded audio data URI.'),
});

export type GenerateMeditationAudioOutput = z.infer<typeof GenerateMeditationAudioOutputSchema>;

export async function generateMeditationAudio(
  input: GenerateMeditationAudioInput
): Promise<GenerateMeditationAudioOutput> {
  try {
    // Try to use the AI flow first
    const { generateMeditationAudio: aiFlow } = await import('./generate-meditation-audio');
    return await aiFlow(input.meditationContent);
  } catch (error: any) {
    console.warn('AI audio generation failed, using fallback:', error.message);

    // Fallback: Generate a simple audio placeholder or return a message
    // Since we can't generate real audio without API access, we'll return a placeholder
    const fallbackAudioDataUri = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IAAAAAEAAQARAAAAEAAAAAEACABkYXRhAgAAAAEA`;

    return {
      audioDataUri: fallbackAudioDataUri
    };
  }
}
