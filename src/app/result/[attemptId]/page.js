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

  if (loading) return <div className="p-4 text-white">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!result) return null;

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Quiz Result</h1>
      <div className="mb-4">
        <span className="font-semibold">Score:</span> {result.score}
      </div>
      <div className="mb-8">
        <span className="font-semibold">Finished At:</span> {result.finishedAt ? new Date(result.finishedAt).toLocaleString() : '-'}
      </div>
      <h2 className="text-xl font-bold text-red-400 mb-2">Answers</h2>
      <ul className="space-y-4">
        {result.results.map((q, i) => (
          <li key={q.questionId} className={`p-4 rounded ${q.isCorrect ? 'bg-green-900' : 'bg-red-900'}`}>
            <div className="font-semibold mb-2">{i + 1}. {q.questionText}</div>
            <div>
              <span className="font-semibold">Your Answer:</span>{' '}
              <span className={q.isCorrect ? 'text-green-400' : 'text-red-400'}>
                {q.selectedOption ?? <span className="italic text-gray-400">No answer</span>}
              </span>
            </div>
            {!q.isCorrect && (
              <div>
                <span className="font-semibold">Correct Answer:</span>{' '}
                <span className="text-green-400">{q.correctOption}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button
        className="mt-8 bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-bold"
        onClick={() => router.push('/quizzes')}
      >
        Back to Quizzes
      </button>
            <button
        className="mt-8 bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-bold"
        onClick={() => router.push('/result')}
      >
        Back to Results
      </button>
    </div>
  );
}