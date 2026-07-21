import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminPaymentManager from "@/components/AdminPaymentManager";

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const payments = await prisma.payment.findMany({
    include: {
      user: { include: { profile: true } },
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-black text-primary-navy font-display">Payments & Financial Ledger</h1>
        <p className="text-slate-500 text-xs mt-0.5 font-medium">Record cash/check tuitions, review Stripe transaction reports, and track academy billing history.</p>
      </div>
      <AdminPaymentManager initialPayments={payments} />
    </div>
  );
}
