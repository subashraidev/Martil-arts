import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminBeltManager from "@/components/AdminBeltManager";

export const revalidate = 0;

export default async function AdminBeltsPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  // Load evaluations that are Pending Approval or In Progress
  const evaluations = await prisma.beltProgress.findMany({
    where: { status: { in: ["Pending Approval", "In Progress"] } },
    include: { profile: true },
    orderBy: { id: "desc" },
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-black text-primary-navy font-display">Belt Promotions Manager</h1>
        <p className="text-slate-500 text-xs mt-0.5 font-medium">Review testing evaluations, confirm rank requirements, and award graduation certificates.</p>
      </div>
      <AdminBeltManager initialEvaluations={evaluations} />
    </div>
  );
}
