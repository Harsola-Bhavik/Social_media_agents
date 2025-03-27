import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }

    // Check if session has Twitter tokens
    const isConnected = !!(session.twitterToken && session.twitterRefreshToken);

    return NextResponse.json({ 
      connected: isConnected,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      }
    });
  } catch (error) {
    console.error('Error verifying Twitter connection:', error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
} 