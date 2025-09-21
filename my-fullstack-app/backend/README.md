# EVOLVE Backend Setup

This document explains how to set up the backend for the EVOLVE application.

## Prerequisites

1. **Node.js**: Version 18 or higher
2. **npm**: Package manager

## Setup Steps

### 1. Install Dependencies

Navigate to the backend directory and run:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the backend directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Start the Development Server

Run the following command to start the backend server:

```bash
npm run dev
```

### 4. Test the API Endpoints

You can test the following API endpoints:

- `POST /api/journal` - Create a journal entry
- `GET /api/friends` - Get friends list

### 5. Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header for protected routes.

## Directory Structure

- **src/controllers**: Contains controller functions for handling requests.
- **src/models**: Defines data models representing database entities.
- **src/routes**: Sets up routes linking endpoints to controller functions.
- **src/services**: Contains service functions encapsulating business logic.