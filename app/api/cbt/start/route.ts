import { questionService } from "@/features/question/services/question.service";
import { resultService } from "@/features/result/services/result.service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const resultId = searchParams.get("resultId");

    if (!resultId) {
      return NextResponse.json(
        { error: "Unauthorized: Missing session ID" },
        { status: 401 }
      );
    }

    // Verify session
    const result = await resultService.getResultById(resultId);
    if (!result) {
        return NextResponse.json(
            { error: "Unauthorized: Invalid session" },
            { status: 401 }
        );
    }
    
    if (result.status !== "IN_PROGRESS") {
        return NextResponse.json(
            { error: "Test is already finished" },
            { status: 403 }
        );
    }

    // Get questions for the test
    const questions = await questionService.getQuestionsByTestId(result.testId);

    // Remove correct answers from response!!! Critical for security.
    const sanitizedQuestions = questions.map((q) => {
      const { correctAnswer, ...rest } = q;
      void correctAnswer;
      return rest;
    });

    return NextResponse.json({
        result, // Return session details (like time started)
        questions: sanitizedQuestions
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
