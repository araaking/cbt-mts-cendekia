import { resultService } from "@/features/result/services/result.service";
import { testService } from "@/features/test/services/test.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { testId, studentData } = body;

    if (!testId || !studentData || !studentData.name) {
      return NextResponse.json(
        { error: "Validation Error: Test ID and Name are required" },
        { status: 400 }
      );
    }

    // Verify test is valid and active
    const test = await testService.getTestById(testId);
    if (!test || !test.isActive) {
       return NextResponse.json(
        { error: "Test is not available" },
        { status: 404 }
      );
    }

    const result = await resultService.startTest(testId, studentData);
    
    // Return result ID which acts as the session token
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
