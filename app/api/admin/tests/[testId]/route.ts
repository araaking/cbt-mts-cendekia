import { testService } from "@/features/test/services/test.service";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ testId: string }> }) {
  try {
    const { testId } = await params;
    const test = await testService.getTestById(testId);
    if (!test) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json(test);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ testId: string }> }) {
  try {
    const { testId } = await params;
    const body = await req.json();
    const test = await testService.updateTest(testId, body);
    return NextResponse.json(test);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ testId: string }> }) {
  try {
    const { testId } = await params;
    const body = await req.json();
    const test = await testService.updateTest(testId, body);
    return NextResponse.json(test);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ testId: string }> }) {
  try {
    const { testId } = await params;
    const body = await req.json();
    const { action } = body;

    if (action === "duplicate") {
      const newTest = await testService.duplicateTest(testId);
      return NextResponse.json(newTest);
    }

    if (action === "resetResults") {
      const test = await testService.resetTestResults(testId);
      return NextResponse.json(test);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ testId: string }> }) {
  try {
    const { testId } = await params;
    await testService.deleteTest(testId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
