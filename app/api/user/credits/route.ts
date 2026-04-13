import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user actually exists in the DB (prevents foreign key errors after DB reset)
  const userExists = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!userExists) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 401 });
  }

  // 🔥 SELF-HEALING FIX: Use a transaction to ensure atomic creation
  const credit = await prisma.$transaction(async (tx) => {
    let record = await tx.credit.findUnique({
      where: { userId: session.user.id },
    });

    if (!record) {
      console.log("Auto-creating missing credit for user:", session.user.id);
      
      record = await tx.credit.create({
        data: {
          userId: session.user.id,
          balance: 5,
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: session.user.id,
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
