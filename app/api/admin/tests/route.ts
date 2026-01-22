import { testService } from "@/features/test/services/test.service";
import { NextResponse } from "next/server";
// import { auth } from "@/shared/lib/auth"; // Need server-side auth check
// For now omitting auth check layer to focus on logic implementation, 
// usually we wrapp this with `await auth.api.getSession({ headers: req.headers })`

export async function GET() {
  try {
    const tests = await testService.getAllTests(true); // includeInactive = true for admin
    return NextResponse.json(tests);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const test = await testService.createTest(body);
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
