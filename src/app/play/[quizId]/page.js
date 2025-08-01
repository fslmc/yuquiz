'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function PlayQuiz() {
  const { quizId } = useParams()
  const [attemptId, setAttemptId] = useState(null)
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  // 1. Start attempt on mount
  useEffect(() => {
    if (!quizId) return
    setLoading(true)
    fetch(`/api/quizzes/${quizId}/attempts`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setAttemptId(data.attemptId)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to start attempt')
        setLoading(false)
      })
  }, [quizId])

  // 2. Fetch next question when attemptId changes
  useEffect(() => {
    if (!attemptId) return
    setLoading(true)
    fetch(`/api/attempts/${attemptId}/next-question`)
      .then(res => res.json())
      .then(data => {
        if (data.done) {
          setDone(true)
          setQuestion(null)
        } else {
          setQuestion(data)
        }
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to fetch question')
        setLoading(false)
      })
  }, [attemptId])

  // 3. Handle answer submission
  const handleAnswer = async (optionId) => {
    setLoading(true)
    await fetch(`/api/attempts/${attemptId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: question.id,
        selectedOptionId: optionId,
      }),
    })
    // Fetch next question
    fetch(`/api/attempts/${attemptId}/next-question`)
      .then(res => res.json())
      .then(data => {
        if (data.done) {
          setDone(true)
          setQuestion(null)
        } else {
          setQuestion(data)
        }
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to fetch next question')
        setLoading(false)
      })
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (done) return <div>Quiz complete! 🎉</div>
  if (!question) return <div>Waiting for question...</div>

  return (
    <div>
      <h2>{question.text}</h2>
      <ul>
        {question.answerOptions.map(opt => (
          <li key={opt.id}>
            <button onClick={() => handleAnswer(opt.id)}>
              {opt.optionText}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}