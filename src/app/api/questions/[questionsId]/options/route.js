import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// CREATE a new answer option
export async function POST(request, { params }) {
  const { questionId } = params;
  const { optionText, sequence, isCorrect } = await request.json();

  if (!optionText) {
    return NextResponse.json(
      { error: 'optionText is required' },
      { status: 400 }
    );
  }

  try {
    const newOption = await prisma.answerOption.create({
      data: {
        optionText,
        sequence: sequence || 0,
        isCorrect: isCorrect || false,
        questionId
      }
    });

    return NextResponse.json(newOption, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create answer option: ${error.message}` },
      { status: 500 }
    );
  }
}

// BULK UPDATE answer options
export async function PUT(request, { params }) {
  const { questionId } = params;
  const options = await request.json();

  if (!Array.isArray(options)) {
    return NextResponse.json(
      { error: 'Request body must be an array of options' },
      { status: 400 }
    );
  }

  try {
    const updateResults = await prisma.$transaction(
      options.map(option => 
        prisma.answerOption.update({
          where: { id: option.id },
          data: {
            optionText: option.optionText,
            sequence: option.sequence,
            isCorrect: option.isCorrect
          }
        })
      )
    );

    return NextResponse.json(updateResults);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update options: ${error.message}` },
      { status: 500 }
    );
  }
}