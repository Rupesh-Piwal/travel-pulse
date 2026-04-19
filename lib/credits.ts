import { prisma } from "@/lib/prisma";

export async function deductCredits(userId: string, amount: number) {
  // Use a longer timeout for the transaction start and execution
  return await prisma.$transaction(async (tx) => {
    const credit = await tx.credit.findUnique({
      where: { userId },
    });

    if (!credit || credit.balance < amount) {
      throw new Error("Insufficient credits");
    }

    // Perform the update
    await tx.credit.update({
      where: { userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // Log the transaction
    await tx.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        reason: "GENERATION",
      },
    });
  }, {
    timeout: 15000, // 15 seconds
    maxWait: 5000,  // 5 seconds to wait for a connection
  });
}

export async function refundCredits(userId: string, amount: number) {
  // Use a standard transaction array - much lighter on PgBouncer
  return await prisma.$transaction([
    prisma.credit.update({
      where: { userId },
      data: { balance: { increment: amount } },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        amount: amount,
        reason: "REFUND",
      },
    }),
  ]);
}


