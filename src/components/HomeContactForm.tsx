"use client";

import { useState } from "react";

export default function HomeContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-medium">
          ✅ Thank you! Your message has been sent. We'll get back to you shortly.
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm font-medium">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="form-name" className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name *</label>
          <input
            type="text"
            id="form-name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
          />
        </div>
        <div>
          <label htmlFor="form-email" className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address *</label>
          <input
            type="email"
            id="form-email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="form-phone" className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
          <input
            type="tel"
            id="form-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="972-555-0100"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
          />
        </div>
        <div>
          <label htmlFor="form-subject" className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject</label>
          <input
            type="text"
            id="form-subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Inquiry about after-school program"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="form-message" className="block text-xs font-bold text-slate-500 uppercase mb-2">Message *</label>
        <textarea
          id="form-message"
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Write your details here..."
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 resize-none transition-all"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-navy hover:bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {loading ? "Sending Message..." : "✉ Send Message"}
      </button>
    </form>
  );
}
