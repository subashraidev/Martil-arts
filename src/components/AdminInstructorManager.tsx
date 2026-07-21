"use client";

import { useState } from "react";
import { UserPlus, Trash2, X, PlusCircle, Check } from "lucide-react";

interface InstructorItem {
  id: number;
  email: string;
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    currentBelt: string;
  } | null;
}

interface AdminInstructorManagerProps {
  initialInstructors: InstructorItem[];
}

export default function AdminInstructorManager({ initialInstructors }: AdminInstructorManagerProps) {
  const [instructors, setInstructors] = useState<InstructorItem[]>(initialInstructors);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [newInstructor, setNewInstructor] = useState({
    email: "",
    password: "instructorpassword123",
    firstName: "",
    lastName: "",
    dob: "1990-01-01",
    age: "30",
    gender: "Male",
    phone: "",
    address: "",
    emergencyContact: "",
    currentBelt: "Black (1st Dan)",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewInstructor({ ...newInstructor, [e.target.name]: e.target.value });
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInstructor),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create instructor");
      }

      setSuccessMsg("Instructor added successfully!");
      setInstructors([...instructors, data.instructor]);
      setShowAddModal(false);
      setNewInstructor({
        email: "",
        password: "instructorpassword123",
        firstName: "",
        lastName: "",
        dob: "1990-01-01",
        age: "30",
        gender: "Male",
        phone: "",
        address: "",
        emergencyContact: "",
        currentBelt: "Black (1st Dan)",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add instructor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-martial-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Instructor</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Directory Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white">
        <table className="min-w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-6">Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Rank Belt</th>
              <th className="py-3.5 px-6 text-right">Dojang</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
            {instructors.map((inst) => {
              const prof = inst.profile;
              if (!prof) return null;
              return (
                <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-800">Master {prof.firstName} {prof.lastName}</td>
                  <td className="py-3.5 px-4 text-slate-555 lowercase">{inst.email}</td>
                  <td className="py-3.5 px-4">{prof.phone}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-900 text-white px-2.5 py-0.5 rounded text-[9px] font-black uppercase">
                      🥋 {prof.currentBelt}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right text-slate-400 font-semibold">Lewisville Dojang</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Manual Instructor Addition Modal */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()} // prevent close
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-100 shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-primary-navy text-base font-display">Register New Instructor</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddInstructor} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={newInstructor.email}
                    onChange={handleInputChange}
                    placeholder="name@tkd.com"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-martial-red"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Default Password *</label>
                  <input
                    type="text"
                    name="password"
                    required
                    value={newInstructor.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-martial-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={newInstructor.firstName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ji-hoon"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-martial-red"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={newInstructor.lastName}
                    onChange={handleInputChange}
                    placeholder="e.g. Kim"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-martial-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">DOB *</label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={newInstructor.dob}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={newInstructor.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 30"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Gender</label>
                  <select
                    name="gender"
                    value={newInstructor.gender}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={newInstructor.phone}
                    onChange={handleInputChange}
                    placeholder="972-555-0100"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Instructor Rank Belt</label>
                  <select
                    name="currentBelt"
                    value={newInstructor.currentBelt}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="Black (1st Dan)">Black (1st Dan)</option>
                    <option value="Black (2nd Dan)">Black (2nd Dan)</option>
                    <option value="Black (3rd Dan)">Black (3rd Dan)</option>
                    <option value="Black (4th Dan)">Black (4th Dan)</option>
                    <option value="Black (5th Dan)">Black (5th Dan)</option>
                    <option value="Black (9th Dan)">Black (9th Dan)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-navy hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <PlusCircle className="h-4.5 w-4.5 text-accent-gold" />
                {loading ? "Adding instructor..." : "Create Instructor Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
