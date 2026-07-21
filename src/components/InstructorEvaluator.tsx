"use client";

import { useState } from "react";
import { Award, Check, ShieldAlert, Star, ShieldCheck } from "lucide-react";

interface BeltProgressRecord {
  id: number;
  beltColor: string;
  level: string;
  status: string;
  skillsChecked: string;
  poomsaeForm: string;
}

interface StudentItem {
  id: number;
  email: string;
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    currentBelt: string;
    beltProgressions: BeltProgressRecord[];
  } | null;
}

interface InstructorEvaluatorProps {
  students: StudentItem[];
}

export default function InstructorEvaluator({ students }: InstructorEvaluatorProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  
  const [sparringRating, setSparringRating] = useState("A (Excellent)");
  const [boardBreakingRating, setBoardBreakingRating] = useState("Pass");
  const [notes, setNotes] = useState("");
  const [checkedSkills, setCheckedSkills] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectStudent = (student: StudentItem) => {
    setSelectedStudent(student);
    setSuccessMsg("");
    setErrorMsg("");
    
    // Resolve active belt progress
    const active = student.profile?.beltProgressions.find(bp => bp.status === "In Progress");
    if (active) {
      setNotes("");
      setSparringRating("A (Excellent)");
      setBoardBreakingRating("Pass");
      
      try {
        setCheckedSkills(JSON.parse(active.skillsChecked) || []);
      } catch (e) {
        setCheckedSkills([]);
      }
    } else {
      setCheckedSkills([]);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setCheckedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handlePromote = async (status: "Completed" | "In Progress") => {
    const active = selectedStudent?.profile?.beltProgressions.find(bp => bp.status === "In Progress");
    if (!active) {
      setErrorMsg("No active 'In Progress' rank promotion found for this student.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/belt-progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: active.id,
          status,
          instructorNotes: notes,
          skillsChecked: checkedSkills,
          sparringRating,
          boardBreakingRating,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update evaluation");
      }

      setSuccessMsg(
        status === "Completed"
          ? `🎉 Rank promotion approved! Student ${selectedStudent?.profile?.firstName} has been promoted to ${active.beltColor} Belt!`
          : `Evaluation updated successfully for ${selectedStudent?.profile?.firstName}.`
      );

      // Reset selected student after delay or refresh local list
      setTimeout(() => {
        setSelectedStudent(null);
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit evaluation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Student List */}
      <div className="lg:col-span-5 border border-slate-100 rounded-2xl overflow-hidden p-4 space-y-3.5 bg-slate-50/50">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest px-1">Select Student</h3>
        
        <div className="space-y-2">
          {students.map((student) => {
            const hasProfile = student.profile;
            if (!hasProfile) return null;
            const active = student.profile?.beltProgressions.find(bp => bp.status === "In Progress");
            const isSelected = selectedStudent?.id === student.id;

            return (
              <button
                key={student.id}
                onClick={() => handleSelectStudent(student)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-martial-red bg-white shadow-md"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  🥋
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-xs truncate">
                    {hasProfile.firstName} {hasProfile.lastName}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold block truncate">
                    Current: {hasProfile.currentBelt} Belt
                  </p>
                </div>
                {active ? (
                  <span className="text-[8px] font-black bg-martial-red/10 text-martial-red border border-martial-red/20 px-2 py-0.5 rounded uppercase">
                    Eval: {active.beltColor}
                  </span>
                ) : (
                  <span className="text-[8px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded uppercase">
                    Ready
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Evaluation Dashboard */}
      <div className="lg:col-span-7 bg-slate-50/20 border border-slate-100 rounded-3xl p-6 shadow-inner min-h-[400px] flex flex-col justify-between">
        {selectedStudent && selectedStudent.profile ? (
          <div className="space-y-6">
            {/* Student Header details */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-primary-navy text-base font-display">
                  {selectedStudent.profile.firstName} {selectedStudent.profile.lastName}
                </h3>
                <p className="text-xs text-slate-400">Current belt: {selectedStudent.profile.currentBelt}</p>
              </div>
              <span className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-inner">
                🥋
              </span>
            </div>

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Active belt progress block */}
            {selectedStudent.profile.beltProgressions.find(bp => bp.status === "In Progress") ? (
              (() => {
                const active = selectedStudent.profile!.beltProgressions.find(bp => bp.status === "In Progress")!;
                return (
                  <div className="space-y-6 text-sm">
                    {/* Target Rank info */}
                    <div className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-2xl">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Evaluating Rank for</span>
                        <h4 className="font-black text-slate-800 text-sm mt-0.5">{active.beltColor} Belt</h4>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        {active.level}
                      </span>
                    </div>

                    {/* Form name */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        Required Form (Poomsae)
                      </h4>
                      <p className="text-xs font-semibold text-slate-700 bg-white border border-slate-150 p-3 rounded-xl">
                        {active.poomsaeForm}
                      </p>
                    </div>

                    {/* Skill Checklist */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Checklist Skills Verified</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {[
                          "Basic stances (Kibon Junbi)",
                          "Rank-specific kicks",
                          "Standard blocks fluency",
                          "Poomsae form memorization",
                          "Self-Defense combinations",
                          "Board breaking verification",
                        ].map((skill) => {
                          const isChecked = checkedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              onClick={() => handleSkillToggle(skill)}
                              disabled={loading}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isChecked
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
                                  : "bg-white border-slate-200 text-slate-600"
                              }`}
                            >
                              <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-slate-50"
                              }`}>
                                {isChecked && <Check className="h-3 w-3" />}
                              </span>
                              <span>{skill}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sparring Rating</label>
                        <select
                          value={sparringRating}
                          onChange={(e) => setSparringRating(e.target.value)}
                          disabled={loading}
                          className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-martial-red"
                        >
                          <option value="A (Excellent)">A (Excellent)</option>
                          <option value="B (Good)">B (Good)</option>
                          <option value="C (Pass)">C (Pass)</option>
                          <option value="D (Fail)">D (Fail)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Board Breaking</label>
                        <select
                          value={boardBreakingRating}
                          onChange={(e) => setBoardBreakingRating(e.target.value)}
                          disabled={loading}
                          className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-martial-red"
                        >
                          <option value="Pass">Pass / Completed</option>
                          <option value="Fail">Fail / Redo</option>
                          <option value="N/A">Not Required</option>
                        </select>
                      </div>
                    </div>

                    {/* Instructor Notes */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instructor Notes</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Provide feedback on kicking power or posture..."
                        disabled={loading}
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-martial-red resize-none"
                      ></textarea>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handlePromote("In Progress")}
                        disabled={loading}
                        className="flex-1 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 font-bold py-3 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                      >
                        💾 Save Progress
                      </button>
                      <button
                        onClick={() => handlePromote("Completed")}
                        disabled={loading}
                        className="flex-1 bg-martial-red hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <ShieldCheck className="h-4 w-4" /> Approve Promotion
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs bg-white border border-slate-100 rounded-2xl">
                No active rank evaluation initialized for this student.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Award className="h-10 w-10 text-slate-350" />
            <p className="font-bold text-slate-500">No Student Selected</p>
            <p className="text-[10px]">Select a student from the sidebar to inspect their curriculum checkpoints.</p>
          </div>
        )}
      </div>
    </div>
  );
}
