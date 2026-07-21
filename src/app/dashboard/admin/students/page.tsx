import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminStudentManager from "@/components/AdminStudentManager";

export const revalidate = 0;

export default async function AdminStudentsPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all programs for assignment dropdowns
  const programs = await prisma.program.findMany();

  // Fetch all student users and profiles
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      profile: {
        include: {
          enrollments: { include: { program: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-primary-navy font-display">Student Directory</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Manage student details, parent billing options, and class enrollments.</p>
        </div>
      </div>

      <AdminStudentManager initialStudents={students} programs={programs} />
    </div>
  );
}
