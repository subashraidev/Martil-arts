import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Award, Calendar, CheckSquare, ShieldCheck, DollarSign, Download, Bell, PlayCircle, BookOpen } from "lucide-react";
import QRCheckInWidget from "@/components/QRCheckInWidget";

export const revalidate = 0;

export default async function StudentDashboardPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  // Load student profile, attendance, payments, and belt history
  const student = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: {
        include: {
          attendance: { include: { class: true }, orderBy: { date: "desc" } },
          beltProgressions: { orderBy: { id: "asc" } },
          enrollments: { include: { program: true } },
        },
      },
      payments: { orderBy: { date: "desc" }, take: 5 },
    },
  });

  if (!student || !student.profile) {
    return <div className="text-center py-10">Profile loading error</div>;
  }

  const profile = student.profile;

  // 1. Calculate Attendance metrics
  const totalClasses = profile.attendance.length;
  const presentClasses = profile.attendance.filter(a => a.status === "Present").length;
  const lateClasses = profile.attendance.filter(a => a.status === "Late").length;
  const attendanceRate = totalClasses > 0 
    ? Math.round(((presentClasses + lateClasses) / totalClasses) * 100)
    : 100;

  // 2. Resolve Active Belt Progress
  const activeBeltProgress = profile.beltProgressions.find(bp => bp.status === "In Progress") || 
                             profile.beltProgressions[profile.beltProgressions.length - 1];

  // Resolve curriculum skills checked count
  let skillsCheckedList: string[] = [];
  try {
    if (activeBeltProgress?.skillsChecked) {
      skillsCheckedList = JSON.parse(activeBeltProgress.skillsChecked);
    }
  } catch (e) {}

  // 3. Fetch announcements for students
  const announcements = await prisma.announcement.findMany({
    where: { target: { in: ["all", "students"] } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  // 4. Resolve student active programs and classes
  const enrolProgram = profile.enrollments[0]?.program;
  const todayClasses = enrolProgram
    ? await prisma.class.findMany({ where: { programId: enrolProgram.id } })
    : [];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold text-martial-red uppercase tracking-wider">Welcome Back</span>
          <h1 className="text-2xl font-black text-primary-navy font-display mt-0.5">
            Hello, {profile.firstName}!
          </h1>
          <p className="text-xs text-slate-500">Track your training progress, log attendance, and review belt curriculum.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Current Rank</span>
            <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-md mt-1 inline-block">
              🥋 {profile.currentBelt}
            </span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Belt progress */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-martial-red" /> Rank Progress
            </h3>
            <span className="text-xs font-black text-primary-navy">{profile.beltProgressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-martial-red to-accent-gold h-full rounded-full transition-all duration-300"
              style={{ width: `${profile.beltProgressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold pt-1">
            <span>{profile.currentBelt}</span>
            <span>Next: {activeBeltProgress?.beltColor || "Black Belt"}</span>
          </div>
        </div>

        {/* Attendance rate */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <CheckSquare className="h-4.5 w-4.5 text-martial-red" /> Attendance Rate
            </h3>
            <span className="text-xs font-black text-primary-navy">{attendanceRate}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary-navy h-full rounded-full transition-all duration-300"
              style={{ width: `${attendanceRate}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold pt-1">
            <span>{totalClasses} Classes Logged</span>
            <span>Rate Required: 80%</span>
          </div>
        </div>

        {/* Membership Status */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <DollarSign className="h-4.5 w-4.5 text-martial-red" /> Membership Status
            </h3>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">
              {profile.membershipStatus}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-700">Billing Plan: <span className="font-medium text-slate-500">{profile.membershipType}</span></p>
          <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold pt-1">
            <span>Tuition Status: Current</span>
            <span>Monthly Cycle</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Curriculum, Right side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Active Curriculum Progress */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-primary-navy text-base font-display">Active Belt Curriculum Requirements</h3>
                <p className="text-slate-500 text-[10px]">Marked by instructors during class evaluations</p>
              </div>
              <span className="text-xs font-black text-slate-800 bg-slate-50 border border-slate-150 px-3 py-1 rounded-full uppercase tracking-wider">
                🥋 {activeBeltProgress?.beltColor || "White"}
              </span>
            </div>

            {activeBeltProgress ? (
              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-martial-red" /> Form (Poomsae)
                  </h4>
                  <p className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 p-3 rounded-lg">
                    {activeBeltProgress.poomsaeForm}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="h-4 w-4 text-martial-red" /> Mandatory Skills Evaluation
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      "Basic stances (Kibon Junbi)",
                      "Rank-specific kicks",
                      "Standard blocks fluency",
                      "Poomsae form memorization",
                      "Self-Defense combinations",
                      "Board breaking verification",
                    ].map((skill, idx) => {
                      // Simulate checks
                      const isChecked = idx < skillsCheckedList.length || skillsCheckedList.includes(skill);
                      return (
                        <div key={skill} className="flex items-center gap-2.5 bg-slate-50/50 border border-slate-100/80 p-3 rounded-xl">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="h-4.5 w-4.5 text-martial-red rounded border-slate-300 focus:ring-0 cursor-not-allowed"
                          />
                          <span className={`text-xs ${isChecked ? "text-slate-500 line-through" : "text-slate-700 font-semibold"}`}>
                            {skill}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {activeBeltProgress.instructorNotes && (
                  <div className="bg-red-50/30 border border-red-100/50 p-4 rounded-xl space-y-1">
                    <p className="text-[10px] font-black text-martial-red uppercase tracking-wider">Instructor Notes</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{activeBeltProgress.instructorNotes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No active promotion curriculum logged.</p>
            )}
          </div>

          {/* Announcements */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-primary-navy text-base font-display flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-martial-red" /> Academy Announcements
            </h3>
            <div className="space-y-4">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div key={ann.id} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 space-y-1.5">
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{ann.title}</h4>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{ann.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No current announcements.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: QR Widget & Billing Invoice Ledger */}
        <div className="lg:col-span-4 space-y-6">
          {/* QR Check in simulator widget */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-bold text-sm">QR Class Attendance Check-in</h3>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Scan the Dojang front desk QR code or click below to simulate self check-in for today's training session.
            </p>
            <QRCheckInWidget classes={todayClasses} />
          </div>

          {/* Payments Invoices block */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
              <span>Recent Payments</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">LEDGER</span>
            </h3>
            <div className="space-y-3.5">
              {student.payments.map((p) => (
                <div key={p.id} className="flex justify-between items-center text-xs border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-700 truncate">{p.description}</p>
                    <span className="text-[10px] text-slate-400">{p.date} • {p.method}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-700">${p.amount}</p>
                    <a
                      href={`/invoices/download?id=${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] font-bold text-martial-red hover:underline flex items-center justify-end gap-0.5 mt-0.5"
                    >
                      <Download className="h-2.5 w-2.5" /> PDF Invoice
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
