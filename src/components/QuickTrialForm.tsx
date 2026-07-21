"use client";

import { useState } from "react";

export default function QuickTrialForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "17:30", // default afternoon kids class time
    experience: "None",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/trials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit booking");
      }

      setSuccess(true);
      setFormData({
        name: "",
        age: "",
        phone: "",
        email: "",
        preferredDate: "",
        preferredTime: "17:30",
        experience: "None",
      });
    } catch (err: any) {
      setError(err.message || "Failed to book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="bg-green-950/40 border border-green-800 text-green-300 p-4 rounded-xl text-xs font-semibold">
          🎉 Free trial booked successfully! We will contact you shortly to confirm.
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-800 text-red-300 p-4 rounded-xl text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label htmlFor="trial-name" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
        <input
          type="text"
          id="trial-name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Student's name"
          disabled={loading}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-martial-red transition-all disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="trial-age" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Age</label>
          <input
            type="number"
            id="trial-age"
            name="age"
            required
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g. 8"
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-martial-red transition-all disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="trial-date" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Preferred Date</label>
          <input
            type="date"
            id="trial-date"
            name="preferredDate"
            required
            value={formData.preferredDate}
            onChange={handleChange}
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-martial-red transition-all disabled:opacity-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="trial-phone" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
          <input
            type="tel"
            id="trial-phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="972-555-0100"
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-martial-red transition-all disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="trial-email" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
          <input
            type="email"
            id="trial-email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="parent@email.com"
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-martial-red transition-all disabled:opacity-50"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-martial-red hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md cursor-pointer disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
      >
        {loading ? "Booking Session..." : "📅 Confirm Free Trial"}
      </button>
    </form>
  );
}
