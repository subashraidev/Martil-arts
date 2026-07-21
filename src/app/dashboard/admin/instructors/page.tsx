import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminInstructorManager from "@/components/AdminInstructorManager";

export const revalidate = 0;

export default async function AdminInstructorsPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    include: { profile: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-black text-primary-navy font-display">Instructor Directory</h1>
        <p className="text-slate-500 text-xs mt-0.5 font-medium">Manage instructor accounts, contact details, and current ranks.</p>
      </div>
      <AdminInstructorManager initialInstructors={instructors} />
    </div>
  );
}
