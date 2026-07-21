"use client";

import { useState } from "react";
import { PlusCircle, Search, CreditCard, DollarSign, X, Check } from "lucide-react";

interface Profile {
  firstName: string;
  lastName: string;
}

interface UserItem {
  email: string;
  profile: Profile | null;
}

interface PaymentItem {
  id: number;
  amount: number;
  date: string;
  method: string;
  status: string;
  invoiceNumber: string;
  description: string;
  user: UserItem;
}

interface AdminPaymentManagerProps {
  initialPayments: PaymentItem[];
}

export default function AdminPaymentManager({ initialPayments }: AdminPaymentManagerProps) {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [newPayment, setNewPayment] = useState({
    email: "",
    amount: "150.00",
    method: "Cash",
    description: "Monthly Tuition Fee",
  });

  const filteredPayments = payments.filter((p) => {
    const studentName = p.user.profile 
      ? `${p.user.profile.firstName} ${p.user.profile.lastName}`.toLowerCase()
      : "";
    
    const emailMatch = p.user.email.toLowerCase().includes(search.toLowerCase());
    const nameMatch = studentName.includes(search.toLowerCase());
    const invoiceMatch = p.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    
    const methodMatch = methodFilter === "" || p.method === methodFilter;

    return (emailMatch || nameMatch || invoiceMatch) && methodMatch;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPayment),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log payment");
      }

      setSuccessMsg("Payment logged successfully!");
      
      // Fetch the updated student profile info to render it properly in the table
      const resolvedStudent = await fetch(`/api/students`);
      let studentProfile: any = null;
      if (resolvedStudent.ok) {
        const studentList = await resolvedStudent.json();
        const target = studentList.find((s: any) => s.email.toLowerCase() === newPayment.email.toLowerCase());
        if (target) {
          studentProfile = target.profile;
        }
      }

      const addedItem: PaymentItem = {
        id: data.payment.id,
        amount: data.payment.amount,
        date: data.payment.date,
        method: data.payment.method,
        status: data.payment.status,
        invoiceNumber: data.payment.invoiceNumber,
        description: data.payment.description,
        user: {
          email: newPayment.email,
          profile: studentProfile ? {
            firstName: studentProfile.firstName,
            lastName: studentProfile.lastName,
          } : null,
        },
      };

      setPayments([addedItem, ...payments]);
      setShowAddModal(false);
      setNewPayment({
        email: "",
        amount: "150.00",
        method: "Cash",
        description: "Monthly Tuition Fee",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to record payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, email, invoice..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-martial-red"
            />
          </div>

          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
          >
            <option value="">All Payment Methods</option>
            <option value="Stripe">Stripe</option>
            <option value="PayPal">PayPal</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-martial-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Ledger Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white">
        <table className="min-w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-6">Invoice #</th>
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">Date Paid</th>
              <th className="py-3.5 px-4">Method</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((p) => {
                const name = p.user.profile 
                  ? `${p.user.profile.firstName} ${p.user.profile.lastName}` 
                  : "External Student";
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-800">{p.invoiceNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{name}</div>
                      <div className="text-[10px] text-slate-400 font-medium lowercase">{p.user.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-semibold">{p.description}</td>
                    <td className="py-3.5 px-4">{p.date}</td>
                    <td className="py-3.5 px-4">{p.method}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">${p.amount.toFixed(2)}</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400 font-normal">
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Payment Entry Modal */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()} // prevent close
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-primary-navy text-base font-display">Record Manual Payment</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Student Account Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={newPayment.email}
                  onChange={handleInputChange}
                  placeholder="alex@tkd.com"
                  disabled={loading}
                  className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-martial-red"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Amount Paid ($ USD) *</label>
                <input
                  type="text"
                  name="amount"
                  required
                  value={newPayment.amount}
                  onChange={handleInputChange}
                  placeholder="150.00"
                  disabled={loading}
                  className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Payment Method *</label>
                <select
                  name="method"
                  value={newPayment.method}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Check">Check</option>
                  <option value="Stripe">Stripe Simulator</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Description / Memo *</label>
                <input
                  type="text"
                  name="description"
                  required
                  value={newPayment.description}
                  onChange={handleInputChange}
                  placeholder="e.g. July Kids Program Tuition"
                  disabled={loading}
                  className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-navy hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <DollarSign className="h-4.5 w-4.5 text-accent-gold" />
                {loading ? "Recording..." : "Record Payment Entry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
