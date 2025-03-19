import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await auth();
  
  // If not authenticated, redirect to login
  if (!session) {
    redirect("/");
  }
  
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex">
        <DashboardSidebar />
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
}