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
            points: q.points ?? 1,
            correct: q.answerOptions.findIndex(opt => opt.isCorrect),
            options: q.answerOptions.map(opt => opt.optionText),
            answerOptionIds: q.answerOptions.map(opt => opt.id),
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
  const addQuestion = () => setQuestions(qs => [...qs, {
    text: '',
    points: 1,
    options: ['', ''],
    correct: 0,
    questionTypeId: "",
    answerOptionIds: [null, null]
  }]);

  const removeQuestion = (qi) => setQuestions(qs => qs.filter((_, idx) => idx !== qi));

  const handleKeyDown = (e) => {
    const regex = /[0-9]|Backspace/;
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

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
        const payload = {
          text: q.text,
          sequence: Number(q.sequence ?? 0),
          points: Number(q.points ?? 1),
          questionTypeId: "",
          answerOptions: q.options.map((optText, i) => ({
            id: q.answerOptionIds ? q.answerOptionIds[i] : undefined,
            optionText: optText,
            sequence: i,
            isCorrect: i === Number(q.correct),
          })),
        };
        let qRes;
        if (q.id) {
          qRes = await fetch(`/api/quizzes/${quizId}/questions/${q.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } else {
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

      router.push(`/profile/my_quiz`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight mx-auto mb-4"></div>
          <p className="text-xl text-foreground">Loading quiz editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-highlight mb-2">Edit Quiz</h1>
          <p className="text-neutral-light-alt">
            Update your quiz content and questions
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-primary border border-accent text-highlight">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label className="block text-neutral-light-alt mb-2 font-medium">Quiz Title</label>
              <input
                className="w-full p-3 rounded-lg bg-primary border border-accent focus:border-highlight focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-neutral-light-alt mb-2 font-medium">Description</label>
              <textarea
                className="w-full p-3 rounded-lg bg-primary border border-accent focus:border-highlight focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition-colors min-h-[100px]"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-accent pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-highlight">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-accent hover:bg-accent-alt text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Question
              </button>
            </div>

            {questions.map((q, qi) => (
              <div key={qi} className="bg-primary rounded-xl border border-accent p-5 mb-6 shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <label className="block text-neutral-light-alt mb-2 font-medium">
                      Question {qi + 1}
                    </label>
                    <input
                      value={q.text}
                      onChange={e => updateQuestion(qi, 'text', e.target.value)}
                      placeholder="Enter your question"
                      className="w-full p-3 rounded-lg bg-background border border-accent focus:border-highlight focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition-colors"
                      required
                    />
                  </div>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qi)}
                      className="ml-3 text-highlight hover:text-highlight-alt p-2 rounded-full hover:bg-accent hover:bg-opacity-20 transition-colors"
                      title="Remove question"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-neutral-light-alt mb-2 font-medium">
                    Points
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={q.points}
                    onChange={e => updateQuestion(qi, 'points', e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-24 p-2 rounded-lg bg-background border border-accent focus:border-highlight focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition-colors"
                    placeholder="max 1000"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-neutral-light-alt font-medium">Options</h3>
                  <div className="space-y-3">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`correct_${qi}`}
                          checked={q.correct == oi}
                          onChange={() => updateQuestion(qi, 'correct', oi)}
                          className="h-5 w-5 text-accent focus:ring-accent"
                          style={{ accentColor: 'var(--color-accent)' }}
                        />
                        <input
                          value={opt}
                          onChange={e => updateOption(qi, oi, e.target.value)}
                          placeholder={`Option ${oi + 1}`}
                          className="flex-1 p-3 rounded-lg bg-background border border-accent focus:border-highlight focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition-colors"
                          required
                        />

                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qi, oi)}
                            className="text-highlight hover:text-highlight-alt p-2 rounded-full hover:bg-accent hover:bg-opacity-20 transition-colors"
                            title="Remove option"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addOption(qi)}
                    className="text-accent hover:text-accent-alt text-sm font-medium flex items-center gap-1 mt-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Option
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-accent">
            <button
              type="submit"
              className="bg-accent hover:bg-accent-alt px-6 py-3 rounded-lg text-white font-bold flex-1 min-w-[150px] transition-colors"
            >
              Save Changes
            </button>
            <Link
              href="/profile/my_quiz"
              className="bg-primary hover:bg-secondary border border-accent px-6 py-3 rounded-lg text-foreground font-bold text-center flex-1 min-w-[150px] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}