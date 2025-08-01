import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// CREATE one or more answer options
export async function POST(request, { params }) {
  // 1) extract & normalize questionId from URL
  const rawQuestionId = await params.questionId
  if (typeof rawQuestionId !== 'string' || !rawQuestionId.trim()) {
    return NextResponse.json(
      { error: 'Missing or invalid questionId in route parameters' },
      { status: 400 }
    )
  }
  const questionId = rawQuestionId.trim()

  // 2) parse JSON body
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 3) normalize into an array for single‐or‐bulk insert
  const options = Array.isArray(body) ? body : [body]

  // 4) validate each option
  for (const [i, opt] of options.entries()) {
    if (typeof opt.optionText !== 'string' || !opt.optionText.trim()) {
      return NextResponse.json(
        { error: `optionText must be a non-empty string (error at index ${i})` },
        { status: 400 }
      )
    }
    if (opt.sequence !== undefined && typeof opt.sequence !== 'number') {
      return NextResponse.json(
        { error: `sequence must be a number (error at index ${i})` },
        { status: 400 }
      )
    }
    if (opt.isCorrect !== undefined && typeof opt.isCorrect !== 'boolean') {
      return NextResponse.json(
        { error: `isCorrect must be boolean (error at index ${i})` },
        { status: 400 }
      )
    }
  }

  try {
    if (options.length === 1) {
      // single insert
      const { optionText, sequence = 0, isCorrect = false } = options[0]
      const newOpt = await prisma.answerOption.create({
        data: { questionId, optionText: optionText.trim(), sequence, isCorrect }
      })
      return NextResponse.json(newOpt, { status: 201 })

    } else {
      // bulk insert
      const data = options.map(opt => ({
        questionId,
        optionText: opt.optionText.trim(),
        sequence: opt.sequence ?? 0,
        isCorrect: opt.isCorrect ?? false
      }))
      const { count } = await prisma.answerOption.createMany({ data })
      return NextResponse.json({ inserted: count }, { status: 201 })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: `Failed to create answer option(s): ${err.message}` },
      { status: 500 }
    )
  }
}

// BULK UPDATE answer options
export async function PUT(request, { params }) {
  const rawQuestionId = await params.questionId
  if (typeof rawQuestionId !== 'string' || !rawQuestionId.trim()) {
    return NextResponse.json(
      { error: 'Missing or invalid questionId in route parameters' },
      { status: 400 }
    )
  }
  const questionId = rawQuestionId.trim()

  let options
  try {
    options = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!Array.isArray(options)) {
    return NextResponse.json(
      { error: 'Request body must be an array of option objects' },
      { status: 400 }
    )
  }

  try {
    // Only update options that belong to this question
    const updateTx = options.map(opt =>
      prisma.answerOption.updateMany({
        where: { id: opt.id, questionId },
        data: {
          optionText: typeof opt.optionText === 'string' ? opt.optionText.trim() : undefined,
          sequence: typeof opt.sequence === 'number' ? opt.sequence : undefined,
          isCorrect: typeof opt.isCorrect === 'boolean' ? opt.isCorrect : undefined
        }
      })
    )
    const results = await prisma.$transaction(updateTx)
    return NextResponse.json(results)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: `Failed to update answer options: ${err.message}` },
      { status: 500 }
    )
  }
}
