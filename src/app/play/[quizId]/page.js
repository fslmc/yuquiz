'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlayQuiz({ params }) {
  const { quizId } = params;
  const router = useRouter();

  const [attemptId, setAttemptId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(null);

  // Start a new attempt when component mounts
  useEffect(() => {
    async function startAttempt() {
      try {
        setLoading(true);
        const res = await fetch(`/api/quizzes/${quizId}/attempts`, {
          method: 'POST',
        });
        if (!res.ok) {
          throw new Error('Failed to start attempt');
        }
        const data = await res.json();
        setAttemptId(data.attemptId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    startAttempt();
  }, [quizId]);

  // Fetch next question when attemptId changes or after submitting an answer
  useEffect(() => {
    if (!attemptId || finished) return;

    async function fetchNextQuestion() {
      try {
        setLoading(true);
        const res = await fetch(`/api/attempts/${attemptId}/next-question`);
        if (!res.ok) {
          throw new Error('Failed to fetch next question');
        }
        const data = await res.json();
        if (data.finished) {
          setFinished(true);
          setQuestion(null);
        } else {
          setQuestion(data.question);
          setSelectedOptionId(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNextQuestion();
  }, [attemptId, finished]);

  // Handle answer submission
  async function submitAnswer() {
    if (!selectedOptionId) {
      alert('Please select an option');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/attempts/${attemptId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          optionId: selectedOptionId,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to submit answer');
      }
      // After submitting, fetch next question
      setFinished(false); // reset finished in case
      setQuestion(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-4 text-white">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (finished) return <div className="p-4 text-white">Quiz finished! Thank you for playing.</div>;

  if (!question) return <div className="p-4 text-white">No question available.</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{question.text}</h2>
      <ul className="space-y-2 mb-4">
        {question.options.map((option) => (
          <li key={option.id}>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="option"
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() => setSelectedOptionId(option.id)}
                className="mr-2"
              />
              {option.text}
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={submitAnswer}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded disabled:opacity-50"
        disabled={loading || !selectedOptionId}
      >
        Submit Answer
      </button>
    </div>
  );
}
