# EVOLVE - Mental Health & Wellness App

A personalized, AI-powered well-being app for journaling, meditation, and growth with authentication and backend support.

## 🚀 Features

- **🔐 Authentication System** - Sign up and sign in with Supabase
- **📝 Journaling** - Write daily entries with AI-powered sentiment analysis
- **💭 Personalized Affirmations** - Daily affirmations based on your mood
- **🧘 Meditation Recommendations** - Tailored meditation content
- **🎯 Goal Tracking** - Track your wellness objectives
- **👥 Social Features** - Connect with friends and community
- **📊 Analytics** - Weekly sentiment analysis and insights
- **🔄 Real-time Data** - Live updates with Supabase backend

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase (Required for Authentication & Backend)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to Settings > API in your Supabase dashboard
3. Copy your Project URL and anon/public key
4. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database Schema

Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL commands

### 4. Optional: Set Up Gemini AI (For Enhanced Features)

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Create an API key
3. Add it to your `.env.local`:
```env
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

**Note:** Without the Gemini API key, the app will use fallback responses for AI features.

### 5. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:9002` to see your app!

## 🔑 Authentication

### Sign Up
- Click "Sign Up" on the login page
- Enter your email and password
- Check your email for verification (Supabase sends confirmation emails)

### Sign In
- Click "Sign In" on the login page
- Enter your credentials
- You'll be redirected to the main app

## 📱 How to Use

1. **Sign In/Sign Up** - Create an account or log in
2. **Write Journal Entries** - Express your thoughts and feelings
3. **Get AI Insights** - Receive personalized affirmations and meditation recommendations
4. **Track Goals** - Monitor your wellness progress
5. **Connect with Others** - Use the friends and community features
6. **View Analytics** - Check your mood trends over time

## 🏗️ Architecture

### Frontend
- **Next.js 15.3.3** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components (shadcn/ui)

### Backend
- **Supabase** for authentication and database
- **Next.js API Routes** for server-side logic
- **PostgreSQL** database with real-time capabilities

### AI Integration
- **Google Gemini** for text generation and analysis
- **Fallback responses** when API is unavailable
- **Safe versions** of AI flows for reliability

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anonymous key |
| `GOOGLE_GENAI_API_KEY` | No | Your Gemini API key (for enhanced AI features) |

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── page.tsx           # Main page with authentication
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── login-page.tsx     # Authentication UI
│   ├── evolve-app.tsx     # Main app component
│   └── ui/                # Reusable UI components
├── ai/                    # AI flows and integrations
│   ├── flows/             # AI processing flows
│   └── genkit.ts          # Gemini AI configuration
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── auth.ts            # Authentication functions
│   └── api-client.ts      # API client utilities
└── hooks/                 # Custom React hooks
```

## 🚨 Troubleshooting

### Common Issues

1. **"Failed to load chunk" errors**
   - Restart the development server: `npm run dev`

2. **Authentication not working**
   - Check your Supabase credentials in `.env.local`
   - Ensure you've run the database schema

3. **AI features not working**
   - Check your Gemini API key
   - The app will use fallback responses without the API key

4. **Database connection issues**
   - Verify your Supabase project is active
   - Check the database schema has been applied

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Verify your environment variables
3. Ensure all setup steps have been completed
4. Check the terminal output for error messages

## 📄 License

This project is for educational and personal use.

---

**Happy evolving! 🌱** Your mental health journey starts here.
