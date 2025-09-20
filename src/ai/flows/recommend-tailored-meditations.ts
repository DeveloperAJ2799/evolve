'use server';
/**
 * @fileOverview Recommends meditation clips tailored to the user's current emotional state.
 *
 * - recommendMeditation - A function that recommends meditation clips based on emotional state.
 * - RecommendMeditationInput - The input type for the recommendMeditation function.
 * - RecommendMeditationOutput - The return type for the recommendMeditation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendMeditationInputSchema = z.object({
  emotionalState: z
    .string()
    .describe('The current emotional state of the user.'),
  journalEntry: z
    .string()
    .describe('The most recent journal entry of the user.'),
});
export type RecommendMeditationInput = z.infer<typeof RecommendMeditationInputSchema>;

const RecommendMeditationOutputSchema = z.object({
  meditationRecommendation: z
    .string()
    .describe('A recommendation for a meditation clip tailored to the user\'s emotional state.'),
});
export type RecommendMeditationOutput = z.infer<typeof RecommendMeditationOutputSchema>;

export async function recommendMeditation(input: RecommendMeditationInput): Promise<RecommendMeditationOutput> {
  return recommendMeditationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendMeditationPrompt',
  input: {schema: RecommendMeditationInputSchema},
  output: {schema: RecommendMeditationOutputSchema},
  prompt: `Based on the user's current emotional state of {{emotionalState}} that was derived from the journal entry: {{{journalEntry}}}, recommend a meditation clip that would be most helpful. `,
});

const recommendMeditationFlow = ai.defineFlow(
  {
    name: 'recommendMeditationFlow',
    inputSchema: RecommendMeditationInputSchema,
    outputSchema: RecommendMeditationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
