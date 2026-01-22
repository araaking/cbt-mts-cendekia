import { questionService } from "@/features/question/services/question.service";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const { questionId } = await params;
    const question = await questionService.getQuestionById(questionId);
    if (!question) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const { questionId } = await params;
    const body = await req.json();
    const question = await questionService.updateQuestion(questionId, body);
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const { questionId } = await params;
    await questionService.deleteQuestion(questionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
