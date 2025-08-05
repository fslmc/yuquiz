'use client';

import Link from 'next/link';
import { useState } from 'react';
import ImageModal from '@/ui/aboutImg'; 

export default function About() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans px-4 py-8">
      <div className="bg-primary p-8 rounded-xl border border-accent shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-highlight mb-6 text-center drop-shadow-lg">
          About yuQuiz
        </h1>

        <div className="space-y-5 text-neutral-light">
          <p className="leading-relaxed">
            Welcome to <span className="font-semibold text-highlight">yuQuiz</span>! 
            This interactive platform is designed for quiz enthusiasts to create, play, 
            and share engaging quizzes. Test your knowledge and challenge friends in an enjoyable experience.
          </p>

          <p className="leading-relaxed">
            This project was developed as the Final Assignment for the 
            <span className="font-semibold text-highlight"> Jabar Digital Academy (JDA) Fullstack Program</span>, 
          </p>

          <p className="leading-relaxed">
            The distinctive black and red theme is inspired by my <s>wife</s> oshi,&nbsp; 
            <span
              className="font-semibold text-highlight cursor-pointer hover:underline hover:text-highlight-alt transition-colors"
              onClick={toggleModal}
            >
              如月れん (Kisaragi Ren)
            </span>
            &apos;s aesthetic.
          </p>

          <div className="pt-4 border-t border-accent mt-4">
            <h3 className="text-xl font-bold text-highlight mb-3">Project Repository</h3>
            <p className="mb-4">
              This project is open source! Feel free to explore the code, contribute, or learn how it was built:
            </p>
            <a 
              href="https://github.com/fslmc/yuquiz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary border border-accent hover:bg-secondary px-5 py-3 rounded-lg font-medium transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="bg-accent hover:bg-accent-alt text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors text-center"
          >
            Back to Home
          </Link>
          
          <Link
            href="/quizzes"
            className="bg-wine hover:bg-wine-alt text-neutral-light font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors text-center"
          >
            Browse Quizzes
          </Link>
        </div>
      </div>
      {isModalOpen && <ImageModal onClose={toggleModal} />}
    </div>
  );
}