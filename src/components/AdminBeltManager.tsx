"use client";

import { useState } from "react";
import { Award, Check, ShieldAlert, ShieldCheck } from "lucide-react";

interface Profile {
  firstName: string;
  lastName: string;
  currentBelt: string;
}

interface EvaluationItem {
  id: number;
  beltColor: string;
  level: string;
  status: string;
  skillsChecked: string;
  poomsaeForm: string;
  instructorNotes: string | null;
  profile: Profile;
}

interface AdminBeltManagerProps {
  initialEvaluations: EvaluationItem[];
}

export default function AdminBeltManager({ initialEvaluations }: AdminBeltManagerProps) {
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>(initialEvaluations);
  const [selectedEval, setSelectedEval] = useState<EvaluationItem | null>(null);
  
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectEval = (ev: EvaluationItem) => {
    setSelectedEval(ev);
    setNotes(ev.instructorNotes || "");
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handlePromoteStatus = async (status: "Completed" | "In Progress") => {
    if (!selectedEval) return;
    
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/belt-progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedEval.id,
          status,
          instructorNotes: notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update belt promotion");
      }

      setSuccessMsg(
        status === "Completed"
          ? `🎉 Rank promotion approved! ${selectedEval.profile.firstName} promoted to ${selectedEval.beltColor} Belt!`
          : "Evaluation notes updated."
      );

      // Remove from list if completed/promoted
      if (status === "Completed") {
        setEvaluations(evaluations.filter(ev => ev.id !== selectedEval.id));
      } else {
        setEvaluations(evaluations.map(ev => ev.id === selectedEval.id ? { ...ev, instructorNotes: notes } : ev));
      }

      setTimeout(() => {
        setSelectedEval(null);
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit rank update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Pending Evaluations Queue */}
      <div className="lg:col-span-5 border border-slate-100 rounded-2xl overflow-hidden p-4 space-y-3.5 bg-slate-50/50">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest px-1">Testing Queue</h3>
        
        <div className="space-y-2">
          {evaluations.length > 0 ? (
            evaluations.map((ev) => {
              const isSelected = selectedEval?.id === ev.id;
              return (
                <button
                  key={ev.id}
                  onClick={() => handleSelectEval(ev)}
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
                      {ev.profile.firstName} {ev.profile.lastName}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold block truncate">
                      Targeting: {ev.beltColor} Belt
                    </p>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                    ev.status === "Pending Approval" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    {ev.status === "Pending Approval" ? "Pending" : "In Progress"}
                  </span>
                </button>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No active testing records in queue.</p>
          )}
        </div>
      </div>

      {/* Promotion Panel */}
      <div className="lg:col-span-7 bg-slate-50/20 border border-slate-100 rounded-3xl p-6 shadow-inner min-h-[400px] flex flex-col justify-between">
        {selectedEval ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-primary-navy text-base font-display">
                  {selectedEval.profile.firstName} {selectedEval.profile.lastName}
                </h3>
                <p className="text-xs text-slate-400">Current belt: {selectedEval.profile.currentBelt}</p>
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

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-2xl">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Target Belt Level</span>
                  <h4 className="font-black text-slate-800 text-sm mt-0.5">{selectedEval.beltColor}</h4>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedEval.level}
                </span>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Form (Poomsae)</h4>
                <p className="text-xs font-semibold text-slate-700 bg-white border border-slate-150 p-3 rounded-xl">
                  {selectedEval.poomsaeForm}
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Evaluation & Promotion Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record board breaking success or general remarks..."
                  disabled={loading}
                  className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-martial-red resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handlePromoteStatus("In Progress")}
                  disabled={loading}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 font-bold py-3 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                >
                  💾 Save Notes
                </button>
                <button
                  onClick={() => handlePromoteStatus("Completed")}
                  disabled={loading}
                  className="flex-1 bg-martial-red hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <ShieldCheck className="h-4.5 w-4.5" /> Approve Promotion & Certificate
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Award className="h-10 w-10 text-slate-350" />
            <p className="font-bold text-slate-500">Queue Empty / No Request Selected</p>
            <p className="text-[10px]">Select a student testing file from the left to approve rank promotions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
