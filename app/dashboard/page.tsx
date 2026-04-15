import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { CreditsCard } from "./credits-card";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch credits directly on the server
  const credit = await prisma.credit.findUnique({
    where: { userId: session.user.id },
  });

  // Default to 5 credits if not found (matching the self-healing logic in API)
  const balance = credit?.balance ?? 5;

  return (
    <div className="max-w-5xl space-y-10">
      <DashboardHeader 
        title="Welcome back" 
        subtitle="Your travel command center." 
      />

      <CreditsCard initialCredits={balance} />
    </div>
  );
}