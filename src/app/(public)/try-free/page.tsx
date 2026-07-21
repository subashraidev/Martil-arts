"use client";

import { useState } from "react";
import { Calendar, Clock, Sparkles, ShieldCheck, Smile } from "lucide-react";

export default function TryFreePage() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    parentName: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "17:30",
    experience: "None",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        throw new Error(data.error || "Failed to submit request");
      }

      setSuccess(true);
      setFormData({
        name: "",
        age: "",
        parentName: "",
        phone: "",
        email: "",
        preferredDate: "",
        preferredTime: "17:30",
        experience: "None",
        notes: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to book session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Side Info Panel */}
          <div className="lg:col-span-4 bg-primary-navy text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 w-48 h-48 bg-martial-red rounded-full blur-2xl"></div>
            
            <div className="space-y-6 relative z-10">
              <span className="text-[10px] font-black bg-martial-red text-white px-3 py-1 rounded-md uppercase tracking-wider">
                🎁 Free Intro Offer
              </span>
              <h2 className="text-2xl font-black font-display leading-tight">Try A Free Class</h2>
              <p className="text-slate-300 text-xs leading-relaxed">
                Experience the focus, structure, and high energy of a Taekwondo class with zero obligation.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3 text-xs">
                  <ShieldCheck className="h-4.5 w-4.5 text-accent-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">No Uniform Needed</h4>
                    <p className="text-slate-400">Just wear comfortable workout clothes and bring a water bottle.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <Smile className="h-4.5 w-4.5 text-accent-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">Beginners Welcome</h4>
                    <p className="text-slate-400">Our trial class is custom paced for complete beginners.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-6 mt-8 relative z-10">
              Address: 2154 S State Hwy 121, Suite 600, Lewisville, TX
            </div>
          </div>

          {/* Form Panel */}
          <div className="lg:col-span-8 p-8 sm:p-10">
            <h3 className="text-xl font-bold text-primary-navy mb-2">Book Your Session</h3>
            <p className="text-xs text-slate-500 mb-6">Select a date and tell us a bit about the student to secure a slot.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-medium">
                  ✅ Success! Your free trial has been requested. Our staff will call or email you shortly to confirm the class time.
                </div>
              )}

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm font-medium">
                  ❌ {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Student's Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name of student"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Student's Age *</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 7"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="parentName" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Parent/Guardian Name</label>
                  <input
                    type="text"
                    id="parentName"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    placeholder="Required if student is under 18"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="experience" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Martial Arts Experience</label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 bg-white transition-all"
                  >
                    <option value="None">None / Complete Beginner</option>
                    <option value="Some">Some Experience (Less than 1 year)</option>
                    <option value="Advanced">Advanced (Belt from another school)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="972-555-0100"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="parent-or-student@email.com"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredDate" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Preferred Date *</label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    required
                    value={formData.preferredDate}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="preferredTime" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Preferred Time *</label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 bg-white transition-all"
                  >
                    <option value="16:00">4:00 PM (Toddler / Tiny Tigers)</option>
                    <option value="16:30">4:30 PM (Kids TKD)</option>
                    <option value="17:30">5:30 PM (Teens TKD)</option>
                    <option value="19:00">7:00 PM (Adults TKD)</option>
                    <option value="10:00">10:00 AM (Saturday Competition)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Additional Notes (Medical conditions, goals, etc.)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tell us if there are specific physical conditions or goals..."
                  disabled={loading}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 resize-none transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-martial-red hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {loading ? "Registering Trial Request..." : "📅 Confirm Trial Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
