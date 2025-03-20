import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the Supabase client
  const supabase = await createClient();
  
  // Check if user is authenticated using Supabase directly
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // If not authenticated, redirect to login
  if (!user || error) {
    console.log("Dashboard access denied - redirecting to login");
    redirect("/login");
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