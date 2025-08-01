// app/quizzes/page.js
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    fetch('/api/quizzes')
      .then(res => res.json())
      .then(data => setQuizzes(data))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-red-500 mb-6">All Quizzes</h1>
        <Link href="/quizzes/new" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mb-4 inline-block">+ Create Quiz</Link>
        <ul className="space-y-4 mt-4">
          {quizzes.map(quiz => (
            <li key={quiz.id} className="bg-gray-900 rounded p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">{quiz.title}</div>
                <div className="text-gray-400">{quiz.desc}</div>
              </div>
              <Link href={`/play/${quiz.id}`} className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded text-white">Play</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}