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

export async function DELETE(req: Request, { params }: { params: Promise<{ testId: string }> }) {
  try {
    const { testId } = await params;
    await testService.deleteTest(testId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
