'use server';

/**
 * @fileOverview A flow for analyzing weekly sentiment trends with error handling.
 *
 * - analyzeWeeklySentiment - Analyzes sentiment trends over a week.
 * - AnalyzeWeeklySentimentInput - The input type for the analyzeWeeklySentiment function.
 * - AnalyzeWeeklySentimentOutput - The return type for the analyzeWeeklySentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeWeeklySentimentInputSchema = z.object({
  journalEntries: z.array(z.object({
    content: z.string(),
    sentiment: z.string(),
    date: z.string(),
  })).describe('Array of journal entries from the past week.'),
});

export type AnalyzeWeeklySentimentInput = z.infer<
  typeof AnalyzeWeeklySentimentInputSchema
>;

const AnalyzeWeeklySentimentOutputSchema = z.object({
  overallTrend: z.string().describe('Overall sentiment trend for the week.'),
  insights: z.array(z.string()).describe('Key insights about the user\'s emotional patterns.'),
  recommendations: z.array(z.string()).describe('Personalized recommendations based on the analysis.'),
  needsSupport: z.boolean().describe('Whether the user might need additional support.'),
});

export type AnalyzeWeeklySentimentOutput = z.infer<
  typeof AnalyzeWeeklySentimentOutputSchema
>;

export async function analyzeWeeklySentiment(
  input: AnalyzeWeeklySentimentInput
): Promise<AnalyzeWeeklySentimentOutput> {
  try {
    return await analyzeWeeklySentimentFlow(input);
  } catch (error) {
    // Fallback when API is unavailable or quota exceeded
    console.warn('AI weekly sentiment analysis failed, using fallback:', error);

    // Simple fallback analysis
    const entries = input.journalEntries;
    const positiveCount = entries.filter(e => e.sentiment === 'positive').length;
    const negativeCount = entries.filter(e => e.sentiment === 'negative').length;
    const totalCount = entries.length;

    let overallTrend = 'balanced';
    let needsSupport = false;
    let insights: string[] = [];
    let recommendations: string[] = [];

    if (negativeCount > positiveCount) {
      overallTrend = 'challenging';
      needsSupport = negativeCount > totalCount * 0.6;
      insights = [
        'This week has been difficult with more negative entries than positive ones.',
        'It\'s normal to have challenging periods - consider reaching out to friends or family.',
        'Remember that difficult times are temporary and you have the strength to get through them.'
      ];
      recommendations = [
        'Consider talking to a trusted friend about how you\'re feeling.',
        'Try a short mindfulness exercise to help process these emotions.',
        'Remember to be kind to yourself during tough times.'
      ];
    } else if (positiveCount > negativeCount) {
      overallTrend = 'positive';
      insights = [
        'You\'ve had a good week with more positive entries!',
        'Your positive outlook is serving you well.',
        'Keep nurturing the activities and thoughts that bring you joy.'
      ];
      recommendations = [
        'Continue the positive activities that are working for you.',
        'Consider sharing your positive energy with others.',
        'Take a moment to appreciate your progress this week.'
      ];
    } else {
      overallTrend = 'balanced';
      insights = [
        'Your week has been relatively balanced.',
        'A mix of experiences is normal and healthy.',
        'You\'re maintaining good emotional awareness.'
      ];
      recommendations = [
        'Keep up the good work maintaining balance.',
        'Continue journaling to stay in touch with your emotions.',
        'Consider setting a small goal for next week.'
      ];
    }

    return {
      overallTrend,
      insights,
      recommendations,
      needsSupport
    };
  }
}

const analyzeWeeklySentimentPrompt = ai.definePrompt({
  name: 'analyzeWeeklySentimentPrompt',
  input: {schema: AnalyzeWeeklySentimentInputSchema},
  output: {schema: AnalyzeWeeklySentimentOutputSchema},
  prompt: `Analyze the weekly sentiment trends from these journal entries: {{journalEntries}}. Provide insights about emotional patterns, recommendations, and determine if the user might need additional support.`,
});

const analyzeWeeklySentimentFlow = ai.defineFlow(
  {
    name: 'analyzeWeeklySentimentFlow',
    inputSchema: AnalyzeWeeklySentimentInputSchema,
    outputSchema: AnalyzeWeeklySentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeWeeklySentimentPrompt(input);
    return output!;
  }
);
