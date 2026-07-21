"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Successful login. Redirect based on user role
      const role = data.user.role;
      if (role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (role === "INSTRUCTOR") {
        router.push("/dashboard/instructor");
      } else {
        router.push("/dashboard/student");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
      setLoading(false);
    }
  };

  // Helper function to auto login using demo accounts
  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    // Submit login programmatically or let user click it.
    // Let's programmatically execute the request
    setLoading(true);
    setError("");
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: demoEmail, password: demoPass }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((d) => {
            throw new Error(d.error || "Failed");
          });
        }
        return res.json();
      })
      .then((data) => {
        const role = data.user.role;
        if (role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (role === "INSTRUCTOR") {
          router.push("/dashboard/instructor");
        } else {
          router.push("/dashboard/student");
        }
        router.refresh();
      })
      .catch((err) => {
        setError(err.message || "Demo login failed.");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-primary-navy flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative overlays */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#dc2626_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-martial-red/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full space-y-8 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
        <div>
          <h2 className="text-center text-3xl font-black font-display text-white tracking-tight">
            🥋 MARTIAL ARTS <span className="text-martial-red">TKD</span>
          </h2>
          <p className="mt-2 text-center text-xs text-slate-400">
            Sign in to access your academy management dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-950/40 border border-rose-900 text-rose-300 p-4 rounded-xl text-xs font-semibold flex items-start gap-2">
              <ShieldAlert className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="email@tkd.com"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-martial-red transition-all disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-martial-red transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-martial-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-martial-red transition-all cursor-pointer disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Sign In →"}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 text-xs">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            ← Return to Homepage
          </Link>
        </div>

        {/* Demo Accounts Panel */}
        <div className="border-t border-slate-800/80 pt-6 space-y-3.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-accent-gold" /> Quick Access Demo Accounts
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin("admin@tkd.com", "admin123")}
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-700/80 text-white text-[10px] font-bold py-2.5 px-1.5 rounded-lg border border-slate-700/60 transition-colors text-center cursor-pointer"
            >
              👑 Admin
            </button>
            <button
              onClick={() => handleDemoLogin("jihoon@tkd.com", "instructor123")}
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-700/80 text-white text-[10px] font-bold py-2.5 px-1.5 rounded-lg border border-slate-700/60 transition-colors text-center cursor-pointer"
            >
              👨‍🏫 Instructor
            </button>
            <button
              onClick={() => handleDemoLogin("alex@tkd.com", "student123")}
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-700/80 text-white text-[10px] font-bold py-2.5 px-1.5 rounded-lg border border-slate-700/60 transition-colors text-center cursor-pointer"
            >
              🥋 Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
