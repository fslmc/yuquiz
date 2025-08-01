'use client';

import Link from 'next/link';
import { useSession } from '@/app/hooks/useSession';

export default function Navbar() {
  const { session, loading } = useSession();

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-black border-b border-red-600">
      <span className="text-2xl font-bold text-red-600 tracking-wide">yuQuiz</span>
      <div className="flex gap-6 items-center">
        <Link href="/" className="hover:text-red-400 transition-colors">
          Home
        </Link>
        <a href="#about" className="hover:text-red-400 transition-colors">
          About
        </a>
        <a href="/quizzes" className="hover:text-red-400 transition-colors">
          Play
        </a>
        {!loading && !session && (
          <Link href="/login" className="hover:text-red-400 transition-colors">
            Sign In
          </Link>
        )}
        {!loading && session && (
          <Link href="/profile" className="hover:text-red-400 transition-colors font-semibold">
            {session.name || 'User'}
          </Link>
        )}
      </div>
    </nav>
  );
}
