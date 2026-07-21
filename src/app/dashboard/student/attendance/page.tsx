import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CheckSquare, Calendar, ShieldAlert } from "lucide-react";

export const revalidate = 0;

export default async function StudentAttendancePage() {
  const session = await getSessionUser();
  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
  });

  if (!profile) {
    redirect("/login");
  }

  const attendance = await prisma.attendance.findMany({
    where: { profileId: profile.id },
    include: {
      class: { include: { program: true } },
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-black text-primary-navy font-display">My Attendance History</h1>
        <p className="text-slate-500 text-xs mt-0.5">Review your logged check-in records for all class sessions.</p>
      </div>

      {attendance.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Class Session</th>
                <th className="py-3.5 px-4">Program</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {attendance.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/55 transition-colors">
                  <td className="py-3.5 px-4 font-bold">{log.date}</td>
                  <td className="py-3.5 px-4">{log.class.name}</td>
                  <td className="py-3.5 px-4">{log.class.program.name}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                        log.status === "Present"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : log.status === "Late"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-2">
          <CheckSquare className="h-8 w-8 text-slate-350" />
          <p className="text-xs">No attendance classes logged yet.</p>
        </div>
      )}
    </div>
  );
}
