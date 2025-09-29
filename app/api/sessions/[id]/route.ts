import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Params = {
  params: { id: string };
};

export async function PUT(req: Request, { params }: Params) {
  console.log("Updating session with ID:", params.id);
  console.log("Request body:", await req.clone().text());

  const session = await getServerSession(authOptions);
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
    const { isCompleted, cycles, tagIds } = body;

    const updated = await prisma.pomodoroSession.update({
      where: { id: params.id },
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

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
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
    await prisma.pomodoroSession.delete({
      where: { id: params.id },
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
