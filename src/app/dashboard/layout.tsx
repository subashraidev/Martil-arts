import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SidebarNav from "@/components/SidebarNav";
import { LogOut } from "lucide-react";

export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session) {
    redirect("/login");
  }

  // Double check user exists in DB
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-primary-navy border-r border-slate-900 text-white justify-between h-full py-6 px-4">
          <div className="space-y-6">
            {/* Logo */}
            <div className="px-2">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white">
                  🥋 TKD <span className="text-martial-red">SYSTEM</span>
                </span>
              </Link>
            </div>

            {/* Profile Info */}
            <div className="px-2 py-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
              <div className="w-8.5 h-8.5 rounded-full bg-accent-gold text-slate-900 flex items-center justify-center font-black text-sm">
                {user.profile?.firstName.substring(0, 1)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user.profile?.firstName} {user.profile?.lastName}
                </p>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Nav list */}
            <SidebarNav role={user.role} />
          </div>

          {/* Logout */}
          <div className="px-2">
            <a
              href="/api/auth/logout"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-slate-900 transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between bg-primary-navy text-white px-6 py-4 border-b border-slate-900">
          <Link href="/" className="text-base font-black tracking-tight">
            🥋 TKD <span className="text-martial-red">SYSTEM</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-accent-gold border border-slate-700/60 rounded">
              {user.profile?.firstName} ({user.role})
            </span>
            <a href="/api/auth/logout" className="text-red-400 hover:text-red-300">
              <LogOut className="h-4.5 w-4.5" />
            </a>
          </div>
        </header>

        {/* Dashboard Pages */}
        <main className="flex-grow overflow-y-auto focus:outline-none p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
