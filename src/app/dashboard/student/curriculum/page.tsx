import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Award, Download, CheckCircle, ShieldAlert, Star } from "lucide-react";

export const revalidate = 0;

export default async function StudentCurriculumPage() {
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

  const progressions = await prisma.beltProgress.findMany({
    where: { profileId: profile.id },
    orderBy: { id: "asc" },
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-black text-primary-navy font-display">My Belt Rank Promotions</h1>
        <p className="text-slate-500 text-xs mt-0.5">Track your past promotions, active syllabus requirements, and download digital certificates.</p>
      </div>

      <div className="space-y-6">
        {progressions.map((prog) => {
          let checkedSkills: string[] = [];
          try {
            if (prog.skillsChecked) {
              checkedSkills = JSON.parse(prog.skillsChecked);
            }
          } catch (e) {}

          const isCompleted = prog.status === "Completed";
          const isPending = prog.status === "Pending Approval";

          return (
            <div
              key={prog.id}
              className={`border rounded-2xl p-6 transition-all ${
                isCompleted
                  ? "bg-slate-50/50 border-slate-200"
                  : isPending
                  ? "bg-amber-50/30 border-amber-200/80 shadow-sm"
                  : "bg-white border-slate-200 shadow-md"
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  {/* Circle indicating belt color */}
                  <span className={`w-8 h-8 rounded-full border border-slate-200 shadow-inner bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-xs`}>
                    🥋
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">{prog.beltColor}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{prog.level} Curriculum</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded text-[10px] font-black uppercase ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : isPending
                        ? "bg-amber-50 text-amber-600 border border-amber-100"
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}
                  >
                    {prog.status}
                  </span>

                  {isCompleted && prog.certificateUrl && (
                    <a
                      href={prog.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-navy hover:bg-slate-900 text-white font-bold p-2 rounded-lg text-xs flex items-center gap-1 transition-colors"
                      title="Download Rank Certificate"
                    >
                      <Download className="h-3.5 w-3.5" /> Certificate
                    </a>
                  )}
                </div>
              </div>

              {/* Requirements summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1.5">Forms & Blocks</h4>
                  <p className="font-bold text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                    Form: {prog.poomsaeForm}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1.5">Evaluation Status</h4>
                  <ul className="space-y-1 text-slate-500">
                    <li>• Sparring: {prog.sparringRating || "TBA"}</li>
                    <li>• Board Breaking: {prog.boardBreakingRating || "TBA"}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instructor Validation</h4>
                  <p className="leading-relaxed italic text-slate-500">
                    {prog.instructorNotes || "Requirements evaluated during standard dojang testing."}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
