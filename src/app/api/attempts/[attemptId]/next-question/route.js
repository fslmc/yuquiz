// src/app/api/attempts/[attemptId]/next-question/route.js
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
  // Find the attempt and its quiz
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: { quiz: { include: { questions: { include: { answerOptions: true } } } }, responses: true }
  });
  if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });

  // Find the next unanswered question (by sequence)
  const answeredIds = attempt.responses.map(r => r.questionId);
  const nextQuestion = attempt.quiz.questions
    .filter(q => !answeredIds.includes(q.id))
    .sort((a, b) => a.sequence - b.sequence)[0];

  if (!nextQuestion) {
    return NextResponse.json({ done: true }, { status: 200 });
  }

  console.log('QuizAttempt:', attemptId);
console.log('Quiz ID:', attempt.quiz.id);
console.log('Questions:', attempt.quiz.questions.map(q => q.id));
console.log('Responses:', attempt.responses.map(r => r.questionId));

  return NextResponse.json(nextQuestion);
}