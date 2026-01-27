import { NextRequest, NextResponse } from 'next/server';
import { evaluate, EvaluationContext } from '@lib/rules';

interface EvaluateRequestBody {
  task: 'task1' | 'task2';
  text: string;
  context?: EvaluationContext;
}

export async function POST(request: NextRequest) {
  try {
    const body: EvaluateRequestBody = await request.json();
    
    // Validate required fields
    if (!body.task || !body.text) {
      return NextResponse.json(
        { error: 'Missing required fields: task and text are required' },
        { status: 400 }
      );
    }

    // Validate task type
    if (body.task !== 'task1' && body.task !== 'task2') {
      return NextResponse.json(
        { error: 'Invalid task type. Must be "task1" or "task2"' },
        { status: 400 }
      );
    }

    // Validate text is not empty
    if (typeof body.text !== 'string' || body.text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      );
    }

    // Run evaluation
    const result = evaluate(body.task, body.text, body.context || {});

    return NextResponse.json(result);
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
