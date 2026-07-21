import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreditCard, DollarSign, Download, Clock } from "lucide-react";

export const revalidate = 0;

export default async function StudentBillingPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  const student = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
      payments: { orderBy: { date: "desc" } },
    },
  });

  if (!student || !student.profile) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      {/* Membership Plan Info Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Membership Type</span>
          <h2 className="text-xl font-black text-primary-navy font-display">{student.profile.membershipType} Plan</h2>
          <p className="text-xs text-slate-500">Auto-renews on monthly cycles.</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" /> Account Status
          </span>
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-black uppercase rounded-md">
            {student.profile.membershipStatus}
          </span>
        </div>
        <div className="space-y-1 md:text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Standard Rate</span>
          <p className="text-2xl font-black text-slate-800">$150.00<span className="text-xs font-medium text-slate-400">/mo</span></p>
        </div>
      </div>

      {/* Invoice list */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-black text-primary-navy text-base font-display">Tuition Invoice Ledger</h3>
          <p className="text-slate-500 text-xs mt-0.5">Download receipts or review logged payments.</p>
        </div>

        {student.payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Date Paid</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {student.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{p.invoiceNumber}</td>
                    <td className="py-3.5 px-4">{p.description}</td>
                    <td className="py-3.5 px-4">{p.date}</td>
                    <td className="py-3.5 px-4">{p.method}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">${p.amount.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`/invoices/download?id=${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-black text-martial-red hover:underline uppercase"
                      >
                        <Download className="h-3 w-3" /> PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-2">
            <CreditCard className="h-8 w-8 text-slate-350" />
            <p className="text-xs">No invoices generated yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
