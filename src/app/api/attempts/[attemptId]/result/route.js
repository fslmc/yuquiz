// src/app/api/attempts/[attemptId]/result/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const attemptId = params.attemptId;

  // Fetch attempt, responses, questions, and options
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      quiz: {
        include: {
          questions: {
            include: { answerOptions: true }
          }
        }
      },
      responses: true,
    }
  });

  if (!attempt) {
    return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  }

  // Map each question to its result
  const results = attempt.quiz.questions.map(q => {
    const response = attempt.responses.find(r => r.questionId === q.id);
    const selectedOption = q.answerOptions.find(opt => opt.id === response?.selectedOptionId);
    const correctOption = q.answerOptions.find(opt => opt.isCorrect);

    return {
      questionId: q.id,
      questionText: q.text,
      selectedOption: selectedOption ? selectedOption.optionText : null,
      selectedOptionId: selectedOption ? selectedOption.id : null,
      isCorrect: response?.isCorrect ?? false,
      correctOption: correctOption ? correctOption.optionText : null,
      correctOptionId: correctOption ? correctOption.id : null,
    };
  });

  return NextResponse.json({
    score: attempt.score,
    finishedAt: attempt.finishedAt,
    results,
  });
}