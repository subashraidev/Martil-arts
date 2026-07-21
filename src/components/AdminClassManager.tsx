"use client";

import { useState } from "react";
import { PlusCircle, Trash2, Calendar, Clock, X, Check, Edit3 } from "lucide-react";

interface Program {
  id: number;
  name: string;
  ageGroup: string;
}

interface Instructor {
  id: number;
  profile: {
    firstName: string;
    lastName: string;
  } | null;
}

interface ClassItem {
  id: number;
  name: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  capacity: number;
  program: Program;
  instructor: Instructor | null;
}

interface AdminClassManagerProps {
  initialClasses: ClassItem[];
  programs: Program[];
  instructors: Instructor[];
}

export default function AdminClassManager({ initialClasses, programs, instructors }: AdminClassManagerProps) {
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [newClass, setNewClass] = useState({
    name: "",
    programId: programs[0]?.id ? String(programs[0].id) : "",
    dayOfWeek: "Monday",
    startTime: "16:30",
    endTime: "17:30",
    capacity: "20",
    instructorId: instructors[0]?.id ? String(instructors[0].id) : "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClass),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to schedule class");
      }

      setSuccessMsg("Class scheduled successfully!");
      
      // Resolve full class object details for local state insertion
      const resolvedProg = programs.find(p => String(p.id) === newClass.programId)!;
      const resolvedInst = instructors.find(i => String(i.id) === newClass.instructorId) || null;
      
      const addedItem: ClassItem = {
        id: data.class.id,
        name: newClass.name,
        dayOfWeek: newClass.dayOfWeek,
        startTime: newClass.startTime,
        endTime: newClass.endTime,
        capacity: parseInt(newClass.capacity),
        program: resolvedProg,
        instructor: resolvedInst,
      };

      setClasses([...classes, addedItem]);
      setShowAddModal(false);
      setNewClass({
        name: "",
        programId: programs[0]?.id ? String(programs[0].id) : "",
        dayOfWeek: "Monday",
        startTime: "16:30",
        endTime: "17:30",
        capacity: "20",
        instructorId: instructors[0]?.id ? String(instructors[0].id) : "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create class.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (id: number) => {
    if (!confirm("Are you sure you want to delete this class? This removes all associated attendance history log files.")) {
      return;
    }

    try {
      const res = await fetch("/api/classes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete class");
      }

      setClasses(classes.filter((c) => c.id !== id));
      setSuccessMsg("Class session deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Deletion failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-martial-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Schedule Class</span>
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
              <th className="py-3.5 px-6">Class Name</th>
              <th className="py-3.5 px-4">Program Level</th>
              <th className="py-3.5 px-4">Weekly Day</th>
              <th className="py-3.5 px-4">Training Hours</th>
              <th className="py-3.5 px-4">Instructor</th>
              <th className="py-3.5 px-4">Capacity</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
            {classes.map((cls) => {
              const instName = cls.instructor?.profile 
                ? `Master ${cls.instructor.profile.lastName}` 
                : "Not Assigned";
              return (
                <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-800">{cls.name}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-500">{cls.program.name}</td>
                  <td className="py-3.5 px-4 font-bold text-primary-navy">{cls.dayOfWeek}</td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> {cls.startTime} - {cls.endTime}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold">{instName}</td>
                  <td className="py-3.5 px-4">{cls.capacity} Students</td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleDeleteClass(cls.id)}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Class"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Class Addition Modal */}
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
              <h3 className="font-black text-primary-navy text-base font-display">Schedule Weekly Class</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Session Block Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={newClass.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Youth Intermediate Sparring"
                  disabled={loading}
                  className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-martial-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Weekly Day *</label>
                  <select
                    name="dayOfWeek"
                    value={newClass.dayOfWeek}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Max Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    required
                    value={newClass.capacity}
                    onChange={handleInputChange}
                    placeholder="20"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Start Time *</label>
                  <input
                    type="text"
                    name="startTime"
                    required
                    value={newClass.startTime}
                    onChange={handleInputChange}
                    placeholder="e.g. 16:30"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">End Time *</label>
                  <input
                    type="text"
                    name="endTime"
                    required
                    value={newClass.endTime}
                    onChange={handleInputChange}
                    placeholder="e.g. 17:30"
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Program *</label>
                  <select
                    name="programId"
                    value={newClass.programId}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Assign Instructor</label>
                  <select
                    name="instructorId"
                    value={newClass.instructorId}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="">Choose Instructor</option>
                    {instructors.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.profile ? `Master ${i.profile.lastName}` : "Admin"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-navy hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <Calendar className="h-4.5 w-4.5 text-accent-gold" />
                {loading ? "Scheduling..." : "Create Class Session"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
