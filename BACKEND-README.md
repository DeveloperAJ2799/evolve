# EVOLVE Backend Setup

This document explains how to set up the Supabase backend for the EVOLVE application.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18 or higher
3. **npm**: Package manager

## Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up (usually takes a few minutes)
3. Go to Settings > API to get your project credentials:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: Your public API key

### 2. Set Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase-schema.sql` from this project
4. Paste and run the SQL script
5. This will create all necessary tables, policies, and triggers

### 4. Install Dependencies

```bash
npm install
```

### 5. Test the Setup

1. Start the development server:
```bash
npm run dev
```

2. Test the API endpoints:
   - `POST /api/journal` - Create a journal entry
   - `GET /api/journal` - Get journal entries
   - `POST /api/goals` - Create a goal
   - `GET /api/goals` - Get goals
   - `POST /api/friends` - Add a friend
   - `GET /api/friends` - Get friends list

### 6. Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```javascript
const response = await fetch('/api/journal', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`,
  },
  body: JSON.stringify({ content: 'My journal entry' }),
});
```

## Database Schema

### Tables Created

- **profiles**: Extended user profiles
- **journal_entries**: User journal entries with sentiment analysis
- **goals**: User wellness goals
- **friends**: User friendships
- **affirmations**: Personalized affirmations
- **meditations**: Meditation recommendations and audio

### Row Level Security

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## API Endpoints

### Journal
- `POST /api/journal` - Create journal entry (with AI processing)
- `GET /api/journal` - Get user's journal entries

### Goals
- `GET /api/goals` - Get user's goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals` - Update existing goal

### Friends
- `GET /api/friends` - Get user's friends
- `POST /api/friends` - Add new friend

### Affirmations
- `GET /api/affirmations` - Get user's affirmations
- `POST /api/affirmations` - Create affirmation

### Meditations
- `GET /api/meditations` - Get user's meditations
- `POST /api/meditations` - Create meditation

## Features

- **Real-time subscriptions**: Live updates for journal entries, goals, etc.
- **AI integration**: Automatic sentiment analysis and content generation
- **Authentication**: Secure user authentication with Supabase Auth
- **Row Level Security**: Users can only access their own data
- **TypeScript support**: Full type safety with generated types

## Next Steps

1. **Update Frontend**: Modify the React components to use the new API endpoints
2. **Add Real-time**: Implement Supabase real-time subscriptions for live updates
3. **Error Handling**: Add comprehensive error handling and user feedback
4. **Testing**: Add unit and integration tests for the API endpoints

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Supabase project allows your domain
2. **Authentication Errors**: Check that your JWT token is valid and not expired
3. **Database Errors**: Verify that the schema was created correctly

### Getting Help

- Check the Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Review the API logs in your Supabase dashboard
- Check the browser console for client-side errors
