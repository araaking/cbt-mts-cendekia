import { userService } from "@/features/user/services/user.service";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/shared/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { userId } = await params;
    await userService.deleteUser(userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { userId } = await params;
    const body = await req.json();
    const user = await userService.updateUser(userId, body);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
