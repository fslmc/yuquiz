// app/quizzes/new/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/app/hooks/useSession';
import Link from 'next/link';


export default function CreateQuiz() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const { session, loading } = useSession();
  const [questions, setQuestions] = useState([
    { text: '', options: ['', ''], correct: 0, points: 1 }
  ])

  const addQuestion = () => setQuestions(qs => [...qs, { text: '', options: ['', ''], correct: 0, points: 1 }])
  const updateQuestion = (i, field, value) => {
    setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, [field]: value } : q))
  }
  const updateOption = (qi, oi, value) => {
    setQuestions(qs => qs.map((q, idx) =>
      idx === qi ? { ...q, options: q.options.map((o, oidx) => oidx === oi ? value : o) } : q
    ))
  }
  const addOption = (qi) => {
    setQuestions(qs => qs.map((q, idx) =>
      idx === qi ? { ...q, options: [...q.options, ''] } : q
    ))
  }

  // Event handler to prevent non-numeric input
  const handleKeyDown = (e) => {
    // Allow digits, backspace, delete, and arrow keys
    const regex = /[0-9\b]/;
    // Check if the key is a single digit or one of the allowed keys
    if (!regex.test(e.key) && e.key.length === 1 &&
      e.key !== 'Backspace' && e.key !== 'Delete' &&
      e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault();
    }
  };

  const removeQuestion = (qi) => setQuestions(qs => qs.filter((_, idx) => idx !== qi));
  const removeOption = (qi, oi) => {
    setQuestions(qs =>
      qs.map((q, idx) =>
        idx === qi
          ? {
            ...q,
            options: q.options.filter((_, i) => i !== oi),
            // Adjust correct index if needed
            correct: q.correct >= oi
              ? Math.max(0, q.correct - 1)
              : q.correct
          }
          : q
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 1) create the quiz
    const quizRes = await fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, desc, authorId: session.id })
    })
    if (!quizRes.ok) throw new Error('Failed to create quiz')
    const quiz = await quizRes.json()

    // 2) create each question + its options in one shot
    for (const q of questions) {
      const payload = {
        text: q.text,
        sequence: Number(q.sequence ?? 0),
        points: Number(q.points ?? 1),
        questionTypeId: "1d960bf4-3503-4edf-a82f-28849d394170",
        answerOptions: q.options.map((optText, i) => ({
          optionText: optText,
          sequence: i,
          isCorrect: i === Number(q.correct)
        }))
      }

      const qRes = await fetch(
        `/api/quizzes/${quiz.id}/questions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )
      if (!qRes.ok) {
        const err = await qRes.json()
        throw new Error(`Question failed: ${err.error}`)
      }
    }

    // 3) finally, navigate into the fully-built quiz
    router.push(`/quizzes`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Create Quiz</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded bg-gray-800 text-white" required />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 rounded bg-gray-800 text-white" />
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
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qi)}
                      className="ml-2 text-red-400 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* New points input field */}
                <div className="mb-2">
                  <label className="block text-sm mb-1">Points</label>
                  <input
                    type="text" // Changed to text to handle keydown validation
                    value={q.points}
                    onChange={e => updateQuestion(qi, 'points', e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder='Max 1000 Points'
                    required
                  />

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
                      {/* Remove Option Button */}
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qi, oi)}
                          className="bg-gray-700 hover:bg-red-600 text-white px-2 py-1 rounded"
                          title="Remove this option"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(qi)} className="text-red-400 hover:text-red-600 text-sm">+ Add Option</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded text-white">+ Add Question</button>
          </div>
          <div className='space-x-1'>
            <button type="submit" className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-bold">Save Quiz</button>
            <Link href="/quizzes" className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-bold">
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
