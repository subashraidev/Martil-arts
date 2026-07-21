"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

interface ClassItem {
  id: number;
  name: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface QRCheckInWidgetProps {
  classes: ClassItem[];
}

export default function QRCheckInWidget({ classes }: QRCheckInWidgetProps) {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckIn = async () => {
    if (!selectedClassId) {
      setErrorMsg("Please select a class to check in.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClassId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to check in");
      }

      setSuccessMsg(data.message || "Attendance recorded successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to check in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (classes.length === 0) {
    return (
      <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 text-center text-xs text-slate-400">
        No active classes scheduled for your program today.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {successMsg ? (
        <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-4 rounded-2xl flex items-start gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="font-bold">Check-in Verified</p>
            <p className="text-[10px] text-slate-300 mt-0.5">{successMsg}</p>
          </div>
        </div>
      ) : (
        <>
          {errorMsg && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 p-4 rounded-2xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="qr-class-select" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Class Session</label>
            <select
              id="qr-class-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={loading}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-martial-red disabled:opacity-50"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.startTime} - {c.endTime})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="h-4 w-4" />
            {loading ? "Verifying Position..." : "Check In Now"}
          </button>
        </>
      )}
    </div>
  );
}
