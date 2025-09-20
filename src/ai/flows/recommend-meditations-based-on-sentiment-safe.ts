'use server';
/**
 * @fileOverview Recommends meditation clips tailored to the user's current emotional state, using sentiment analysis.
 * Safe version with fallback responses when API is unavailable.
 */

import { z } from 'zod';

const RecommendMeditationBasedOnSentimentInputSchema = z.object({
  sentiment: z.string().describe('The sentiment of the journal entry (e.g., positive, negative, neutral).'),
  moodKeywords: z.array(z.string()).describe('Keywords describing the mood.'),
});

export type RecommendMeditationBasedOnSentimentInput = z.infer<typeof RecommendMeditationBasedOnSentimentInputSchema>;

const RecommendMeditationBasedOnSentimentOutputSchema = z.object({
  meditationRecommendation: z.string().describe('A recommendation for a meditation clip tailored to the user\'s sentiment and mood keywords.'),
});

export type RecommendMeditationBasedOnSentimentOutput = z.infer<typeof RecommendMeditationBasedOnSentimentOutputSchema>;

export async function recommendMeditationBasedOnSentiment(
  input: RecommendMeditationBasedOnSentimentInput
): Promise<RecommendMeditationBasedOnSentimentOutput> {
  try {
    // Try to use the AI flow first
    const { recommendMeditationBasedOnSentiment: aiFlow } = await import('./recommend-meditations-based-on-sentiment');
    return await aiFlow(input);
  } catch (error: any) {
    console.warn('AI meditation recommendation failed, using fallback:', error.message);

    // Fallback meditation recommendations based on sentiment and mood
    const fallbackMeditations: Record<string, string[]> = {
      positive: [
        "Take a moment to celebrate your positive energy. This 5-minute gratitude meditation will help you amplify your joy and appreciation for life's blessings.",
        "Your positive mindset is a gift. This uplifting meditation focuses on cultivating gratitude and embracing the abundance in your life.",
        "Embrace your positive feelings with this joyful meditation that guides you to connect with your inner light and radiate positivity outward.",
        "Your positive energy deserves to be nurtured. This meditation helps you maintain your optimistic outlook while grounding you in the present moment.",
        "Celebrate your positive state with this energizing meditation that focuses on embracing joy and sharing your light with others.",
        "Your positive mood is a wonderful foundation. This meditation guides you to deepen your connection with gratitude and positive intentions.",
        "Amplify your positive feelings with this uplifting meditation that focuses on embracing joy and maintaining an optimistic perspective.",
        "Your positive energy is inspiring. This meditation helps you channel that positivity into mindful awareness and inner peace.",
        "Embrace your positive mindset with this gratitude-focused meditation that encourages you to appreciate the beauty in your life.",
        "Your positive feelings are a strength. This meditation guides you to cultivate joy while staying grounded and present."
      ],
      negative: [
        "When facing challenges, this compassion meditation helps you be gentle with yourself and find inner strength to move forward.",
        "During difficult times, this self-compassion meditation guides you to treat yourself with the same kindness you'd offer a dear friend.",
        "This healing meditation provides gentle support for processing difficult emotions and finding inner peace amid challenges.",
        "When feeling down, this supportive meditation helps you acknowledge your feelings while gently guiding you toward hope and healing.",
        "This comforting meditation offers gentle guidance for those experiencing sadness, helping you find moments of peace within.",
        "During tough moments, this meditation focuses on building resilience and finding strength within your challenges.",
        "This supportive meditation helps you navigate difficult emotions with compassion and understanding for yourself.",
        "When facing hardship, this meditation guides you to find inner resources and cultivate hope for the future.",
        "This gentle meditation provides comfort during challenging times, helping you find peace amid difficulty.",
        "During emotional difficulty, this meditation focuses on self-care and building inner strength to face challenges."
      ],
      neutral: [
        "In moments of calm, this mindfulness meditation helps you deepen your awareness and appreciation for the present moment.",
        "This balanced meditation guides you to cultivate inner peace and maintain equilibrium in your daily life.",
        "Embrace your centered state with this grounding meditation that helps you stay present and mindful throughout your day.",
        "This peaceful meditation supports your calm mindset, helping you maintain balance and inner harmony.",
        "In your tranquil state, this meditation guides you to deepen your connection with inner peace and mindfulness.",
        "This serene meditation helps you nurture your calm energy and maintain emotional balance throughout your day.",
        "Embrace your peaceful moment with this meditation that focuses on maintaining inner calm and presence.",
        "This balanced meditation supports your centered state, helping you cultivate ongoing mindfulness and peace.",
        "In your calm space, this meditation guides you to deepen your awareness and appreciation for the present.",
        "This tranquil meditation helps you maintain your peaceful state while building resilience for daily life."
      ],
      stressed: [
        "When stress feels overwhelming, this calming meditation guides you to release tension and find inner peace through gentle breathing.",
        "This stress-relief meditation helps you let go of tension and cultivate calm by focusing on your breath and body.",
        "During stressful moments, this meditation provides gentle guidance to release anxiety and find your center.",
        "This soothing meditation helps you manage stress by teaching you to observe your thoughts without judgment.",
        "When stress builds up, this meditation guides you to release tension and reconnect with your inner calm.",
        "This stress-reduction meditation focuses on helping you let go of worry and embrace peace in the present moment.",
        "During overwhelming times, this meditation teaches you to breathe through stress and find your inner strength.",
        "This calming practice helps you release stress by guiding you to focus on relaxation and inner peace.",
        "When stress feels heavy, this meditation helps you lighten your load through mindful breathing and presence.",
        "This stress-relief meditation guides you to release tension and cultivate calm through gentle awareness."
      ],
      anxious: [
        "When anxiety arises, this grounding meditation helps you find stability and calm by focusing on your breath and body.",
        "This anxiety-relief meditation guides you to observe anxious thoughts with compassion and return to the present moment.",
        "During anxious moments, this meditation helps you find your center by focusing on stability and inner strength.",
        "This calming meditation addresses anxiety by teaching you to breathe through fear and find peace within.",
        "When anxiety feels overwhelming, this meditation guides you to ground yourself and find safety in the present.",
        "This anxiety-support meditation helps you observe anxious thoughts without judgment and return to calm.",
        "During anxious times, this meditation focuses on helping you find stability and peace through mindful breathing.",
        "This gentle meditation addresses anxiety by guiding you to release fear and embrace inner security.",
        "When anxiety arises, this meditation helps you find your center and observe thoughts with compassion.",
        "This anxiety-relief practice guides you to breathe through fear and reconnect with your inner calm."
      ],
      excited: [
        "Channel your excitement into this energizing meditation that helps you embrace joy while staying grounded and present.",
        "This enthusiastic meditation guides you to celebrate your excitement while maintaining balance and mindfulness.",
        "Embrace your excitement with this joyful meditation that helps you channel positive energy mindfully.",
        "This energizing meditation helps you celebrate your enthusiasm while staying centered and grounded.",
        "Channel your excitement into this mindful meditation that helps you embrace joy with awareness and balance.",
        "This enthusiastic practice guides you to celebrate your positive energy while maintaining inner peace.",
        "Embrace your excitement with this joyful meditation that helps you stay present and mindful in your enthusiasm.",
        "This energizing meditation helps you channel your excitement into positive, mindful awareness.",
        "Celebrate your enthusiasm with this meditation that guides you to embrace joy while staying grounded.",
        "This excited-energy meditation helps you channel your enthusiasm into mindful, positive awareness."
      ],
      sad: [
        "During times of sadness, this compassionate meditation offers gentle support and guides you toward healing and hope.",
        "This comforting meditation provides gentle companionship during sad moments, helping you find peace within.",
        "When sadness visits, this meditation offers gentle guidance to acknowledge your feelings and find inner comfort.",
        "This supportive meditation helps you navigate sadness with compassion and gentle understanding for yourself.",
        "During sad moments, this meditation guides you to find comfort and hope through gentle self-compassion.",
        "This healing meditation offers gentle support during times of sadness, helping you find peace within.",
        "When sadness arises, this compassionate practice guides you to treat yourself with kindness and understanding.",
        "This comforting meditation helps you navigate sad feelings with gentle awareness and self-compassion.",
        "During times of sadness, this meditation offers gentle guidance to find comfort and inner peace.",
        "This supportive practice helps you embrace sad feelings with compassion while finding hope within."
      ],
      happy: [
        "Celebrate your happiness with this joyful meditation that helps you deepen your appreciation for life's blessings.",
        "This gratitude meditation amplifies your happy feelings by focusing on appreciation and positive awareness.",
        "Embrace your happiness with this uplifting meditation that guides you to celebrate joy and share positive energy.",
        "This joyful meditation helps you deepen your happy feelings through mindful appreciation and gratitude.",
        "Celebrate your positive state with this meditation that focuses on embracing joy and maintaining happiness.",
        "This uplifting practice guides you to amplify your happiness through mindful awareness and gratitude.",
        "Embrace your joyful feelings with this meditation that helps you celebrate happiness and positive energy.",
        "This gratitude-focused meditation helps you deepen your happy state through appreciation and mindfulness.",
        "Celebrate your happiness with this joyful practice that guides you to embrace positive feelings mindfully.",
        "This uplifting meditation helps you amplify your happy feelings through gratitude and positive awareness."
      ]
    };

    // Determine sentiment category
    const sentiment = input.sentiment.toLowerCase();
    const moodKeywords = input.moodKeywords.map(k => k.toLowerCase());

    let category = 'neutral';

    if (sentiment.includes('positive') || moodKeywords.some(k => ['happy', 'excited', 'joyful', 'energetic'].includes(k))) {
      category = 'positive';
    } else if (sentiment.includes('negative') || moodKeywords.some(k => ['sad', 'upset', 'down', 'disappointed'].includes(k))) {
      category = 'negative';
    } else if (moodKeywords.some(k => ['stressed', 'overwhelmed', 'tense', 'pressure'].includes(k))) {
      category = 'stressed';
    } else if (moodKeywords.some(k => ['anxious', 'worried', 'nervous', 'fearful'].includes(k))) {
      category = 'anxious';
    } else if (moodKeywords.some(k => ['excited', 'enthusiastic', 'eager', 'anticipating'].includes(k))) {
      category = 'excited';
    } else if (moodKeywords.some(k => ['sad', 'down', 'blue', 'melancholy'].includes(k))) {
      category = 'sad';
    } else if (moodKeywords.some(k => ['happy', 'content', 'pleased', 'satisfied'].includes(k))) {
      category = 'happy';
    }

    const meditations = fallbackMeditations[category] || fallbackMeditations.neutral;
    const randomMeditation = meditations[Math.floor(Math.random() * meditations.length)];

    return { meditationRecommendation: randomMeditation };
  }
}
