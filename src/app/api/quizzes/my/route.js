import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/quizzes/my - Get quizzes created by the logged-in user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const quizzes = await prisma.quiz.findMany({
      where: { authorId: userId },
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
    console.error('Failed to fetch user quizzes:', error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}