// src/app/api/quizzes/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/quizzes - List all quizzes
export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        desc: true,
        authorId: true,
        createdAt: true,
      },
    });
    return NextResponse.json(quizzes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}

// POST /api/quizzes - Create a new quiz
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    // Malformed JSON
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  // Validate required fields and types
  const { title, desc, authorId } = body;
  if (
    typeof title !== 'string' ||
    typeof desc !== 'string' ||
    typeof authorId !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Invalid or missing fields: title, desc (string), authorId (number) required' },
      { status: 400 }
    );
  }

  // Optionally: check for empty strings
  if (!title.trim() || !desc.trim()) {
    return NextResponse.json(
      { error: 'Title and description cannot be empty' },
      { status: 400 }
    );
  }

  try {
    // Optionally: check if author exists
    const author = await prisma.user.findUnique({ where: { id: authorId } });
    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    // Optionally: enforce unique quiz title per author
    // const existingQuiz = await prisma.quiz.findFirst({ where: { title, authorId } });
    // if (existingQuiz) {
    //   return NextResponse.json(
    //     { error: 'Quiz title already exists for this author' },
    //     { status: 409 }
    //   );
    // }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        desc,
        authorId,
      },
    });
    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    // Handle known Prisma errors
    if (error.code === 'P2002') {
      // Unique constraint failed
      return NextResponse.json(
        { error: 'Quiz with this title already exists' },
        { status: 409 }
      );
    }
    if (error.code === 'P2003') {
      // Foreign key constraint failed
      return NextResponse.json(
        { error: 'Invalid authorId: user does not exist' },
        { status: 400 }
      );
    }
    // Log and return generic error
    console.error('Failed to create quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}