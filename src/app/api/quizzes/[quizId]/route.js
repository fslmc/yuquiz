// src/app/api/quizzes/[quizId]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authorizeQuizOwner } from '@/lib/auth-utils';
import { auth } from '@/auth';

// GET /api/quizzes/:quizId - Get quiz by ID (optionally with questions)
export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const includeQuestions = searchParams.get('includeQuestions') === 'true';
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quizId },
      include: includeQuestions
        ? { questions: { include: { answerOptions: true } } }
        : undefined,
    });
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  }
}

// PUT /api/quizzes/:quizId - Update quiz
export async function PUT(request, { params }) {
  const { title, desc } = await request.json();
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { allowed, status, message } = await authorizeQuizOwner(params.quizId, session.user.id);
  if (!allowed) {
    return NextResponse.json({ error: message }, { status });
  }
  try {
    const quiz = await prisma.quiz.update({
      where: { id: params.quizId },
      data: { title, desc },
    });
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 });
  }
}

// DELETE /api/quizzes/:quizId - Delete quiz (cascade to questions/options)
export async function DELETE(request, { params }) {
    const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { allowed, status, message } = await authorizeQuizOwner(params.quizId, session.user.id);
  if (!allowed) {
    return NextResponse.json({ error: message }, { status });
  }
  try {
    await prisma.quiz.delete({
      where: { id: params.quizId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
  }
}