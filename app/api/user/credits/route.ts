import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 401 });
  }

  const credit = await prisma.$transaction(async (tx) => {
    let record = await tx.credit.findUnique({
      where: { userId: userId },
    });

    if (!record) {
      console.log("Auto-creating missing credit for user:", userId);

      record = await tx.credit.create({
        data: {
          userId: userId,
          balance: 5,
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: userId,
          amount: 5,
          reason: "SIGNUP",
          referenceId: "auto_created_missing_credit",
        },
      });
    }

    return record;
  });

  return NextResponse.json({
    credits: credit.balance,
  });
}
