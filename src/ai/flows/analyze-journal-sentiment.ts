'use server';

/**
 * @fileOverview A flow for analyzing the sentiment of journal entries.
 *
 * - analyzeJournalSentiment - Analyzes the sentiment of a journal entry.
 * - AnalyzeJournalSentimentInput - The input type for the analyzeJournalSentiment function.
 * - AnalyzeJournalSentimentOutput - The return type for the analyzeJournalSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJournalSentimentInputSchema = z.object({
  journalEntry: z.string().describe('The journal entry to analyze.'),
});

export type AnalyzeJournalSentimentInput = z.infer<
  typeof AnalyzeJournalSentimentInputSchema
>;

const AnalyzeJournalSentimentOutputSchema = z.object({
  sentiment:
    z.string().describe('The sentiment of the journal entry (e.g., positive, negative, neutral).'),
  confidence:
    z.number().describe('The confidence level of the sentiment analysis (0 to 1, where 1 is highest confidence).'),
  moodKeywords: z.array(z.string()).describe('Keywords describing the mood.'),
});

export type AnalyzeJournalSentimentOutput = z.infer<
  typeof AnalyzeJournalSentimentOutputSchema
>;

export async function analyzeJournalSentiment(
  input: AnalyzeJournalSentimentInput
): Promise<AnalyzeJournalSentimentOutput> {
  return analyzeJournalSentimentFlow(input);
}

const analyzeJournalSentimentPrompt = ai.definePrompt({
  name: 'analyzeJournalSentimentPrompt',
  input: {schema: AnalyzeJournalSentimentInputSchema},
  output: {schema: AnalyzeJournalSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following journal entry and extract mood keywords:\n\nJournal Entry: {{{journalEntry}}}\n\nProvide the sentiment, a confidence score (0 to 1), and keywords describing the mood.`,
});

const analyzeJournalSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeJournalSentimentFlow',
    inputSchema: AnalyzeJournalSentimentInputSchema,
    outputSchema: AnalyzeJournalSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeJournalSentimentPrompt(input);
    return output!;
  }
);
