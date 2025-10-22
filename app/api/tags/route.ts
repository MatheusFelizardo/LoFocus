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

    if (!body.name || typeof body.name !== "string") {
      return ApiErrors.badRequest("Tag name is required");
    }

    const tag = await prisma.tag.create({
      data: {
        name: body.name.trim(),
        userId: user.id,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      return ApiErrors.conflict("Tag already exists");
    }

    console.error("Error creating tag:", err);
    return ApiErrors.internalError();
  }
}

export async function GET() {
  const session = await auth();
  const user = await getAuthenticatedUser(session);

  if (!user) {
    return ApiErrors.unauthorized();
  }

  const userWithTags = await prisma.user.findUnique({
    where: { id: user.id },
    include: { tags: true },
  });

  return NextResponse.json(userWithTags?.tags || []);
}
