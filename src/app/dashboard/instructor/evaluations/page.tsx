import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import InstructorEvaluator from "@/components/InstructorEvaluator";

export const revalidate = 0;

export default async function InstructorEvaluationsPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "INSTRUCTOR") {
    redirect("/login");
  }

  // Load students and their belt progression histories
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      profile: {
        include: {
          beltProgressions: {
            orderBy: { id: "desc" },
          },
        },
      },
    },
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-black text-primary-navy font-display">Student Belt Evaluations</h1>
        <p className="text-slate-500 text-xs mt-0.5">Evaluate student stances, kicks, forms, and sparring performance to approve rank promotions.</p>
      </div>

      <InstructorEvaluator students={students} />
    </div>
  );
}
