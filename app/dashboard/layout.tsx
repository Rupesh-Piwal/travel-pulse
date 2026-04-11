import { DashboardSidebar } from "@/components/dashboard-sidebar";
import Navbar from "../components/navbar/page";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="flex pt-16 md:pt-20">
                <DashboardSidebar />
                <main className="flex-1 ml-64 p-8 min-h-[calc(100vh-5rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
