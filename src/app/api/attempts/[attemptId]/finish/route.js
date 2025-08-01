// src/app/api/attempts/[attemptId]/finish/route.js
import { NextResponse } from 'next/server';
import { finishAttempt } from './finishAttempt';

export async function POST(request, { params }) {
  try {
    const attemptId = params.attemptId;
    if (!attemptId) {
      return NextResponse.json({ error: 'Missing attemptId parameter' }, { status: 400 });
    }
    const finishedAttempt = await finishAttempt(attemptId);
    return NextResponse.json(finishedAttempt);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
