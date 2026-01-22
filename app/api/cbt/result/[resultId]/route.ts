import { resultService } from "@/features/result/services/result.service";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ resultId: string }> }) {
  try {
    const { resultId } = await params;
    const result = await resultService.getResultById(resultId);

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    return NextResponse.json({
      // score: result.score, // Hidden for student
      // correctAnswers: result.correctAnswers, // Hidden for student
      totalQuestions: result.totalQuestions,
      timeSpent: result.timeSpent,
      studentName: result.studentName,
      status: result.status,
      test: {
        title: result.test?.title || "Tes",
        description: result.test?.description || "",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
