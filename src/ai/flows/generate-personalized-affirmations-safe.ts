'use server';
/**
 * @fileOverview Flow to generate personalized daily affirmations based on the user's current mood.
 * Safe version with fallback responses when API is unavailable.
 */

import { z } from 'zod';

const GeneratePersonalizedAffirmationsInputSchema = z.object({
  mood: z.string().describe("The user's current mood, as identified from their journal entries."),
});

export type GeneratePersonalizedAffirmationsInput = z.infer<typeof GeneratePersonalizedAffirmationsInputSchema>;

const GeneratePersonalizedAffirmationsOutputSchema = z.object({
  affirmation: z.string().describe('A personalized daily affirmation.'),
});

export type GeneratePersonalizedAffirmationsOutput = z.infer<typeof GeneratePersonalizedAffirmationsOutputSchema>;

export async function generatePersonalizedAffirmations(
  input: GeneratePersonalizedAffirmationsInput
): Promise<GeneratePersonalizedAffirmationsOutput> {
  try {
    // Try to use the AI flow first
    const { generatePersonalizedAffirmations: aiFlow } = await import('./generate-personalized-affirmations');
    return await aiFlow(input);
  } catch (error: any) {
    console.warn('AI affirmation generation failed, using fallback:', error.message);

    // Fallback affirmations based on mood
    const fallbackAffirmations: Record<string, string[]> = {
      positive: [
        "I am worthy of all the good things that happen in my life.",
        "I radiate confidence and positive energy wherever I go.",
        "I am grateful for the abundance that surrounds me.",
        "I choose to focus on the positive aspects of my life.",
        "I am capable of achieving great things.",
        "I embrace joy and let it flow through me.",
        "I am surrounded by love and positive relationships.",
        "I celebrate my progress and growth every day.",
        "I trust in my ability to create a beautiful life.",
        "I am deserving of happiness and success."
      ],
      negative: [
        "I am stronger than I realize and can overcome any challenge.",
        "This difficult moment will pass, and I will emerge stronger.",
        "I am learning and growing from this experience.",
        "I choose to be kind to myself during tough times.",
        "I have the power to change my circumstances.",
        "I am resilient and can handle whatever comes my way.",
        "I release what I cannot control and focus on what I can.",
        "I am worthy of compassion and understanding.",
        "I trust that better days are coming.",
        "I am taking steps toward healing and growth."
      ],
      neutral: [
        "I am present in this moment and open to new experiences.",
        "I embrace the natural flow of life with grace.",
        "I am at peace with where I am in my journey.",
        "I trust in the timing of my life.",
        "I am open to whatever the day brings.",
        "I find balance and harmony in my daily life.",
        "I appreciate the simple moments that bring me joy.",
        "I am exactly where I need to be right now.",
        "I embrace both the challenges and the joys of life.",
        "I am grateful for the stability and peace in my life."
      ],
      stressed: [
        "I release tension and embrace calm.",
        "I have the power to create peace in my mind.",
        "I breathe in calm and breathe out stress.",
        "I am capable of handling whatever comes my way.",
        "I choose peace over worry.",
        "I am stronger than the stress I feel.",
        "I give myself permission to rest and recharge.",
        "I trust that everything will work out as it should.",
        "I am in control of my response to stress.",
        "I choose to focus on solutions, not problems."
      ],
      anxious: [
        "I am safe and everything is going to be okay.",
        "I release fear and embrace courage.",
        "I trust in my ability to handle uncertainty.",
        "I am grounded and present in this moment.",
        "I choose peace over anxiety.",
        "I am stronger than my anxious thoughts.",
        "I breathe deeply and find my center.",
        "I trust that I am exactly where I need to be.",
        "I am capable of moving through fear with grace.",
        "I choose to focus on what I can control."
      ],
      excited: [
        "I embrace this excitement and channel it positively.",
        "I am open to all the wonderful possibilities ahead.",
        "I celebrate this moment of joy and anticipation.",
        "I trust in the positive energy flowing through me.",
        "I am ready for the adventures that await.",
        "I embrace change with enthusiasm and grace.",
        "I am grateful for this feeling of excitement.",
        "I trust that good things are coming my way.",
        "I am open to receiving all the good that life offers.",
        "I celebrate my ability to feel joy and excitement."
      ],
      sad: [
        "I am gentle with myself during times of sadness.",
        "I trust that this feeling will pass in time.",
        "I am worthy of comfort and compassion.",
        "I allow myself to feel and then release my sadness.",
        "I am surrounded by love even when I feel alone.",
        "I trust in my ability to heal and grow.",
        "I am stronger than my sadness.",
        "I choose to focus on the love that surrounds me.",
        "I am deserving of happiness and joy.",
        "I trust that brighter days are ahead."
      ],
      happy: [
        "I embrace and celebrate this feeling of happiness.",
        "I am grateful for the joy in my life.",
        "I radiate positive energy to those around me.",
        "I am worthy of feeling this happy.",
        "I celebrate the simple moments that bring me joy.",
        "I trust that happiness is my natural state.",
        "I am open to receiving even more joy.",
        "I appreciate the abundance of good in my life.",
        "I choose to focus on the positive aspects of life.",
        "I am grateful for this moment of happiness."
      ]
    };

    // Determine mood category
    const mood = input.mood.toLowerCase();
    let category = 'neutral';

    if (mood.includes('positive') || mood.includes('happy') || mood.includes('excited') || mood.includes('joyful')) {
      category = 'positive';
    } else if (mood.includes('negative') || mood.includes('sad') || mood.includes('upset')) {
      category = 'negative';
    } else if (mood.includes('stressed') || mood.includes('overwhelmed')) {
      category = 'stressed';
    } else if (mood.includes('anxious') || mood.includes('worried')) {
      category = 'anxious';
    } else if (mood.includes('excited') || mood.includes('energetic')) {
      category = 'excited';
    } else if (mood.includes('sad') || mood.includes('down')) {
      category = 'sad';
    } else if (mood.includes('happy') || mood.includes('content')) {
      category = 'happy';
    }

    const affirmations = fallbackAffirmations[category] || fallbackAffirmations.neutral;
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

    return { affirmation: randomAffirmation };
  }
}
