import { prisma } from "@/lib/prisma";

export async function deductCredits(userId: string, amount: number) {
  return await prisma.$transaction(async (tx) => {
    const credit = await tx.credit.findUnique({
      where: { userId },
    });

    if (!credit || credit.balance < amount) {
      throw new Error("Insufficient credits");
    }

    await tx.credit.update({
      where: { userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        reason: "GENERATION",
      },
    });
  });
}

export async function refundCredits(userId: string, amount: number) {
  return await prisma.$transaction(async (tx) => {
    await tx.credit.update({
      where: { userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount: amount,
        reason: "REFUND",
      },
    });
  });
}

