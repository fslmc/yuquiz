// src/app/api/attempts/[attemptId]/finish/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
      let awaitedParams;
  try {
    awaitedParams = await params;
  } catch {
    awaitedParams = params;
  }
  const attemptId = awaitedParams.attemptId;
  // Calculate score
  const responses = await prisma.questionResponse.findMany({ where: { attemptId } });
  const correct = responses.filter(r => r.isCorrect).length;
  const score = correct; // Or sum points if you want

  const finishedAttempt = await prisma.quizAttempt.update({
    where: { id: attemptId },
    data: {
      finishedAt: new Date(),
      score,
    }
  });

  return NextResponse.json(finishedAttempt);
}