import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Debug logging
    console.log('Session data:', {
      hasSession: !!session,
      hasTwitterToken: !!session?.twitterToken,
      userId: session?.user?.id,
    });

    if (!session?.twitterToken) {
      console.log('Twitter token missing from session');
      return NextResponse.json(
        { message: 'Twitter not connected. Please reconnect your Twitter account.' },
        { status: 401 }
      );
    }

    const { content } = await req.json();
    console.log('Attempting to post tweet:', { contentLength: content?.length });

    if (!content) {
      return NextResponse.json(
        { message: 'Tweet content is required' },
        { status: 400 }
      );
    }

    // Create Twitter client with OAuth 2.0 token
    const client = new TwitterApi(session.twitterToken);
    
    try {
      // Verify credentials before posting
      const me = await client.v2.me();
      console.log('Twitter credentials verified:', { userId: me.data.id });
      
      // Post the tweet
      const tweet = await client.v2.tweet(content);
      console.log('Tweet posted successfully:', tweet.data);

      return NextResponse.json({
        message: 'Tweet posted successfully',
        tweet: tweet.data
      });
    } catch (twitterError: any) {
      console.error('Twitter API error:', {
        error: twitterError.message,
        code: twitterError.code,
        data: twitterError.data
      });
      throw twitterError;
    }
  } catch (error: any) {
    console.error('Error posting tweet:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    // Handle specific Twitter API errors
    if (error.code === 401) {
      return NextResponse.json(
        { message: 'Twitter authentication failed. Please reconnect your account.' },
        { status: 401 }
      );
    }

    if (error.code === 403) {
      return NextResponse.json(
        { message: 'You are not allowed to post tweets. Please check your Twitter account permissions.' },
        { status: 403 }
      );
    }

    if (error.code === 429) {
      return NextResponse.json(
        { message: 'Twitter rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Failed to post tweet: ' + (error.message || 'Unknown error'),
        error: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
} 