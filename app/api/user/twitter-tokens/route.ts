import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const { twitterToken, twitterRefreshToken } = await req.json();

    if (!twitterToken) {
      return NextResponse.json({ message: 'Twitter token is required' }, { status: 400 });
    }

    // Save tokens to the user record in your database
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        twitterToken,
        twitterRefreshToken,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return NextResponse.json({ message: 'Twitter tokens saved successfully' });
  } catch (error) {
    console.error('Error saving Twitter tokens:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to save Twitter tokens' },
      { status: 500 }
    );
  }
} 