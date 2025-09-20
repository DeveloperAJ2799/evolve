import { supabase } from './supabase';

export async function getCurrentUser(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('No authorization header');
  }

  return await getCurrentUser(authHeader.replace('Bearer ', ''));
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
