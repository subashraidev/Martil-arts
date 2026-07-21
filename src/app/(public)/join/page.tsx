"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, CreditCard, ChevronRight, Check } from "lucide-react";

interface Program {
  id: number;
  name: string;
  ageGroup: string;
  pricing: number;
}

function JoinFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProgramId = searchParams.get("programId") || "";

  const [programs, setPrograms] = useState<Program[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    programId: initialProgramId,
    membershipPlan: "Monthly",
    preferredSchedule: "",
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPrograms() {
      try {
        const res = await fetch("/api/programs");
        if (res.ok) {
          const data = await res.json();
          setPrograms(data);
        }
      } catch (err) {
        console.error("Failed to load programs", err);
      }
    }
    loadPrograms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.agreeTerms) {
      setError("You must agree to the Terms & Conditions and liability release.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Success! Auto-logged in. Redirect to student dashboard
      router.push("/dashboard/student");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your credentials.");
      setLoading(false);
    }
  };

  const selectedProgram = programs.find(p => String(p.id) === formData.programId);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Academy Enrollment</span>
          <h1 className="text-3xl font-black text-primary-navy font-display">Student Registration</h1>
          <p className="text-slate-500 text-xs">
            Complete the form below to register your student account, choose your training program, and set up your student dashboard.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm font-medium flex items-start gap-2">
                <ShieldAlert className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Account Login Details */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-primary-navy border-b border-slate-100 pb-2">1. Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address *</label>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="reg-pass" className="block text-xs font-bold text-slate-500 uppercase mb-2">Password *</label>
                  <input
                    type="password"
                    id="reg-pass"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Personal details */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-primary-navy border-b border-slate-100 pb-2">2. Personal Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-500 uppercase mb-2">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Alex"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold text-slate-500 uppercase mb-2">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Mercer"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="dob" className="block text-xs font-bold text-slate-500 uppercase mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-xs font-bold text-slate-500 uppercase mb-2">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 11"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-xs font-bold text-slate-500 uppercase mb-2">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 bg-white transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="parentName" className="block text-xs font-bold text-slate-500 uppercase mb-2">Parent/Guardian Name (If Under 18)</label>
                  <input
                    type="text"
                    id="parentName"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    placeholder="Richard Mercer"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="972-555-0211"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-bold text-slate-500 uppercase mb-2">Home Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="102 Larkspur Dr, Lewisville, TX 75067"
                  disabled={loading}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="emergencyContact" className="block text-xs font-bold text-slate-500 uppercase mb-2">Emergency Contact (Name & Phone) *</label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    required
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Richard Mercer - 972-555-0211"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="medicalInfo" className="block text-xs font-bold text-slate-500 uppercase mb-2">Medical Conditions / Allergies</label>
                  <input
                    type="text"
                    id="medicalInfo"
                    name="medicalInfo"
                    value={formData.medicalInfo}
                    onChange={handleChange}
                    placeholder="Asthma, peanut allergy, etc. (leave blank if none)"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Program & Membership selection */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-primary-navy border-b border-slate-100 pb-2">3. Program & Membership selection</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="programId" className="block text-xs font-bold text-slate-500 uppercase mb-2">Choose Program *</label>
                  <select
                    id="programId"
                    name="programId"
                    required
                    value={formData.programId}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 bg-white transition-all"
                  >
                    <option value="">Select a Program</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.ageGroup})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="membershipPlan" className="block text-xs font-bold text-slate-500 uppercase mb-2">Membership Billing Plan</label>
                  <select
                    id="membershipPlan"
                    name="membershipPlan"
                    value={formData.membershipPlan}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 bg-white transition-all"
                  >
                    <option value="Monthly">Monthly Billing</option>
                    <option value="Quarterly">Quarterly Billing (10% Discount)</option>
                    <option value="Semi-Annual">Semi-Annual Billing (15% Discount)</option>
                    <option value="Annual">Annual Billing (20% Discount)</option>
                    <option value="Family">Family Package Plan</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="preferredSchedule" className="block text-xs font-bold text-slate-500 uppercase mb-2">Preferred Training Days</label>
                  <input
                    type="text"
                    id="preferredSchedule"
                    name="preferredSchedule"
                    value={formData.preferredSchedule}
                    onChange={handleChange}
                    placeholder="e.g. Mon/Wed 5:30 PM"
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-martial-red focus:border-transparent text-sm disabled:bg-slate-50 transition-all"
                  />
                </div>
              </div>

              {selectedProgram && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex justify-between items-center text-sm">
                  <div>
                    <h5 className="font-bold text-primary-navy">Selected Program Rate:</h5>
                    <p className="text-xs text-slate-400">Class tuition based on plan selections</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-primary-navy">${selectedProgram.pricing}</p>
                    <span className="text-xs text-slate-400">Due monthly</span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Submission */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-martial-red focus:ring-martial-red cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-500 leading-relaxed cursor-pointer select-none">
                  I agree to the <Link href="/terms" target="_blank" className="text-martial-red hover:underline">Terms & Conditions</Link>, and authorize Martial Arts Tae Kwon Do to charge my selected billing method. I release the academy, its instructors, and directors from liability regarding injuries sustained during class.
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-martial-red hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed text-center"
                >
                  {loading ? "Registering Account..." : "🥋 Complete Registration & Checkout"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading enrollment form...</div>}>
      <JoinFormContent />
    </Suspense>
  );
}
