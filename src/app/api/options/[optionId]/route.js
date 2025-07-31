import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET an answer option by ID
export async function GET(request, { params }) {
  const { optionId } = params;
  
  try {
    const option = await prisma.answerOption.findUnique({
      where: { id: optionId }
    });

    if (!option) {
      return NextResponse.json(
        { error: 'Answer option not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(option);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch option: ${error.message}` },
      { status: 500 }
    );
  }
}

// UPDATE an answer option
export async function PUT(request, { params }) {
  const { optionId } = params;
  const { optionText, sequence, isCorrect } = await request.json();

  try {
    const updatedOption = await prisma.answerOption.update({
      where: { id: optionId },
      data: {
        optionText,
        sequence,
        isCorrect
      }
    });

    return NextResponse.json(updatedOption);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update option: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE an answer option
export async function DELETE(request, { params }) {
  const { optionId } = params;
  
  try {
    await prisma.answerOption.delete({
      where: { id: optionId }
    });
    
    return NextResponse.json(
      { success: true, message: 'Option deleted' }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete option: ${error.message}` },
      { status: 500 }
    );
  }
}