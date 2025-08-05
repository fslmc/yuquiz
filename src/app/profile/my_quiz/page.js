'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/app/hooks/useSession';

export default function MyQuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const { session } = useSession();

  useEffect(() => {
    fetch('/api/quizzes/my')
      .then(res => res.json())
      .then(data => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch user quizzes:', err);
        setQuizzes([]);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleting(quizId);
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
      } else {
        const errorData = await response.json();
        alert('Failed to delete quiz: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to delete quiz: ' + error.message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight mx-auto mb-4"></div>
          <p className="text-xl text-foreground">Loading your quizzes...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="bg-primary rounded-xl border border-accent p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-highlight mb-4">Authentication Required</h2>
          <p className="mb-6 text-neutral-light">You must be logged in to view your quizzes</p>
          <Link 
            href="/login" 
            className="bg-accent hover:bg-accent-alt text-white px-6 py-3 rounded-lg font-semibold inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-highlight mb-2">My Quizzes</h1>
            <p className="text-neutral-light-alt">
              Manage quizzes you&apos;ve created
            </p>
          </div>
          <Link 
            href="/profile" 
            className="bg-primary hover:bg-secondary border border-accent px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Profile
          </Link>
        </div>
        
        {quizzes.length === 0 ? (
          <div className="bg-primary rounded-xl border border-accent p-8 text-center">
            <h2 className="text-2xl font-bold text-highlight mb-4">No Quizzes Created Yet</h2>
            <p className="mb-6 text-neutral-light">You haven&apos;t created any quizzes yet. Start by creating your first quiz!</p>
            <Link 
              href="/quizzes/new" 
              className="bg-accent hover:bg-accent-alt text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map(quiz => (
              <div 
                key={quiz.id} 
                className="bg-primary rounded-xl border border-accent overflow-hidden shadow-lg"
              >
                <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-highlight mb-1">{quiz.title}</h2>
                    {quiz.desc && (
                      <p className="text-neutral-light-alt line-clamp-2">
                        {quiz.desc}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <Link 
                      href={`/profile/my_quiz/${quiz.id}`} 
                      className="bg-wine hover:bg-wine-alt px-4 py-2 rounded-lg text-neutral-light flex items-center gap-2 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      disabled={deleting === quiz.id}
                      className="bg-primary border border-accent hover:bg-secondary px-4 py-2 rounded-lg text-foreground flex items-center gap-2 transition-colors disabled:opacity-50"
                      aria-label={`Delete quiz ${quiz.title}`}
                    >
                      {deleting === quiz.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-highlight"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="bg-background px-5 py-3 text-sm text-neutral-light-alt flex justify-between items-center">
                  <span>Created on: {new Date(quiz.createdAt).toLocaleDateString()}</span>
                  <span className="bg-accent text-white px-2 py-1 rounded text-xs">
                    {quiz.questions?.length || 0} {quiz.questions?.length === 1 ? 'Question' : 'Questions'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}