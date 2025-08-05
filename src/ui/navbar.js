'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/app/hooks/useSession';

export default function Navbar() {
  const { session, loading } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-primary text-neutral-light font-sans border-b-2 border-accent">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and brand name */}
        <Link href="/" className="text-3xl font-extrabold text-highlight tracking-wider">
          yuQuiz
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 items-center text-lg">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-secondary transition-colors">
            About
          </Link>
          <Link href="/quizzes" className="hover:text-secondary transition-colors">
            Play
          </Link>
          {!loading && !session && (
            <Link 
              href="/login" 
              className="px-4 py-2 rounded-lg border-2 border-accent hover:bg-accent transition-colors"
            >
              Sign In
            </Link>
          )}
          {!loading && session && (
            <Link href="/profile" className="font-semibold text-highlight hover:text-highlight-alt transition-colors">
              {session.name || 'User'}
            </Link>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-neutral-light focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? (
            // Close icon (X)
            <svg
              className="w-8 h-8 text-highlight"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="w-8 h-8 text-highlight"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary absolute top-16 left-0 right-0 z-50 shadow-lg p-6 flex flex-col items-start gap-4 text-xl border-t border-accent">
          <Link href="/" className="w-full text-neutral-light hover:text-secondary transition-colors" onClick={toggleMenu}>
            Home
          </Link>
          <Link href="/about" className="w-full text-neutral-light hover:text-secondary transition-colors" onClick={toggleMenu}>
            About
          </Link>
          <Link href="/quizzes" className="w-full text-neutral-light hover:text-secondary transition-colors" onClick={toggleMenu}>
            Play
          </Link>
          {!loading && !session && (
            <Link href="/login" className="w-full text-neutral-light hover:text-secondary transition-colors" onClick={toggleMenu}>
              Sign In
            </Link>
          )}
          {!loading && session && (
            <Link href="/profile" className="w-full text-neutral-light hover:text-highlight transition-colors" onClick={toggleMenu}>
              {session.name || 'Profile'}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}