import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { ApiErrors, getAuthenticatedUser } from "@/app/lib/utils";

export async function GET() {
  const session = await auth();
  const user = await getAuthenticatedUser(session);

  if (!user) {
    return ApiErrors.unauthorized();
  }

  const userWithProfile = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  });

  return NextResponse.json(userWithProfile?.profile, { status: 200 });
}

export async function POST(req: Request) {
  const session = await auth();
  const user = await getAuthenticatedUser(session);

  if (!user) {
    return ApiErrors.unauthorized();
  }

  try {
    const body = await req.json();
    const {
      defaultPomodoro,
      defaultShortBreak,
      defaultLongBreak,
      longBreakInterval,
      defaultAlarmSound,
      selectedTheme,
    } = body;

    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        defaultPomodoro,
        defaultShortBreak,
        defaultLongBreak,
        longBreakInterval,
        defaultAlarmSound,
        selectedTheme,
      },
      create: {
        userId: user.id,
        defaultPomodoro,
        defaultShortBreak,
        defaultLongBreak,
        longBreakInterval,
        defaultAlarmSound,
        selectedTheme,
      },
    });
    return NextResponse.json(profile, { status: 200 });
  } catch (err) {
    console.error("Error updating profile:", err);
    return ApiErrors.internalError();
  }
}
