"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Calendar, Send, ShieldAlert, Check } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  target: string;
  createdAt: string;
}

export default function InstructorAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("students");
  
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function loadAnnouncements() {
    setListLoading(true);
    try {
      const res = await fetch("/api/cms?type=announcements&target=all");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "announcement",
          title,
          content,
          target,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to post announcement");
      }

      setSuccess("Announcement broadcast successfully!");
      setTitle("");
      setContent("");
      setTarget("students");
      loadAnnouncements(); // refresh list
    } catch (err: any) {
      setError(err.message || "Failed to post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Compose Announcement */}
      <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-black text-primary-navy text-base font-display">Broadcast Announcement</h3>
          <p className="text-slate-500 text-[10px]">Create an alert message for students or instructors</p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Check className="h-4.5 w-4.5 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ann-title" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title / Subject *</label>
            <input
              id="ann-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              placeholder="e.g. Schedule Change for Friday"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-martial-red"
            />
          </div>

          <div>
            <label htmlFor="ann-target" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Audience</label>
            <select
              id="ann-target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={loading}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-martial-red"
            >
              <option value="students">All Students</option>
              <option value="all">Everyone (Students & Instructors)</option>
            </select>
          </div>

          <div>
            <label htmlFor="ann-content" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Message Content *</label>
            <textarea
              id="ann-content"
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              placeholder="Write the broadcast details here..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-martial-red resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-martial-red hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5" />
            {loading ? "Publishing..." : "Send Announcement"}
          </button>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
          <div>
            <h3 className="font-black text-primary-navy text-base font-display">Broadcast Logs</h3>
            <p className="text-slate-500 text-[10px]">History of posted academy notices</p>
          </div>
          <button 
            onClick={loadAnnouncements} 
            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            🔄 Refresh
          </button>
        </div>

        {listLoading ? (
          <p className="text-xs text-slate-400 py-6 text-center">Loading notices...</p>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{ann.title}</h4>
                  <span className="text-[8px] font-black bg-slate-200 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">
                    {ann.target}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{ann.content}</p>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold pt-1 border-t border-slate-200/50">
                  <Calendar className="h-3 w-3" />
                  <span>Posted on {new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-10 text-center">No broadcasts found.</p>
        )}
      </div>
    </div>
  );
}
