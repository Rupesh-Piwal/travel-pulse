import { DashboardSidebar } from "@/components/dashboard-sidebar";
import Navbar from "../components/navbar/page";
import { auth } from "@/auth";


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar user={session?.user} />
            <div className="flex pt-16 md:pt-20">
                <DashboardSidebar />
                <main className="flex-1 ml-64 p-8 min-h-[calc(100vh-5rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
