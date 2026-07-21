"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Award, 
  CreditCard, 
  Globe, 
  Calendar, 
  CheckSquare, 
  MessageSquare,
  FileText,
  UserCheck
} from "lucide-react";

interface SidebarNavProps {
  role: string;
}

export default function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();

  const getLinks = () => {
    if (role === "ADMIN") {
      return [
        { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Students", href: "/dashboard/admin/students", icon: Users },
        { name: "Instructors", href: "/dashboard/admin/instructors", icon: UserCheck },
        { name: "Class Manager", href: "/dashboard/admin/classes", icon: Calendar },
        { name: "Belt Testing", href: "/dashboard/admin/belts", icon: Award },
        { name: "Payments Ledger", href: "/dashboard/admin/payments", icon: CreditCard },
        { name: "Website CMS", href: "/dashboard/admin/cms", icon: Globe },
      ];
    }
    
    if (role === "INSTRUCTOR") {
      return [
        { name: "Classes & Attendance", href: "/dashboard/instructor", icon: Calendar },
        { name: "Belt Evaluations", href: "/dashboard/instructor/evaluations", icon: Award },
        { name: "Announcements", href: "/dashboard/instructor/announcements", icon: MessageSquare },
      ];
    }
    
    // STUDENT
    return [
      { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
      { name: "Attendance Log", href: "/dashboard/student/attendance", icon: CheckSquare },
      { name: "Belt Curriculum", href: "/dashboard/student/curriculum", icon: Award },
      { name: "Payments & Invoices", href: "/dashboard/student/billing", icon: CreditCard },
    ];
  };

  const links = getLinks();

  return (
    <nav className="space-y-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Navigation</p>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? "bg-slate-900 text-accent-gold shadow-md"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon className={`h-4.5 w-4.5 ${isActive ? "text-accent-gold" : "text-slate-400"}`} />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
