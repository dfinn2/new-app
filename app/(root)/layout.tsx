import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#fff9f4] via-[#f9e1cf] to-[#ffffff]">
            <Navbar />
            <div className="flex-grow">
                {children}
            </div>
            <Footer />
        </main>
    )
}