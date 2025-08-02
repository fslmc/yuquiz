'use client';

import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-sans px-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-6 text-center drop-shadow-lg">
          About this Platform
        </h1>

        <p className="mb-4 text-gray-300 leading-relaxed">
          Welcome to our yuQuiz! This website is designed to be an engaging space for you to create and play fun, interactive quizzes. Whether you&apos;re testing your knowledge on a specific topic or just looking for a good challenge, we aim to provide a seamless and enjoyable experience.
        </p>

        <p className="mb-4 text-gray-300 leading-relaxed">
          This project was developed as the **Final Assignment** for the **Jabar Digital Academy (JDA) Fullstack Program**. It serves as a culmination of the skills and knowledge I&apos;ve gained throughout the program, showcasing fullstack development from the database to the user interface.
        </p>
        
        <p className="mb-6 text-gray-300 leading-relaxed">
          The distinctive black and red theme is inspired by my <s>wife</s> oshi, <span className="font-semibold text-red-400">如月れん (Kisaragi Ren)</span>&apos;s aesthetic
        </p>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
