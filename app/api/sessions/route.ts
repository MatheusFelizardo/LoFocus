import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { ApiErrors, getAuthenticatedUser } from "@/app/lib/utils";

export async function POST(req: Request) {
  const session = await auth();
  const user = await getAuthenticatedUser(session);

  if (!user) {
    return ApiErrors.unauthorized();
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
    return ApiErrors.internalError("Failed to create session");
  }
}

export async function GET() {
  const session = await auth();
  const user = await getAuthenticatedUser(session);

  if (!user) {
    return ApiErrors.unauthorized();
  }

  const userWithSessions = await prisma.user.findUnique({
    where: { id: user.id },
    include: { pomodoros: true },
  });

  return NextResponse.json(userWithSessions?.pomodoros || []);
}

export async function PUT(req: Request) {
  const session = await auth();
  const user = await getAuthenticatedUser(session);

  if (!user) {
    return ApiErrors.unauthorized();
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
    return ApiErrors.internalError("Failed to update session");
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  const user = await getAuthenticatedUser(session);

  if (!user) {
    return ApiErrors.unauthorized();
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
    return ApiErrors.internalError("Failed to delete session");
  }
}
