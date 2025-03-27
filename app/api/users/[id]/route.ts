import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    // Here you would typically fetch user data from your database
    // For now, we'll return the session user data
    return NextResponse.json({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      twitterToken: session.twitterToken,
      twitterRefreshToken: session.twitterRefreshToken,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== params.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();
    const { twitterToken, twitterRefreshToken } = body;

    // Here you would typically update the user in your database
    // For now, we'll just return success
    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        twitterToken,
        twitterRefreshToken,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 }
    );
  }
} 