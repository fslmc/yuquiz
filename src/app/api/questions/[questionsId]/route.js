import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET a single question by ID
export async function GET(request, { params }) {
  const { questionId } = params;
  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { 
        answerOptions: true,
        questionType: true 
      }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch question: ${error.message}` },
      { status: 500 }
    );
  }
}

// UPDATE a question and its options
export async function PUT(request, { params }) {
  const { questionId } = params;
  const { text, sequence, points, questionTypeId, answerOptions } = await request.json();

  try {
    const updatedQuestion = await prisma.$transaction(async (prisma) => {
      // Update question
      const question = await prisma.question.update({
        where: { id: questionId },
        data: {
          text,
          sequence,
          points,
          questionTypeId
        }
      });

      // Handle answer options
      if (answerOptions && Array.isArray(answerOptions)) {
        const existingOptions = await prisma.answerOption.findMany({
          where: { questionId }
        });

        // Identify options to delete
        const optionsToDelete = existingOptions.filter(
          eo => !answerOptions.some(ao => ao.id === eo.id)
        );
        
        // Delete removed options
        if (optionsToDelete.length > 0) {
          await prisma.answerOption.deleteMany({
            where: { 
              id: { in: optionsToDelete.map(o => o.id) } 
            }
          });
        }

        // Update/create options
        for (const option of answerOptions) {
          if (option.id) {
            // Update existing option
            await prisma.answerOption.update({
              where: { id: option.id },
              data: {
                optionText: option.optionText,
                sequence: option.sequence,
                isCorrect: option.isCorrect
              }
            });
          } else {
            // Create new option
            await prisma.answerOption.create({
              data: {
                ...option,
                questionId
              }
            });
          }
        }
      }

      return prisma.question.findUnique({
        where: { id: questionId },
        include: { answerOptions: true }
      });
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update question: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE a question and its options
export async function DELETE(request, { params }) {
  const { questionId } = params;
  
  try {
    // Cascade delete handled by Prisma relations
    await prisma.question.delete({
      where: { id: questionId }
    });
    
    return NextResponse.json(
      { success: true, message: 'Question deleted' }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete question: ${error.message}` },
      { status: 500 }
    );
  }
}