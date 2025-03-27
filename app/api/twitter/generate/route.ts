import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      );
    }

    // For now, return a simple generated tweet
    // You can replace this with actual AI generation later
    const tweet = `${prompt} #AI #Generated`;

    return NextResponse.json({
      tweet,
      message: 'Tweet generated successfully'
    });
  } catch (error) {
    console.error('Error generating tweet:', error);
    return NextResponse.json(
      { message: 'Failed to generate tweet' },
      { status: 500 }
    );
  }
} 