import { Link, useLocation } from "wouter";
import { Home, Search, PlusCircle, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  role?: "worker" | "client";
}

export default function Layout({ children, role = "worker" }: LayoutProps) {
  const [location] = useLocation();

  // Simple check to hide nav on landing/auth pages
  const hideNav = location === "/" || location === "/auth" || location === "/landing";

  return (
    <div className="min-h-screen bg-background font-sans pb-20 md:pb-0">
      {/* Desktop Top Navigation (Hidden on Mobile) */}
      {!hideNav && (
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-border sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-display text-xl">
              Q
            </div>
            <span className="text-xl font-bold font-display tracking-tight">QuickTask</span>
          </div>
          
          <nav className="flex items-center gap-8">
            <Link href={role === "worker" ? "/dashboard" : "/client-dashboard"} className={cn("text-sm font-medium hover:text-primary transition-colors", location.includes("dashboard") ? "text-primary" : "text-muted-foreground")}>
              Dashboard
            </Link>
            <Link href="/messages" className={cn("text-sm font-medium hover:text-primary transition-colors", location === "/messages" ? "text-primary" : "text-muted-foreground")}>
              Messages
            </Link>
            <Link href="/profile" className={cn("text-sm font-medium hover:text-primary transition-colors", location === "/profile" ? "text-primary" : "text-muted-foreground")}>
              Profile
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {role === "client" && (
              <Link href="/create-mission">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-colors">
                  Post Mission
                </button>
              </Link>
            )}
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              <img src="/attached_assets/generated_images/young_smiling_user_avatar_1.png" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {!hideNav && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border px-6 py-3 z-50 pb-safe">
          <nav className="flex items-center justify-between">
            <Link href={role === "worker" ? "/dashboard" : "/client-dashboard"}>
              <div className={cn("flex flex-col items-center gap-1", location.includes("dashboard") ? "text-primary" : "text-muted-foreground")}>
                <Home size={24} strokeWidth={location.includes("dashboard") ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Home</span>
              </div>
            </Link>
            
            <Link href="/search">
              <div className={cn("flex flex-col items-center gap-1", location === "/search" ? "text-primary" : "text-muted-foreground")}>
                <Search size={24} strokeWidth={location === "/search" ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Search</span>
              </div>
            </Link>

            {role === "client" ? (
              <Link href="/create-mission">
                <div className="flex flex-col items-center gap-1 -mt-6">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 text-white">
                    <PlusCircle size={28} />
                  </div>
                  <span className="text-[10px] font-medium text-primary">Post</span>
                </div>
              </Link>
            ) : (
              <div className="w-12" /> /* Spacer for symmetry if needed, or just regular item */
            )}

            <Link href="/messages">
              <div className={cn("flex flex-col items-center gap-1", location === "/messages" ? "text-primary" : "text-muted-foreground")}>
                <MessageSquare size={24} strokeWidth={location === "/messages" ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Chat</span>
              </div>
            </Link>

            <Link href="/profile">
              <div className={cn("flex flex-col items-center gap-1", location === "/profile" ? "text-primary" : "text-muted-foreground")}>
                <User size={24} strokeWidth={location === "/profile" ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Profile</span>
              </div>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
