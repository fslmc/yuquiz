// src/app/api/attempts/[attemptId]/responses/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
  const attemptId = params.attemptId;
  const { questionId, selectedOptionId, textAnswer } = await request.json();

  // Fetch question to check correct answer
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { answerOptions: true }
  });

  let isCorrect = null;
  if (selectedOptionId) {
    const option = question.answerOptions.find(opt => opt.id === selectedOptionId);
    isCorrect = option?.isCorrect ?? null;
  }
  // For text/essay, you may want to defer scoring

  const response = await prisma.questionResponse.create({
    data: {
      attemptId,
      questionId,
      selectedOptionId,
      textAnswer,
      isCorrect,
    }
  });

  return NextResponse.json(response, { status: 201 });
}