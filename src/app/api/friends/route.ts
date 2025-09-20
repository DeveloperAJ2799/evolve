import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Get friends where user is either user_id or friend_id
    const { data: friendships, error } = await supabase
      .from('friends')
      .select(`
        *,
        user:profiles!friends_user_id_fkey(id, email, full_name, avatar_url),
        friend:profiles!friends_friend_id_fkey(id, email, full_name, avatar_url)
      `)
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform the data to match the frontend Friend type
    const friends = friendships?.map(friendship => {
      const isUserInitiator = friendship.user_id === user.id;
      const friendProfile = isUserInitiator ? friendship.friend : friendship.user;

      return {
        id: friendship.id,
        name: friendProfile?.full_name || friendProfile?.email || 'Unknown',
        avatarUrl: friendProfile?.avatar_url || `https://picsum.photos/seed/${friendProfile?.id}/100/100`,
        status: 'Connected', // You can add more detailed status logic
        mood: 'Happy', // This would need to be stored separately or calculated
      };
    }) || [];

    return NextResponse.json({ friends });

  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { friendEmail } = await request.json();

    if (!friendEmail) {
      return NextResponse.json({ error: 'Friend email is required' }, { status: 400 });
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

    // Find the friend by email
    const { data: friendProfile, error: friendError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', friendEmail)
      .single();

    if (friendError || !friendProfile) {
      return NextResponse.json({ error: 'Friend not found' }, { status: 404 });
    }

    // Check if friendship already exists
    const { data: existingFriendship } = await supabase
      .from('friends')
      .select('*')
      .or(`and(user_id.eq.${user.id},friend_id.eq.${friendProfile.id}),and(user_id.eq.${friendProfile.id},friend_id.eq.${user.id})`)
      .single();

    if (existingFriendship) {
      return NextResponse.json({ error: 'Friendship already exists' }, { status: 400 });
    }

    // Create friendship
    const { data: friendship, error } = await supabase
      .from('friends')
      .insert({
        user_id: user.id,
        friend_id: friendProfile.id,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ friendship });

  } catch (error) {
    console.error('Error adding friend:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
