"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";

interface UserSession {
  id: number;
  email: string;
  role: string;
  profile?: {
    firstName: string;
    lastName: string;
    currentBelt: string;
  };
}

export default function LayoutHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error("Auth check failed", err);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const mainLinks = [
    { name: "Programs", href: "/programs" },
    { name: "Schedule", href: "/schedule" },
    { name: "Instructors", href: "/instructors" },
    { name: "Gallery", href: "/gallery" },
  ];

  const moreLinks = [
    { name: "Belt Progression", href: "/belt-progression" },
    { name: "Events", href: "/events" },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const allLinks = [...mainLinks, ...moreLinks];

  const getDashboardUrl = (role: string) => {
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "INSTRUCTOR") return "/dashboard/instructor";
    return "/dashboard/student";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-primary-navy/95 backdrop-blur-md border-b border-slate-800 text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tight text-white flex items-center">
                🥋 MARTIAL ARTS <span className="text-martial-red ml-1.5 font-bold">TKD</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium">
            {mainLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors duration-200 hover:text-accent-gold ${
                    isActive ? "text-accent-gold font-bold" : "text-slate-300"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1.5 transition-colors duration-200 hover:text-accent-gold cursor-pointer text-slate-300 ${
                  moreLinks.some((l) => pathname === l.href) ? "text-accent-gold font-bold" : ""
                }`}
              >
                <span>More</span>
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {moreOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {moreLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMoreOpen(false)}
                        className={`block px-4 py-2.5 text-xs font-bold hover:bg-slate-800 hover:text-accent-gold transition-colors ${
                          isActive
                            ? "text-accent-gold font-black bg-slate-800/40"
                            : "text-slate-300"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Action Buttons & Profile */}
          <div className="hidden lg:flex items-center space-x-6">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-full border border-slate-700 text-sm font-medium transition-all duration-200"
                >
                  <User className="h-4 w-4 text-accent-gold" />
                  <span>
                    {user.profile?.firstName || "Dashboard"} ({user.role})
                  </span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold truncate">{user.email}</p>
                    </div>
                    <Link
                      href={getDashboardUrl(user.role)}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-3 text-sm hover:bg-slate-800 hover:text-accent-gold transition-colors duration-150"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>My Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors duration-150 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/try-free"
                  className="bg-martial-red hover:bg-red-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-red-950/25 transition-all duration-200 animate-pulse-gold text-white"
                >
                  Book Free Trial
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            {user && (
              <Link
                href={getDashboardUrl(user.role)}
                className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full border border-slate-700 text-accent-gold"
                title="Go to Dashboard"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-accent-gold hover:bg-slate-800 focus:outline-none transition-all duration-200"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-primary-navy py-4 px-4 space-y-3">
          <div className="space-y-1">
            {allLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 hover:bg-slate-800 hover:text-white ${
                    isActive ? "text-accent-gold bg-slate-800 font-bold" : "text-slate-300"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <hr className="border-slate-800" />

          <div className="space-y-2 pt-2">
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-slate-400">
                  Logged in as <strong className="text-white">{user.email}</strong>
                </div>
                <Link
                  href={getDashboardUrl(user.role)}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 py-3 rounded-full text-base font-semibold"
                >
                  <LayoutDashboard className="h-5 w-5 text-accent-gold" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-red-950/40 border border-red-900/50 hover:bg-red-900/50 text-red-300 py-3 rounded-full text-base font-semibold"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 py-3 rounded-full text-base font-semibold"
                >
                  Login
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/try-free"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center bg-martial-red hover:bg-red-700 py-3.5 rounded-full text-sm font-bold text-center col-span-2 text-white"
                  >
                    Book Free Trial
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
