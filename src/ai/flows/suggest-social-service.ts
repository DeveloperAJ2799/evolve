'use server';
/**
 * @fileOverview A flow for suggesting social service activities.
 *
 * - suggestSocialService - Suggests a social service activity based on user's sentiment.
 * - SuggestSocialServiceInput - The input type for the suggestSocialService function.
 * - SuggestSocialServiceOutput - The return type for the suggestSocialService function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSocialServiceInputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the journal entry (e.g., positive, negative, neutral).'
    ),
  moodKeywords: z.array(z.string()).describe('Keywords describing the mood.'),
});

export type SuggestSocialServiceInput = z.infer<
  typeof SuggestSocialServiceInputSchema
>;

const SuggestSocialServiceOutputSchema = z.object({
  title: z.string().describe('A short, catchy title for the activity.'),
  description: z
    .string()
    .describe('A longer description of the suggested social service activity.'),
});

export type SuggestSocialServiceOutput = z.infer<
  typeof SuggestSocialServiceOutputSchema
>;

export async function suggestSocialService(
  input: SuggestSocialServiceInput
): Promise<SuggestSocialServiceOutput> {
  return suggestSocialServiceFlow(input);
}

const suggestSocialServicePrompt = ai.definePrompt({
  name: 'suggestSocialServicePrompt',
  input: {schema: SuggestSocialServiceInputSchema},
  output: {schema: SuggestSocialServiceOutputSchema},
  prompt: `Based on the user's sentiment of "{{sentiment}}" and mood keywords like "{{moodKeywords}}", suggest a simple and actionable social service or volunteering activity. Frame it as an uplifting and fulfilling "well-being goal". Provide a title and a short description.`,
});

const suggestSocialServiceFlow = ai.defineFlow(
  {
    name: 'suggestSocialServiceFlow',
    inputSchema: SuggestSocialServiceInputSchema,
    outputSchema: SuggestSocialServiceOutputSchema,
  },
  async input => {
    const {output} = await suggestSocialServicePrompt(input);
    return output!;
  }
);
