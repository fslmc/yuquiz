'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/app/hooks/useSession';

export default function MyQuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
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
    if (!confirm('Are you sure you want to delete this quiz?')) {
      return;
    }
    try {
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
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p>You must be logged in to view your quizzes.</p>
        <Link href="/login" className="text-red-500 underline mt-4">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-red-500 mb-6">My Quizzes</h1>
        <Link href="/profile" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded mb-4 inline-block">
          &larr; Back to Profile
        </Link>
        <ul className="space-y-4 mt-4">
          {quizzes.length === 0 ? (
            <li>No quizzes found.</li>
          ) : (
            quizzes.map(quiz => (
              <li key={quiz.id} className="bg-gray-900 rounded p-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">{quiz.title}</div>
                  <div className="text-gray-400">{quiz.desc}</div>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/profile/my_quiz/${quiz.id}`} className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded text-white">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white"
                    aria-label={`Delete quiz ${quiz.title}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
