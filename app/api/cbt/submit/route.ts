import { resultService } from "@/features/result/services/result.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resultId, questionId, selectedAnswer } = body;

    if (!resultId || !questionId || !selectedAnswer) {
      return NextResponse.json(
        { error: "Validation Error: Missing required fields" },
        { status: 400 }
      );
    }
    
    // TODO: Verify session validity / time integrity here if needed
    // For now we trust the client logic, but in prod we should check result status needed

    const updatedAnswer = await resultService.submitAnswer(resultId, questionId, selectedAnswer);
    return NextResponse.json(updatedAnswer);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
