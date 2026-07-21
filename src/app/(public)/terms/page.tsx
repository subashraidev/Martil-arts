export default function TermsAndConditionsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-12 space-y-6">
          <h1 className="text-3xl font-black text-primary-navy font-display border-b border-slate-100 pb-4">Terms & Conditions</h1>
          <p className="text-xs text-slate-400">Last Updated: July 20, 2026</p>

          <p className="text-slate-600 leading-relaxed text-sm">
            Please read these Terms and Conditions carefully before enrolling in programs at Martial Arts Tae Kwon Do. By checking the agree terms box during registration, you agree to be bound by these policies.
          </p>

          <h2 className="text-lg font-bold text-primary-navy mt-6">1. Tuitions & Membership Billing</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Tuition is billed automatically on a recurring monthly cycle based on the membership package selected. All payments (Stripe/PayPal/Cash/Card) must be logged on or before the due date. Standard pricing discounts apply for pre-paid quarterly, semi-annual, or annual options.
          </p>

          <h2 className="text-lg font-bold text-primary-navy mt-6">2. Attendance & Makeup Policies</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Regular attendance is vital for belt progression. In the event of a missed class, the student is allowed to attend an alternative makeup class during the same calendar month.
          </p>

          <h2 className="text-lg font-bold text-primary-navy mt-6">3. Liability Release</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Taekwondo is a contact sport. While we implement high safety standards, protective gear, and padded floors, students and parent guardians release Martial Arts Tae Kwon Do, its instructors, and grand masters from liability regarding accidental training injuries.
          </p>
        </div>
      </div>
    </div>
  );
}
