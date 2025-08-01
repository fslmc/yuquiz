// src/app/api/attempts/[attemptId]/finish/finishAttempt.js
import prisma from '@/lib/prisma';

export async function finishAttempt(attemptId) {
  const responses = await prisma.questionResponse.findMany({ where: { attemptId } });
  const correct = responses.filter(r => r.isCorrect).length;
  const score = correct; // Or sum points if you want

  return prisma.quizAttempt.update({
    where: { id: attemptId },
    data: {
      finishedAt: new Date(),
      score,
    }
  });
}