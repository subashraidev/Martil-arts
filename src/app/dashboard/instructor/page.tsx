import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Calendar, Users, Award, MessageSquare } from "lucide-react";
import InstructorClassManager from "@/components/InstructorClassManager";

export const revalidate = 0;

export default async function InstructorDashboardPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "INSTRUCTOR") {
    redirect("/login");
  }

  // Load instructor classes
  const classes = await prisma.class.findMany({
    where: { instructorId: session.userId },
    include: { program: true },
    orderBy: { startTime: "asc" },
  });

  // Get recent announcements posted by this instructor or admins
  const announcements = await prisma.announcement.findMany({
    where: { OR: [{ target: "all" }, { target: "instructors" }] },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-martial-red uppercase tracking-wider">Instructor Portal</span>
          <h1 className="text-2xl font-black text-primary-navy font-display mt-0.5">Welcome, Coach!</h1>
          <p className="text-xs text-slate-500">Manage today's attendance, review curriculum requirements, and broadcast class announcements.</p>
        </div>
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
          📅 Weekly Roster System Active
        </span>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Class Manager */}
        <div className="lg:col-span-8 space-y-6">
          <InstructorClassManager initialClasses={classes} />
        </div>

        {/* Right: Announcements */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-primary-navy text-sm font-display flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-martial-red" /> Staff Announcements
            </h3>
            <div className="space-y-4">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div key={ann.id} className="border-b border-slate-50 pb-4 last:border-b-0 last:pb-0 space-y-1">
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-xs">{ann.title}</h4>
                      <span className="text-[9px] text-slate-400 font-semibold">{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{ann.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No announcements logged.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
