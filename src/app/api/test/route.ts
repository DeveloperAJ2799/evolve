import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Test environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          url: supabaseUrl
        }
      }, { status: 500 });
    }

    // Test basic fetch to Supabase
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return NextResponse.json({
          status: 'error',
          message: 'Cannot reach Supabase API',
          details: {
            status: response.status,
            statusText: response.statusText,
            url: supabaseUrl
          }
        }, { status: 500 });
      }
    } catch (fetchError) {
      return NextResponse.json({
        status: 'error',
        message: 'Network error reaching Supabase',
        details: {
          error: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          url: supabaseUrl
        }
      }, { status: 500 });
    }

    // Test Supabase client connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase client error:', error);

      // Check if it's a table not found error (expected if schema not set up)
      if (error.message.includes('relation "public.profiles" does not exist')) {
        return NextResponse.json({
          status: 'warning',
          message: 'Supabase connected but database schema not set up',
          details: {
            connection: 'success',
            schema: 'missing',
            nextStep: 'Run the SQL schema from supabase-schema.sql'
          }
        });
      }

      return NextResponse.json({
        status: 'error',
        message: 'Database query failed',
        details: {
          error: error.message,
          code: error.code,
          hint: error.hint
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Backend is working! Supabase connection successful.',
      details: {
        connection: 'success',
        schema: 'ready',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Test failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
