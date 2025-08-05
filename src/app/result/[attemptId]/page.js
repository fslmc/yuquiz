'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function QuizResult() {
  const { attemptId } = useParams();
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!attemptId) return;
    setLoading(true);
    fetch(`/api/attempts/${attemptId}/result`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setResult(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight mx-auto mb-4"></div>
          <p className="text-xl text-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-primary border border-accent rounded-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-highlight mb-4">Error Loading Results</h2>
          <p className="mb-6 text-neutral-light">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-accent hover:bg-accent-alt text-white px-6 py-3 rounded-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-highlight mb-4">Quiz Results</h1>
          <div className="bg-primary border border-accent rounded-xl p-6 max-w-md mx-auto">
            <div className="text-5xl font-extrabold text-highlight mb-2">{result.score}</div>
            <p className="text-lg text-neutral-light">Final Score</p>
          </div>
        </div>
        
        <div className="bg-primary rounded-xl border border-accent p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-neutral-light-alt mb-1">Quiz Title</p>
              <p className="font-medium text-neutral-light">{result.quizTitle}</p>
            </div>
            <div>
              <p className="text-neutral-light-alt mb-1">Completed On</p>
              <p className="font-medium text-neutral-light">
                {result.finishedAt ? new Date(result.finishedAt).toLocaleString() : '-'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-highlight mb-6 pb-2 border-b border-accent">
            Your Answers
          </h2>
          <ul className="space-y-6">
            {result.results.map((q, i) => (
              <li 
                key={q.questionId} 
                className={`bg-primary rounded-xl border-l-4 ${q.isCorrect ? 'border-green-500' : 'border-accent'} p-5 shadow-md`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${q.isCorrect ? 'bg-green-900/30' : 'bg-accent/30'}`}>
                    {q.isCorrect ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-light">
                    {i + 1}. {q.questionText}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-neutral-light-alt mb-1">Your Answer</p>
                    <p className={`font-medium ${q.isCorrect ? 'text-green-400' : 'text-highlight'}`}>
                      {q.selectedOption || <span className="italic text-neutral-light-alt">No answer provided</span>}
                    </p>
                  </div>
                  
                  {!q.isCorrect && (
                    <div>
                      <p className="text-neutral-light-alt mb-1">Correct Answer</p>
                      <p className="font-medium text-green-400">{q.correctOption}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            className="bg-accent hover:bg-accent-alt px-6 py-3 rounded-lg text-white font-bold min-w-[200px] transition-colors"
            onClick={() => router.push('/quizzes')}
          >
            Back to Quizzes
          </button>
          <button
            className="bg-wine hover:bg-wine-alt px-6 py-3 rounded-lg text-neutral-light font-bold min-w-[200px] transition-colors"
            onClick={() => router.push('/result')}
          >
            View All Results
          </button>
        </div>
      </div>
    </div>
  );
}