import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request, { params }) {
  let awaitedParams;
  try {
    awaitedParams = await params;
  } catch {
    awaitedParams = params;
  }
  const quizId = awaitedParams.quizId;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  // Find or create a Session record
  let userSession = await prisma.session.findFirst({
    where: { userId },
    orderBy: { expires: 'desc' },
  });
  if (!userSession) {
    userSession = await prisma.session.create({
      data: {
        userId,
        sessionToken: crypto.randomUUID(),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });
  }

  // Create the attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      sessionId: userSession.id,
    }
  });

  return NextResponse.json({ attemptId: attempt.id }, { status: 201 });
}