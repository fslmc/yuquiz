import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      { authenticated: false }, 
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    authenticated: true,
    user: session.user
  });
}