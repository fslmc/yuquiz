// src/app/api/quizzes/[quizId]/attempts/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const quizId = params.quizId;
  const userId = session.user.id;

  // Optionally: find or create a Session record for this user
  // For now, just use userId

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      sessionId: '...', // Set to current session id if you track it
      // startedAt auto-set
    }
  });

  return NextResponse.json(attempt, { status: 201 });
}