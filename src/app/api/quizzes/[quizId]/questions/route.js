import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const MAX_POINTS_PER_QUESTION = 1000;

// GET all questions for a quiz
export async function GET(request, { params }) {
  let awaitedParams;
  try {
    awaitedParams = await params;
  } catch (e) {
    awaitedParams = params;
  }

  const quizId = awaitedParams?.quizId;
  if (!quizId || typeof quizId !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid quizId in route parameters' },
      { status: 400 }
    );
  }

  // Simplified validation to allow for short IDs like '1'
  if (quizId.trim() === '') {
    return NextResponse.json(
      { error: 'Invalid quizId format: must be a non-empty string' },
      { status: 400 }
    );
  }

  try {
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
    if (error.code === 'P2023') {
      return NextResponse.json(
        { error: 'Invalid quizId format' },
        { status: 400 }
      );
    }
    console.error('Failed to fetch questions:', error);
    return NextResponse.json(
      { error: `Failed to fetch questions: ${error.message}` },
      { status: 500 }
    );
  }
}

// CREATE a new question with answer options
export async function POST(request, { params }) {
  let awaitedParams;
  try {
    awaitedParams = await params;
  } catch (e) {
    awaitedParams = params;
  }

  const quizId = awaitedParams?.quizId;
  if (!quizId || typeof quizId !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid quizId in route parameters' },
      { status: 400 }
    );
  }

  // Simplified validation to allow for short IDs like '1'
  if (quizId.trim() === '') {
    return NextResponse.json(
      { error: 'Invalid quizId format: must be a non-empty string' },
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

  let { text, sequence, points, questionTypeId, answerOptions } = body;

  // Convert string values from the payload to numbers if they exist
  if (typeof sequence === 'string') {
    sequence = parseInt(sequence, 10);
    if (isNaN(sequence)) {
      return NextResponse.json(
        { error: 'sequence must be a number or a string that can be parsed to a number' },
        { status: 400 }
      );
    }
  }

  if (typeof points === 'string') {
    points = parseFloat(points);
    if (isNaN(points)) {
      return NextResponse.json(
        { error: 'points must be a number or a string that can be parsed to a number' },
        { status: 400 }
      );
    }
  }

  if (points !== undefined && (typeof points !== 'number' || points <= 0)) {
  return NextResponse.json(
      { error: 'points must be a positive number if provided' },
      { status: 400 }
    );
  }

  if (points > MAX_POINTS_PER_QUESTION) {
  return NextResponse.json(
      { error: `Points per question cannot exceed ${MAX_POINTS_PER_QUESTION}` },
      { status: 400 }
    );
  }

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
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

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
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid quizId or questionTypeId: related record does not exist' },
        { status: 400 }
      );
    }
    console.error('Failed to create question:', error);
    return NextResponse.json(
      { error: `Failed to create question: ${error.message}` },
      { status: 500 }
    );
  }
}
