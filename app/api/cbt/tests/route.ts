import { testService } from "@/features/test/services/test.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tests = await testService.getAvailableTests();
    return NextResponse.json(tests);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
