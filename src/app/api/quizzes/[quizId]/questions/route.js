import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all questions for a quiz
export async function GET(request, { params }) {
  // Defensive: Ensure params and quizId are present
  if (!params || !params.quizId) {
    return NextResponse.json(
      { error: 'Missing quizId in route parameters' },
      { status: 400 }
    );
  }
  const quizId = params.quizId;

  // Optionally: Validate quizId format (UUID)
  if (typeof quizId !== 'string' || !quizId.match(/^[\w-]{10,}$/)) {
    return NextResponse.json(
      { error: 'Invalid quizId format' },
      { status: 400 }
    );
  }

  try {
    // Optionally: Check if quiz exists
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    const questions = await prisma.question.findMany({
      where: { quizId },
      include: {
        answerOptions: true,
        questionType: true
      },
      orderBy: { sequence: 'asc' }
    });
    return NextResponse.json(questions);
  } catch (error) {
    // Prisma known error handling
    if (error.code === 'P2023') {
      // Invalid ID format
      return NextResponse.json(
        { error: 'Invalid quizId format' },
        { status: 400 }
      );
    }
    // Log and return generic error
    console.error('Failed to fetch questions:', error);
    return NextResponse.json(
      { error: `Failed to fetch questions: ${error.message}` },
      { status: 500 }
    );
  }
}

// CREATE a new question with answer options
export async function POST(request, { params }) {
  // Defensive: Ensure params and quizId are present
  if (!params || !params.quizId) {
    return NextResponse.json(
      { error: 'Missing quizId in route parameters' },
      { status: 400 }
    );
  }
  const quizId = params.quizId;

  // Optionally: Validate quizId format (UUID)
  if (typeof quizId !== 'string' || !quizId.match(/^[\w-]{10,}$/)) {
    return NextResponse.json(
      { error: 'Invalid quizId format' },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  const { text, sequence, points, questionTypeId, answerOptions } = body;

  // Validate required fields and types
  if (typeof text !== 'string' || !text.trim()) {
    return NextResponse.json(
      { error: 'Text is required and must be a non-empty string' },
      { status: 400 }
    );
  }
  if (typeof questionTypeId !== 'string' || !questionTypeId.trim()) {
    return NextResponse.json(
      { error: 'questionTypeId is required and must be a non-empty string' },
      { status: 400 }
    );
  }
  if (sequence !== undefined && typeof sequence !== 'number') {
    return NextResponse.json(
      { error: 'sequence must be a number if provided' },
      { status: 400 }
    );
  }
  if (points !== undefined && (typeof points !== 'number' || points < 0)) {
    return NextResponse.json(
      { error: 'points must be a positive number if provided' },
      { status: 400 }
    );
  }
  if (answerOptions && !Array.isArray(answerOptions)) {
    return NextResponse.json(
      { error: 'answerOptions must be an array if provided' },
      { status: 400 }
    );
  }

  // Optionally: Validate answerOptions structure
  if (Array.isArray(answerOptions)) {
    for (const [i, option] of answerOptions.entries()) {
      if (
        typeof option !== 'object' ||
        typeof option.optionText !== 'string' ||
        option.optionText.trim() === '' ||
        typeof option.sequence !== 'number' ||
        typeof option.isCorrect !== 'boolean'
      ) {
        return NextResponse.json(
          { error: `Each answerOption must have optionText (string), sequence (number), and isCorrect (boolean). Error at index ${i}` },
          { status: 400 }
        );
      }
    }
  }

  try {
    // Optionally: Check if quiz exists
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Optionally: Check if questionType exists
    const questionType = await prisma.questionType.findUnique({ where: { id: questionTypeId } });
    if (!questionType) {
      return NextResponse.json(
        { error: 'questionTypeId does not exist' },
        { status: 400 }
      );
    }

    const newQuestion = await prisma.$transaction(async (prisma) => {
      const question = await prisma.question.create({
        data: {
          text,
          sequence: sequence || 0,
          points: points || 1.0,
          questionTypeId,
          quizId
        }
      });

      if (answerOptions && answerOptions.length > 0) {
        await prisma.answerOption.createMany({
          data: answerOptions.map(option => ({
            optionText: option.optionText,
            sequence: option.sequence,
            isCorrect: option.isCorrect,
            questionId: question.id
          }))
        });
      }

      return prisma.question.findUnique({
        where: { id: question.id },
        include: { answerOptions: true, questionType: true }
      });
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    // Prisma known error handling
    if (error.code === 'P2003') {
      // Foreign key constraint failed
      return NextResponse.json(
        { error: 'Invalid quizId or questionTypeId: related record does not exist' },
        { status: 400 }
      );
    }
    // Log and return generic error
    console.error('Failed to create question:', error);
    return NextResponse.json(
      { error: `Failed to create question: ${error.message}` },
      { status: 500 }
    );
  }
}