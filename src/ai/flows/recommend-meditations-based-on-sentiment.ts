'use server';
/**
 * @fileOverview Recommends meditation clips tailored to the user's current emotional state, using sentiment analysis.
 *
 * - recommendMeditationBasedOnSentiment - A function that recommends meditation clips based on sentiment.
 * - RecommendMeditationBasedOnSentimentInput - The input type for the recommendMeditationBasedOnSentiment function.
 * - RecommendMeditationBasedOnSentimentOutput - The return type for the recommendMeditationBasedOnSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendMeditationBasedOnSentimentInputSchema = z.object({
  sentiment: z
    .string()
    .describe('The sentiment of the journal entry (e.g., positive, negative, neutral).'),
  moodKeywords: z.array(z.string()).describe('Keywords describing the mood.'),
});
export type RecommendMeditationBasedOnSentimentInput = z.infer<typeof RecommendMeditationBasedOnSentimentInputSchema>;

const RecommendMeditationBasedOnSentimentOutputSchema = z.object({
  meditationRecommendation: z
    .string()
    .describe('A recommendation for a meditation clip tailored to the user\'s sentiment and mood keywords.'),
});
export type RecommendMeditationBasedOnSentimentOutput = z.infer<typeof RecommendMeditationBasedOnSentimentOutputSchema>;

export async function recommendMeditationBasedOnSentiment(input: RecommendMeditationBasedOnSentimentInput): Promise<RecommendMeditationBasedOnSentimentOutput> {
  return recommendMeditationBasedOnSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendMeditationBasedOnSentimentPrompt',
  input: {schema: RecommendMeditationBasedOnSentimentInputSchema},
  output: {schema: RecommendMeditationBasedOnSentimentOutputSchema},
  prompt: `Based on the user\'s sentiment of {{sentiment}} and mood keywords: {{{moodKeywords}}}, recommend a meditation clip that would be most helpful. `,
});

const recommendMeditationBasedOnSentimentFlow = ai.defineFlow(
  {
    name: 'recommendMeditationBasedOnSentimentFlow',
    inputSchema: RecommendMeditationBasedOnSentimentInputSchema,
    outputSchema: RecommendMeditationBasedOnSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
