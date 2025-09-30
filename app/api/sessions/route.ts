import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/db";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await req.json();

    const {
      title,
      tagIds,
      focusDuration,
      shortBreak,
      longBreak,
      expectedCycles,
    } = body;

    const pomodoro = await prisma.pomodoroSession.create({
      data: {
        userId: user.id,
        title: title,
        focusDuration,
        shortBreak,
        longBreak,
        expectedCycles,
        tags: tagIds?.length
          ? {
              connect: tagIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: { tags: true },
    });
    return NextResponse.json(pomodoro, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { tags: true, pomodoros: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user.pomodoros);
}

export async function PUT(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await req.json();

    const { sessionId, isCompleted, cycles, tagIds } = body;

    const updated = await prisma.pomodoroSession.update({
      where: { id: sessionId },
      data: {
        isCompleted: isCompleted ?? undefined,
        endTime: isCompleted ? new Date() : undefined,
        cycles: cycles ?? undefined,
        tags: tagIds
          ? {
              set: [],
              connect: tagIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: { tags: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { sessionId } = body;
    await prisma.pomodoroSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
