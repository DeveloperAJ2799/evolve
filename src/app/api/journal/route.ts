import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { analyzeJournalSentiment } from '@/ai/flows/analyze-journal-sentiment';
import { generatePersonalizedAffirmations } from '@/ai/flows/generate-personalized-affirmations';
import { recommendMeditationBasedOnSentiment } from '@/ai/flows/recommend-meditations-based-on-sentiment';
import { generateMeditationAudio } from '@/ai/flows/generate-meditation-audio';
import { suggestSocialService } from '@/ai/flows/suggest-social-service';
import { analyzeWeeklySentiment } from '@/ai/flows/analyze-weekly-sentiment';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Get the authenticated user
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Analyze sentiment
    const sentimentAnalysis = await analyzeJournalSentiment({ journalEntry: content });
    const mood = sentimentAnalysis.moodKeywords.join(', ') || sentimentAnalysis.sentiment;

    // Create journal entry
    const { data: journalEntry, error: journalError } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        content,
        sentiment: sentimentAnalysis.sentiment,
        mood_keywords: sentimentAnalysis.moodKeywords,
      })
      .select()
      .single();

    if (journalError) {
      throw journalError;
    }

    // Get meditation recommendation
    const meditationResult = await recommendMeditationBasedOnSentiment({
      sentiment: sentimentAnalysis.sentiment,
      moodKeywords: sentimentAnalysis.moodKeywords,
    });

    // Generate parallel content (affirmation, social service)
    const [affirmationResult, socialServiceResult] = await Promise.all([
      generatePersonalizedAffirmations({ mood }),
      suggestSocialService({
        sentiment: sentimentAnalysis.sentiment,
        moodKeywords: sentimentAnalysis.moodKeywords,
      }),
    ]);

    // Save affirmation
    const { data: affirmation, error: affirmationError } = await supabase
      .from('affirmations')
      .insert({
        user_id: user.id,
        content: affirmationResult.affirmation,
      })
      .select()
      .single();

    if (affirmationError) {
      console.error('Error saving affirmation:', affirmationError);
    }

    // Save meditation
    const { data: meditation, error: meditationError } = await supabase
      .from('meditations')
      .insert({
        user_id: user.id,
        content: meditationResult.meditationRecommendation,
        audio_data_uri: null, // Will be updated when audio is generated
      })
      .select()
      .single();

    if (meditationError) {
      console.error('Error saving meditation:', meditationError);
    }

    // Update or create goal
    if (socialServiceResult) {
      const { error: goalError } = await supabase
        .from('goals')
        .upsert({
          user_id: user.id,
          title: socialServiceResult.title,
          description: socialServiceResult.description,
          target: 5,
          progress: 0,
        });

      if (goalError) {
        console.error('Error updating goal:', goalError);
      }
    }

    // Generate audio (async)
    try {
      const audioResult = await generateMeditationAudio(meditationResult.meditationRecommendation);

      // Update meditation with audio
      await supabase
        .from('meditations')
        .update({ audio_data_uri: audioResult.audioDataUri })
        .eq('id', meditation?.id);
    } catch (audioError) {
      console.error('Audio generation failed:', audioError);
    }

    // Weekly analysis
    const { data: recentEntries } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(7);

    if (recentEntries && recentEntries.length >= 4) {
      const weeklyAnalysisResult = await analyzeWeeklySentiment({
        journalEntries: recentEntries.map(e => ({
          date: new Date(e.created_at).toLocaleDateString(),
          content: e.content,
          sentiment: e.sentiment,
        }))
      });

      // Handle bad week notification logic here
      if (weeklyAnalysisResult?.isBadWeek) {
        // Could trigger notifications to friends
        console.log('Bad week detected for user:', user.id);
      }
    }

    return NextResponse.json({
      journalEntry,
      affirmation: affirmation || { content: affirmationResult.affirmation },
      meditation: meditation || { content: meditationResult.meditationRecommendation },
      goal: socialServiceResult,
    });

  } catch (error) {
    console.error('Error processing journal entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ entries });

  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
