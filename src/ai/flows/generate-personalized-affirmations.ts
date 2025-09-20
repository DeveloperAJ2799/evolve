'use server';
/**
 * @fileOverview Flow to generate personalized daily affirmations based on the user's current mood.
 *
 * - generatePersonalizedAffirmations - A function that generates personalized daily affirmations based on mood.
 * - GeneratePersonalizedAffirmationsInput - The input type for the generatePersonalizedAffirmations function.
 * - GeneratePersonalizedAffirmationsOutput - The return type for the generatePersonalizedAffirmations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedAffirmationsInputSchema = z.object({
  mood: z
    .string()
    .describe("The user's current mood, as identified from their journal entries."),
});
export type GeneratePersonalizedAffirmationsInput = z.infer<
  typeof GeneratePersonalizedAffirmationsInputSchema
>;

const GeneratePersonalizedAffirmationsOutputSchema = z.object({
  affirmation: z.string().describe('A personalized daily affirmation.'),
});
export type GeneratePersonalizedAffirmationsOutput = z.infer<
  typeof GeneratePersonalizedAffirmationsOutputSchema
>;

export async function generatePersonalizedAffirmations(
  input: GeneratePersonalizedAffirmationsInput
): Promise<GeneratePersonalizedAffirmationsOutput> {
  return generatePersonalizedAffirmationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedAffirmationsPrompt',
  input: {schema: GeneratePersonalizedAffirmationsInputSchema},
  output: {schema: GeneratePersonalizedAffirmationsOutputSchema},
  prompt: `Based on the user\'s current mood of {{{mood}}}, generate a personalized daily affirmation to encourage them.\n\nAffirmation:`,
});

const generatePersonalizedAffirmationsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedAffirmationsFlow',
    inputSchema: GeneratePersonalizedAffirmationsInputSchema,
    outputSchema: GeneratePersonalizedAffirmationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
