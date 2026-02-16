import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = await auth(); // Clerk's ID
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    // Security: Check if the session exists AND belongs to this user
    const session = await db.chatSession.findFirst({
      where: {
        id: sessionId,
        user: { clerkId: clerkId } // Direct relation check
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found or access denied' }, { status: 404 });
    }

    const history = await db.history.findMany({
      where: { sessionId: sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}