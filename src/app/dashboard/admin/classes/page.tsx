import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminClassManager from "@/components/AdminClassManager";

export const revalidate = 0;

export default async function AdminClassesPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const classes = await prisma.class.findMany({
    include: {
      program: true,
      instructor: { include: { profile: true } },
    },
    orderBy: [
      { dayOfWeek: "asc" },
      { startTime: "asc" },
    ],
  });

  const programs = await prisma.program.findMany();
  const instructors = await prisma.user.findMany({
    where: { role: { in: ["INSTRUCTOR", "ADMIN"] } },
    include: { profile: true },
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-black text-primary-navy font-display">Class Scheduler</h1>
        <p className="text-slate-500 text-xs mt-0.5 font-medium">Schedule weekly classes, define capacity limits, and assign certified instructors.</p>
      </div>
      <AdminClassManager 
        initialClasses={classes} 
        programs={programs} 
        instructors={instructors} 
      />
    </div>
  );
}
