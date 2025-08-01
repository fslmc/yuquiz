import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT /api/quizzes/[quizId]/questions/[questionId]
export async function PUT(request, { params }) {
  const { quizId, questionId } = params;
  const body = await request.json();

  // Validate body as needed

  try {
    // Update question text
    await prisma.question.update({
      where: { id: questionId, quizId },
      data: { text: body.text },
    });

    // Upsert answer options
    for (const opt of body.answerOptions) {
      if (opt.id) {
        // Update existing option
        await prisma.answerOption.update({
          where: { id: opt.id },
          data: {
            optionText: opt.optionText,
            sequence: opt.sequence,
            isCorrect: opt.isCorrect,
          },
        });
      } else {
        // Create new option
        await prisma.answerOption.create({
          data: {
            optionText: opt.optionText,
            sequence: opt.sequence,
            isCorrect: opt.isCorrect,
            questionId,
          },
        });
      }
    }

    // Optionally: Delete removed options (not shown here, but you can compare existing IDs vs. sent IDs)

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update question/options' }, { status: 500 });
  }
}