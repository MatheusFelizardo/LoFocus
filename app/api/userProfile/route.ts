import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const profile = user.profile;
  return NextResponse.json(profile, { status: 200 });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  try {
    const body = await req.json();
    const {
      defaultPomodoro,
      defaultShortBreak,
      defaultLongBreak,
      longBreakInterval,
      defaultAlarmSound,
    } = body;

    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        defaultPomodoro,
        defaultShortBreak,
        defaultLongBreak,
        longBreakInterval,
        defaultAlarmSound,
      },
      create: {
        userId: user.id,
        defaultPomodoro,
        defaultShortBreak,
        defaultLongBreak,
        longBreakInterval,
        defaultAlarmSound,
      },
    });
    return NextResponse.json(profile, { status: 200 });
  } catch (err: any) {
    console.error("Error updating profile:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
