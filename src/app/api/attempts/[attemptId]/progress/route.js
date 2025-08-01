// src/app/api/attempts/[attemptId]/progress/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
      let awaitedParams;
  try {
    awaitedParams = await params;
  } catch {
    awaitedParams = params;
  }
  const attemptId = awaitedParams.attemptId;
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      quiz: { include: { questions: true } },
      responses: true
    }
  });
  if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });

  const total = attempt.quiz.questions.length;
  const answered = attempt.responses.length;
  const correct = attempt.responses.filter(r => r.isCorrect).length;

  return NextResponse.json({ total, answered, correct });
}