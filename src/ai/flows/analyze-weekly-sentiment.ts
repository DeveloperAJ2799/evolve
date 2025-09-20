'use server';
/**
 * @fileOverview A flow for analyzing the weekly sentiment of journal entries.
 *
 * - analyzeWeeklySentiment - Analyzes the sentiment of a week's journal entries.
 * - AnalyzeWeeklySentimentInput - The input type for the analyzeWeeklySentiment function.
 * - AnalyzeWeeklySentimentOutput - The return type for the analyzeWeeklySentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JournalEntrySchema = z.object({
  date: z.string(),
  content: z.string(),
  sentiment: z.string(),
});

const AnalyzeWeeklySentimentInputSchema = z.object({
  journalEntries: z.array(JournalEntrySchema).describe("A week's worth of journal entries."),
});

export type AnalyzeWeeklySentimentInput = z.infer<
  typeof AnalyzeWeeklySentimentInputSchema
>;

const AnalyzeWeeklySentimentOutputSchema = z.object({
  isBadWeek: z.boolean().describe('Whether the user has had a "bad week" based on predominantly negative sentiment.'),
  summary: z.string().describe('A brief summary of the weekly sentiment analysis.'),
});

export type AnalyzeWeeklySentimentOutput = z.infer<
  typeof AnalyzeWeeklySentimentOutputSchema
>;

export async function analyzeWeeklySentiment(
  input: AnalyzeWeeklySentimentInput
): Promise<AnalyzeWeeklySentimentOutput> {
  return analyzeWeeklySentimentFlow(input);
}

const analyzeWeeklySentimentPrompt = ai.definePrompt({
  name: 'analyzeWeeklySentimentPrompt',
  input: {schema: AnalyzeWeeklySentimentInputSchema},
  output: {schema: AnalyzeWeeklySentimentOutputSchema},
  prompt: `Analyze the sentiment of the following journal entries for the week. Determine if the user has had a "bad week" based on a prevalence of negative emotions like sadness, stress, or anxiety. 

Journal Entries:
{{#each journalEntries}}
- Date: {{this.date}}, Sentiment: {{this.sentiment}}, Content: "{{this.content}}"
{{/each}}

If the week has been predominantly negative, set isBadWeek to true. Provide a short summary of your findings.`,
});

const analyzeWeeklySentimentFlow = ai.defineFlow(
  {
    name: 'analyzeWeeklySentimentFlow',
    inputSchema: AnalyzeWeeklySentimentInputSchema,
    outputSchema: AnalyzeWeeklySentimentOutputSchema,
  },
  async input => {
    // Basic logic to prevent calling AI if not needed
    const negativeCount = input.journalEntries.filter(e => e.sentiment === 'negative').length;
    if (negativeCount < input.journalEntries.length / 2) {
      return {
        isBadWeek: false,
        summary: 'A mix of emotions this week, but not overwhelmingly negative.'
      };
    }
    
    const {output} = await analyzeWeeklySentimentPrompt(input);
    return output!;
  }
);
