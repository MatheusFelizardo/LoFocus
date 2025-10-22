import { NextResponse } from "next/server";
import type { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/db";

/**
 * Standard API error responses
 */
export const ApiErrors = {
  unauthorized: () =>
    NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  userNotFound: () =>
    NextResponse.json({ error: "User not found" }, { status: 404 }),
  notFound: (resource: string) =>
    NextResponse.json({ error: `${resource} not found` }, { status: 404 }),
  badRequest: (message: string) =>
    NextResponse.json({ error: message }, { status: 400 }),
  conflict: (message: string) =>
    NextResponse.json({ error: message }, { status: 409 }),
  internalError: (message = "Internal Server Error") =>
    NextResponse.json({ error: message }, { status: 500 }),
};

/**
 * Gets authenticated user from database
 * @param session - Auth session from next-auth
 * @returns User object or null if not found
 */
export async function getAuthenticatedUser(
  session: Awaited<ReturnType<typeof auth>>,
) {
  if (!session?.user?.email) {
    return null;
  }

  return await prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

/**
 * Validates required fields in request body
 * @param body - Request body object
 * @param requiredFields - Array of required field names
 * @returns Error message if validation fails, null otherwise
 */
export function validateRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[],
): string | null {
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === null || body[field] === undefined) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}
