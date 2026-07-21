"use client";

import { useState } from "react";
import { Search, UserPlus, FileDown, Trash2, Edit2, X, PlusCircle, Check } from "lucide-react";

interface Program {
  id: number;
  name: string;
  ageGroup: string;
  pricing: number;
}

interface StudentItem {
  id: number;
  email: string;
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    parentName: string | null;
    dob: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
    emergencyContact: string;
    medicalInfo: string | null;
    currentBelt: string;
    membershipStatus: string;
    membershipType: string;
    enrollments: {
      id: number;
      program: Program;
    }[];
  } | null;
}

interface AdminStudentManagerProps {
  initialStudents: StudentItem[];
  programs: Program[];
}

export default function AdminStudentManager({ initialStudents, programs }: AdminStudentManagerProps) {
  const [students, setStudents] = useState<StudentItem[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [beltFilter, setBeltFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Add form fields
  const [newStudent, setNewStudent] = useState({
    email: "",
    password: "studentpassword123", // default password
    firstName: "",
    lastName: "",
    parentName: "",
    dob: "",
    age: "",
    gender: "Male",
    phone: "",
    address: "",
    emergencyContact: "",
    medicalInfo: "",
    currentBelt: "White",
    membershipStatus: "Active",
    membershipType: "Monthly",
    programId: programs[0]?.id ? String(programs[0].id) : "",
  });

  const filteredStudents = students.filter((s) => {
    if (!s.profile) return false;
    const nameMatch = `${s.profile.firstName} ${s.profile.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
                     s.email.toLowerCase().includes(search.toLowerCase()) ||
                     (s.profile.parentName || "").toLowerCase().includes(search.toLowerCase()) ||
                     s.profile.phone.includes(search);
    const beltMatch = beltFilter === "" || s.profile.currentBelt === beltFilter;
    const statusMatch = statusFilter === "" || s.profile.membershipStatus === statusFilter;
    return nameMatch && beltMatch && statusMatch;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create student");
      }

      setSuccessMsg("Student created successfully!");
      setStudents([data.student, ...students]);
      setShowAddModal(false);
      setNewStudent({
        email: "",
        password: "studentpassword123",
        firstName: "",
        lastName: "",
        parentName: "",
        dob: "",
        age: "",
        gender: "Male",
        phone: "",
        address: "",
        emergencyContact: "",
        medicalInfo: "",
        currentBelt: "White",
        membershipStatus: "Active",
        membershipType: "Monthly",
        programId: programs[0]?.id ? String(programs[0].id) : "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm("Are you sure you want to remove this student? This action deletes all profile, belt, and billing history.")) {
      return;
    }

    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete student");
      }

      setStudents(students.filter(s => s.id !== id));
      setSuccessMsg("Student removed successfully.");
    } catch (err: any) {
      alert(err.message || "Deletion failed.");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Parent Name", "Belt", "Plan", "Status"];
    const rows = filteredStudents.map((s) => [
      s.id,
      s.profile?.firstName || "",
      s.profile?.lastName || "",
      s.email,
      s.profile?.phone || "",
      s.profile?.parentName || "N/A",
      s.profile?.currentBelt || "White",
      s.profile?.membershipType || "Monthly",
      s.profile?.membershipStatus || "Active",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_directory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              placeholder="Search by name, parent, phone..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-martial-red"
            />
          </div>

          {/* Belt filter */}
          <select
            value={beltFilter}
            onChange={(e) => setBeltFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
          >
            <option value="">All Belts</option>
            {["White", "Yellow", "Orange", "Green", "Blue", "Purple", "Brown", "Red", "Black (1st Dan)"].map(b => (
              <option key={b} value={b}>{b} Belt</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Export CSV"
          >
            <FileDown className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-martial-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>
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
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-450 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-6">Name / Email</th>
              <th className="py-3.5 px-4">Contact Phone</th>
              <th className="py-3.5 px-4">Active Belt</th>
              <th className="py-3.5 px-4">Assigned Program</th>
              <th className="py-3.5 px-4">Billing Plan</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => {
                const prof = s.profile;
                if (!prof) return null;
                const programName = prof.enrollments[0]?.program.name || "None Assigned";
                
                return (
                  <tr key={s.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-800">{prof.firstName} {prof.lastName}</div>
                      <div className="text-[10px] text-slate-400 font-medium lowercase">{s.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{prof.phone}</div>
                      {prof.parentName && <div className="text-[10px] text-slate-400">Parent: {prof.parentName}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">
                        🥋 {prof.currentBelt}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{programName}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-500">{prof.membershipType}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          prof.membershipStatus === "Active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {prof.membershipStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleDeleteStudent(s.id)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Student"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400 font-normal">
                  No students matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Student Addition Modal */}
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
              <h3 className="font-black text-primary-navy text-base font-display">Add Student Profile Manually</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={newStudent.email}
                    onChange={handleInputChange}
                    placeholder="email@student.com"
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
                    value={newStudent.password}
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
                    value={newStudent.firstName}
                    onChange={handleInputChange}
                    placeholder="Alex"
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
                    value={newStudent.lastName}
                    onChange={handleInputChange}
                    placeholder="Mercer"
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
                    value={newStudent.dob}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-martial-red"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={newStudent.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 11"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Gender</label>
                  <select
                    name="gender"
                    value={newStudent.gender}
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
                  <label className="block font-bold text-slate-500 uppercase mb-1">Parent Name</label>
                  <input
                    type="text"
                    name="parentName"
                    value={newStudent.parentName}
                    onChange={handleInputChange}
                    placeholder="Richard Mercer"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={newStudent.phone}
                    onChange={handleInputChange}
                    placeholder="972-555-0211"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Home Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={newStudent.address}
                  onChange={handleInputChange}
                  placeholder="102 Larkspur Dr, Lewisville, TX"
                  disabled={loading}
                  className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Emergency Contact *</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    required
                    value={newStudent.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Richard Mercer - 972-555-0211"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Program Enrollment</label>
                  <select
                    name="programId"
                    value={newStudent.programId}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Current Belt</label>
                  <select
                    name="currentBelt"
                    value={newStudent.currentBelt}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    {["White", "Yellow", "Orange", "Green", "Blue", "Purple", "Brown", "Red"].map(b => (
                      <option key={b} value={b}>{b} Belt</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Billing Contract</label>
                  <select
                    name="membershipType"
                    value={newStudent.membershipType}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annual">Semi-Annual</option>
                    <option value="Annual">Annual</option>
                    <option value="Family">Family Package</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Membership Status</label>
                  <select
                    name="membershipStatus"
                    value={newStudent.membershipStatus}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-navy hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <PlusCircle className="h-4.5 w-4.5 text-accent-gold" />
                {loading ? "Adding student..." : "Create Student Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
