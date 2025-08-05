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
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-highlight mb-6">All Quizzes</h1>
        {/* Button Row */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Link
            href="/quizzes/new"
            className="bg-accent hover:bg-accent-alt text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            + Create Quiz
          </Link>
          <Link
            href="/profile/my_quiz"
            className="bg-wine hover:bg-wine-alt text-neutral-light px-4 py-2 rounded font-semibold transition-colors"
          >
            My Quizzes
          </Link>
          <Link
            href="/result"
            className="bg-primary hover:bg-secondary text-neutral-light px-4 py-2 rounded font-semibold transition-colors"
          >
            My Records
          </Link>
        </div>
        <ul className="space-y-4 mt-4">
          {quizzes.map(quiz => (
            <li 
              key={quiz.id} 
              className="bg-primary rounded p-4 flex justify-between items-center border border-accent"
            >
              <div>
                <div className="font-semibold text-lg text-neutral-light">{quiz.title}</div>
                <div className="text-neutral-light-alt opacity-80">{quiz.desc}</div>
              </div>
              <Link 
                href={`/play/${quiz.id}`} 
                className="bg-accent hover:bg-accent-alt px-3 py-1 rounded text-white transition-colors"
              >
                Play
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}