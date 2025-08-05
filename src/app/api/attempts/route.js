import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id

    try {
        const attempts = await prisma.quizAttempt.findMany({
            where: { userId },
            orderBy: { startedAt: 'desc' },
            include: {
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        desc: true,
                    }
                }
            }
        });

        const result = attempts.map(attempt => ({
            id: attempt.id,
            quizId: attempt.quizId,
            quizTitle: attempt.quiz?.title || '',
            quizDesc: attempt.quiz?.desc || '',
            startedAt: attempt.startedAt,
            finishedAt: attempt.finishedAt,
            score: attempt.score,
        }));
        console.log(userId)
        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to fetch attempts:', error);
        return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
    }
}
