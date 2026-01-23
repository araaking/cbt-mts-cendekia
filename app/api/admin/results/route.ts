import { resultService } from "@/features/result/services/result.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await resultService.getAllResults();
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
