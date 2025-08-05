// app/profile/history/page.js
"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export default function HistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await fetch('/api/attempts');
        if (!response.ok) {
          throw new Error('Failed to fetch quiz attempts');
        }
        const data = await response.json();
        setAttempts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-xl">Loading your quiz history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center p-6 bg-primary rounded-lg border border-accent max-w-md">
          <h2 className="text-2xl font-bold text-highlight mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-accent hover:bg-accent-alt text-white px-4 py-2 rounded font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-highlight mb-2">Quiz History</h1>
          <p className="text-neutral-light-alt">
            Review your past quiz attempts and performance
          </p>
        </div>

        {attempts.length === 0 ? (
          <div className="bg-primary rounded-lg border border-accent p-8 text-center">
            <h2 className="text-2xl font-semibold text-highlight mb-4">No Quiz Attempts Found</h2>
            <p className="mb-6">You haven&apos;t completed any quizzes yet.</p>
            <Link 
              href="/quizzes" 
              className="bg-accent hover:bg-accent-alt text-white px-6 py-2 rounded-lg font-semibold inline-block"
            >
              Browse Quizzes
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {attempts.map((attempt) => (
              <div 
                key={attempt.id} 
                className="bg-primary rounded-lg border border-accent overflow-hidden shadow-lg"
              >
                <div className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-highlight">{attempt.quizTitle}</h2>
                      {attempt.quizDesc && (
                        <p className="text-neutral-light-alt mt-1 line-clamp-2">
                          {attempt.quizDesc}
                        </p>
                      )}
                    </div>
                    
                    {attempt.finishedAt ? (
                      <div className="bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Score: {attempt.score || 'N/A'}
                      </div>
                    ) : (
                      <div className="bg-wine text-neutral-light px-4 py-1 rounded-full text-sm font-semibold">
                        Incomplete
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-light-alt">Started:</p>
                      <p className="font-medium">
                        {format(parseISO(attempt.startedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-light-alt">
                        {attempt.finishedAt ? 'Completed:' : 'Status:'}
                      </p>
                      {attempt.finishedAt ? (
                        <p className="font-medium">
                          {format(parseISO(attempt.finishedAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      ) : (
                        <p className="text-highlight font-medium">Still in progress</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link 
                      href={`/result/${attempt.id}`}
                      className="inline-flex items-center text-accent hover:text-accent-alt font-medium"
                    >
                      View details
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 ml-1" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}