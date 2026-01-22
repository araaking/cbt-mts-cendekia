import { questionService } from "@/features/question/services/question.service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const testId = searchParams.get("testId");

    if (!testId) {
       return NextResponse.json({ error: "Missing testId" }, { status: 400 });
    }

    const questions = await questionService.getQuestionsByTestId(testId);
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = await questionService.createQuestion(body);
    return NextResponse.json(question);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
