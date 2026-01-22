import { resultService } from "@/features/result/services/result.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resultId } = body;

    if (!resultId) {
      return NextResponse.json(
        { error: "Validation Error: Missing resultId" },
        { status: 400 }
      );
    }

    const finishedResult = await resultService.finishTest(resultId);
    return NextResponse.json(finishedResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
