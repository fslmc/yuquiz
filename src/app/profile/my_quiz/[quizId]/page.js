'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from '@/app/hooks/useSession';
import Link from 'next/link';

export default function EditQuiz() {
  const router = useRouter();
  const { quizId } = useParams();
  const { session, loading } = useSession();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quiz and questions on mount
  useEffect(() => {
    if (!session && !loading) {
      router.push('/login');
      return;
    }

    async function fetchQuiz() {
      try {
        // Fetch quiz with questions and answerOptions
        const res = await fetch(`/api/quizzes/${quizId}?includeQuestions=true`);
        if (!res.ok) throw new Error('Failed to fetch quiz');
        const quiz = await res.json();
        setTitle(quiz.title || '');
        setDesc(quiz.desc || '');
        setQuestions(
          (quiz.questions || []).map(q => ({
            id: q.id,
            text: q.text,
            correct: q.answerOptions.findIndex(opt => opt.isCorrect),
            options: q.answerOptions.map(opt => opt.optionText),
            answerOptionIds: q.answerOptions.map(opt => opt.id), // for updating/deleting
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuiz();
  }, [quizId, session, loading, router]);

  // Handlers for editing questions/options
  const updateQuestion = (i, field, value) => {
    setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  };
  const updateOption = (qi, oi, value) => {
    setQuestions(qs => qs.map((q, idx) =>
      idx === qi ? { ...q, options: q.options.map((o, oidx) => oidx === oi ? value : o) } : q
    ));
  };
  const addOption = (qi) => {
    setQuestions(qs => qs.map((q, idx) =>
      idx === qi ? { ...q, options: [...q.options, ''], answerOptionIds: [...(q.answerOptionIds || []), null] } : q
    ));
  };
  const removeOption = (qi, oi) => {
    setQuestions(qs => qs.map((q, idx) =>
      idx === qi
        ? {
            ...q,
            options: q.options.filter((_, oidx) => oidx !== oi),
            answerOptionIds: (q.answerOptionIds || []).filter((_, oidx) => oidx !== oi),
            correct: q.correct === oi ? 0 : q.correct > oi ? q.correct - 1 : q.correct,
          }
        : q
    ));
  };
  const addQuestion = () => setQuestions(qs => [...qs, { text: '', options: ['', ''], correct: 0, questionTypeId: "1d960bf4-3503-4edf-a82f-28849d394170", answerOptionIds: [null, null] }]);
  const removeQuestion = (qi) => setQuestions(qs => qs.filter((_, idx) => idx !== qi));

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Update quiz title/desc
      const quizRes = await fetch(`/api/quizzes/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, desc }),
      });
      if (!quizRes.ok) {
        const err = await quizRes.json();
        throw new Error(err.error || 'Quiz update failed');
      }

      // 2. Update questions and options
      for (const q of questions) {
        // If q.id exists, update; else, create
        const payload = {
          text: q.text,
          sequence: Number(q.sequence ?? 0),
          points: Number(q.points ?? 1),
          questionTypeId: "1d960bf4-3503-4edf-a82f-28849d394170",
          answerOptions: q.options.map((optText, i) => ({
            id: q.answerOptionIds ? q.answerOptionIds[i] : undefined,
            optionText: optText,
            sequence: i,
            isCorrect: i === Number(q.correct),
          })),
        };
        let qRes;
        if (q.id) {
          // Update question
          qRes = await fetch(`/api/quizzes/${quizId}/questions/${q.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } else {
          // Create question
          qRes = await fetch(`/api/quizzes/${quizId}/questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }
        if (!qRes.ok) {
          const err = await qRes.json();
          throw new Error(`Question failed: ${err.error}`);
        }
      }

      // 3. Optionally: Delete removed questions/options (not shown here, see API section below)

      router.push(`/profile/my_quiz`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Edit Quiz</h1>
        {error && (
          <p className="mb-4 text-red-400">Error: {error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block mb-1">Title</label>
            <input
              className="w-full p-2 rounded bg-gray-800 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              className="w-full p-2 rounded bg-gray-800 text-white"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Questions</h2>
            {questions.map((q, qi) => (
              <div key={qi} className="bg-gray-900 rounded p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <input
                    value={q.text}
                    onChange={e => updateQuestion(qi, 'text', e.target.value)}
                    placeholder="Question text"
                    className="w-full p-2 rounded bg-gray-800 text-white"
                    required
                  />
                  <button type="button" onClick={() => removeQuestion(qi)} className="ml-2 text-red-400 hover:text-red-600 text-sm">Remove</button>
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`correct_${qi}`}
                        checked={q.correct == oi}
                        onChange={() => updateQuestion(qi, 'correct', oi)}
                        className="accent-red-500"
                      />
                      <input
                        value={opt}
                        onChange={e => updateOption(qi, oi, e.target.value)}
                        placeholder={`Option ${oi + 1}`}
                        className="p-2 rounded bg-gray-800 text-white flex-1"
                        required
                      />
                      <button type="button" onClick={() => removeOption(qi, oi)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(qi)} className="text-red-400 hover:text-red-600 text-sm">+ Add Option</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded text-white">+ Add Question</button>
          </div>
          <div className='space-x-1'>
            <button type="submit" className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-bold">Save Changes</button>
            <Link href="/profile/my_quiz" className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded text-white font-bold">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}