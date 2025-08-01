'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PartyPopper } from 'lucide-react';

export default function PlayQuiz() {
  const { quizId } = useParams();
  const [attemptId, setAttemptId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  // 1. Start attempt on mount
  useEffect(() => {
    if (!quizId) return;
    setLoading(true);
    fetch(`/api/quizzes/${quizId}/attempts`, { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setAttemptId(data.attemptId);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to start attempt');
        setLoading(false);
      });
  }, [quizId]);

  // 2. Fetch next question when attemptId changes
  useEffect(() => {
    if (!attemptId) return;
    setLoading(true);
    fetch(`/api/attempts/${attemptId}/next-question`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (data.done) {
          setDone(true);
          setQuestion(null);
        } else {
          setQuestion(data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch question');
        setLoading(false);
      });
  }, [attemptId]);

  // 3. Handle answer submission
  const handleAnswer = async (optionId) => {
    setLoading(true);
    await fetch(`/api/attempts/${attemptId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: question.id,
        selectedOptionId: optionId,
      }),
    });
    // Fetch next question
    fetch(`/api/attempts/${attemptId}/next-question`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (data.done) {
          setDone(true);
          setQuestion(null);
        } else {
          setQuestion(data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch next question');
        setLoading(false);
      });
  };

  return (
    // Main container with a dark background and centering flexbox.
    <div className="bg-zinc-900 text-white min-h-screen flex items-center justify-center p-4 font-sans">
      {/* Quiz card container with a black background, rounded corners, and a red border. */}
      <div className="bg-zinc-800 p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-2xl border-2 border-red-500">
        {/* State rendering based on loading, error, done, or question available. */}
        {loading && (
          // Loading state with a spinner.
          <div className="flex flex-col items-center justify-center h-64 text-red-500 animate-pulse">
            <svg className="animate-spin h-10 w-10 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl font-semibold">Loading...</p>
          </div>
        )}

        {error && (
          // Error state message.
          <div className="flex items-center justify-center h-64 text-red-500 text-xl font-semibold">
            Error: {error}
          </div>
        )}

        {done && (
          // "Quiz Complete" state with a celebratory icon.
          <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center text-red-500">
            <PartyPopper size={64} strokeWidth={1.5} />
            <h2 className="text-4xl md:text-5xl font-bold">Quiz complete! 🎉</h2>
            <p className="text-lg text-white">You&apos;ve answered all the questions.</p>
          </div>
        )}

        {/* Display the question if not loading, no error, not done, and question exists */}
        {!loading && !error && !done && question && (
          <div>
            {/* Question text with bold styling and red accent color. */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-red-500 mb-8 text-center">
              {question.text}
            </h2>
            <ul className="space-y-4">
              {/* Mapping through answer options to create styled buttons. */}
              {question.answerOptions.map(opt => (
                <li key={opt.id}>
                  <button
                    onClick={() => handleAnswer(opt.id)}
                    className="w-full bg-zinc-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 ease-in-out
                                 shadow-lg hover:bg-red-600 hover:text-black hover:shadow-red-500/50
                                 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    {opt.optionText}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* This is the initial state before fetching the first question */}
        {!loading && !error && !done && !question && attemptId && (
          <div className="flex items-center justify-center h-64 text-zinc-400 text-lg">
            Waiting for question...
          </div>
        )}

      </div>
    </div>
  );
}
