"use client";

import { useState, useEffect } from "react";
import { Users, Clock, Check, QrCode, ClipboardList, ShieldCheck } from "lucide-react";

interface ClassItem {
  id: number;
  name: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  program: {
    id: number;
    name: string;
    ageGroup: string;
  };
}

interface StudentItem {
  id: number;
  email: string;
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    currentBelt: string;
    enrollments: {
      programId: number;
    }[];
  };
}

interface InstructorClassManagerProps {
  initialClasses: ClassItem[];
}

export default function InstructorClassManager({ initialClasses }: InstructorClassManagerProps) {
  const [classes] = useState<ClassItem[]>(initialClasses);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(initialClasses[0] || null);
  
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [roster, setRoster] = useState<{ profileId: number; name: string; belt: string; status: string }[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
  const [loading, setLoading] = useState(false);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);

  // Load students on mount
  useEffect(() => {
    async function loadStudents() {
      setRosterLoading(true);
      try {
        const res = await fetch("/api/students");
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
        }
      } catch (err) {
        console.error("Failed to load students", err);
      } finally {
        setRosterLoading(false);
      }
    }
    loadStudents();
  }, []);

  // Update roster list when selectedClass or students changes
  useEffect(() => {
    if (!selectedClass) return;
    
    // Filter students enrolled in this class's program
    const classStudents = students.filter(student => 
      student.profile?.enrollments?.some(e => e.programId === selectedClass.program.id)
    );

    // Map to attendance record shapes
    const initialRoster = classStudents.map(student => ({
      profileId: student.profile.id,
      name: `${student.profile.firstName} ${student.profile.lastName}`,
      belt: student.profile.currentBelt,
      status: "Present", // default to Present
    }));

    setRoster(initialRoster);
    setSuccessMsg("");
    setErrorMsg("");
  }, [selectedClass, students]);

  const handleStatusChange = (profileId: number, status: string) => {
    setRoster(prev => 
      prev.map(r => r.profileId === profileId ? { ...r, status } : r)
    );
  };

  const submitAttendance = async () => {
    if (!selectedClass) return;
    
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClass.id,
          date,
          records: roster.map(r => ({ profileId: r.profileId, status: r.status })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit attendance");
      }

      setSuccessMsg(`Attendance for ${selectedClass.name} successfully submitted for ${date}!`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector of Classes */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-primary-navy text-sm font-display flex items-center gap-2">
          <ClipboardList className="h-4.5 w-4.5 text-martial-red" /> Select Scheduled Class Session
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const isSelected = selectedClass?.id === cls.id;
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer h-28 ${
                  isSelected
                    ? "border-martial-red bg-white shadow-md translate-y-[-1px]"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <div className="min-w-0">
                  <span className="text-[9px] font-black bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase block w-max">
                    {cls.program.name}
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs truncate mt-2">{cls.name}</h4>
                </div>
                <div className="flex items-center justify-between w-full text-[10px] text-slate-400 mt-2">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {cls.startTime}</span>
                  <span className="font-bold text-slate-500 uppercase">{cls.dayOfWeek.substring(0, 3)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Roster Panel */}
      {selectedClass && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-primary-navy text-base font-display">{selectedClass.name} - Class Roster</h3>
              <p className="text-slate-500 text-[10px]">Select student attendance for this date.</p>
            </div>
            
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={loading}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-martial-red disabled:opacity-50"
              />
              
              <button
                onClick={() => setShowQRModal(true)}
                className="bg-primary-navy hover:bg-slate-900 text-white font-bold p-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Generate Check-in QR Code"
              >
                <QrCode className="h-4.5 w-4.5 text-accent-gold" />
                <span>QR Code</span>
              </button>
            </div>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="h-4.5 w-4.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {rosterLoading ? (
            <p className="text-xs text-slate-400 py-6 text-center">Loading program student list...</p>
          ) : roster.length > 0 ? (
            <div className="space-y-3.5">
              {roster.map((row) => (
                <div key={row.profileId} className="flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 border border-slate-100/60 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full border border-slate-200 bg-white flex items-center justify-center text-[10px]">
                      🥋
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-xs truncate">{row.name}</p>
                      <span className="text-[9px] text-slate-400 font-bold block">{row.belt} Belt</span>
                    </div>
                  </div>

                  {/* Attendance status toggle options */}
                  <div className="flex gap-2">
                    {["Present", "Late", "Absent"].map((status) => {
                      const isSelected = row.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(row.profileId, status)}
                          disabled={loading}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                            isSelected
                              ? status === "Present"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : status === "Late"
                                ? "bg-amber-500 text-white shadow-sm"
                                : "bg-rose-600 text-white shadow-sm"
                              : "bg-white text-slate-400 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-600"
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={submitAttendance}
                  disabled={loading}
                  className="bg-martial-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <ShieldCheck className="h-4.5 w-4.5" />
                  {loading ? "Saving Attendance Sheet..." : "Submit Roster Attendance"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-10 text-center">No students currently enrolled in this program.</p>
          )}
        </div>
      )}

      {/* QR Code Lightbox Modal */}
      {showQRModal && selectedClass && (
        <div
          onClick={() => setShowQRModal(false)}
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()} // prevent close
            className="bg-white rounded-3xl p-8 max-w-sm w-full space-y-6 border border-slate-100 shadow-2xl text-center"
          >
            <div>
              <span className="text-[10px] font-black bg-martial-red/10 text-martial-red px-2.5 py-1 rounded-full uppercase tracking-wider">
                Attendance Check-in Code
              </span>
              <h3 className="font-black text-primary-navy text-lg font-display mt-3 leading-tight">{selectedClass.name}</h3>
              <p className="text-[10px] text-slate-400 mt-1">Students can scan this from their device to self-check-in</p>
            </div>

            {/* Simulated QR Code box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
              <div className="w-48 h-48 border-4 border-primary-navy p-3 bg-white rounded-xl flex flex-col justify-between relative shadow-sm">
                {/* QR grids/mock dots */}
                <div className="flex justify-between w-full h-8">
                  <div className="w-8 h-8 bg-primary-navy rounded"></div>
                  <div className="w-8 h-8 bg-primary-navy rounded"></div>
                </div>
                <div className="h-12 w-full flex items-center justify-center">
                  <span className="text-[9px] font-black text-primary-navy tracking-widest uppercase">TKD-{selectedClass.id}</span>
                </div>
                <div className="flex justify-between w-full h-8">
                  <div className="w-8 h-8 bg-primary-navy rounded"></div>
                  {/* Small dots */}
                  <div className="w-8 h-8 flex flex-wrap gap-1 p-1">
                    <div className="w-2.5 h-2.5 bg-primary-navy rounded-sm"></div>
                    <div className="w-2.5 h-2.5 bg-primary-navy rounded-sm"></div>
                    <div className="w-2.5 h-2.5 bg-primary-navy rounded-sm"></div>
                    <div className="w-2.5 h-2.5 bg-primary-navy rounded-sm"></div>
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Code: SCAN-TKD-CLASS-{selectedClass.id}</span>
            </div>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              Close Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
