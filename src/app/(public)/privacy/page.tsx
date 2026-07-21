export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-12 space-y-6">
          <h1 className="text-3xl font-black text-primary-navy font-display border-b border-slate-100 pb-4">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Effective Date: July 20, 2026</p>

          <p className="text-slate-600 leading-relaxed text-sm">
            Martial Arts Tae Kwon Do ("we," "our," or "us") is committed to protecting the privacy of our students, parents, and visitors. This Privacy Policy describes how we collect, use, and share personal information obtained through our academy website and management system.
          </p>

          <h2 className="text-lg font-bold text-primary-navy mt-6">1. Information We Collect</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            We collect information that you provide directly to us when registering for classes, booking a free trial, or submitting a contact form. This includes:
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1.5">
            <li>Student details (Name, date of birth, age, gender, medical conditions, and belt history).</li>
            <li>Parent/guardian details (Name, contact information, and billing details).</li>
            <li>Contact details (Email address, phone number, and mailing address).</li>
            <li>Account credentials (hashed passwords for login access).</li>
          </ul>

          <h2 className="text-lg font-bold text-primary-navy mt-6">2. How We Use Your Information</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            We use the information we collect to manage your student profile, process monthly tuitions, issue certificates, track attendance, and send notifications regarding classes or upcoming testings.
          </p>

          <h2 className="text-lg font-bold text-primary-navy mt-6">3. Data Security</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            We implement strict security measures to safeguard your credentials. All accounts use secure password hashing (bcrypt), and we restrict data access to authorized administrators and instructors.
          </p>
        </div>
      </div>
    </div>
  );
}
