import { prisma } from "@/lib/prisma";
import { Award, Shield, CheckCircle2, AwardIcon } from "lucide-react";

export const revalidate = 0;

export default async function InstructorsPage() {
  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    include: { profile: true },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Our Faculty</span>
          <h1 className="text-4xl font-black text-primary-navy font-display">Meet Our Instructors</h1>
          <p className="text-slate-500">
            Our classes are led by highly certified martial artists who focus on building student character, focus, and technical correctness.
          </p>
        </div>

        {/* Grand Master Feature Card */}
        <div className="bg-primary-navy text-white rounded-3xl border border-slate-800 shadow-xl overflow-hidden mb-16 max-w-4xl mx-auto flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 h-80 md:h-96 relative bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=600"
              alt="Grand Master Kim"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-10 space-y-4">
            <span className="inline-flex items-center gap-1 bg-accent-gold text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-md">
              <AwardIcon className="h-3 w-3" /> Grand Master (9th Dan)
            </span>
            <h2 className="text-2xl md:text-3xl font-black font-display text-white">Grand Master Kim</h2>
            <p className="text-xs text-slate-400">Founder & Chief Examiner</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Grand Master Kim has over 40 years of international experience. He is a Kukkiwon certified 9th Dan Black Belt, a former championship competitor, and dedicates himself to verifying testing standards and training advanced instructors.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[10px] uppercase font-bold text-slate-400">
              <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60">40+ Yrs Exp</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60">Kukkiwon certified</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60">Chief Judge</span>
            </div>
          </div>
        </div>

        {/* Instructors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {instructors.map((inst) => (
            <div key={inst.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="h-64 bg-slate-100 relative">
                <img
                  src={
                    inst.profile?.firstName.includes("Ji-hoon")
                      ? "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=500"
                      : "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=500"
                  }
                  alt={inst.profile?.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black bg-martial-red/10 text-martial-red px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {inst.profile?.currentBelt}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Lewisville Dojang</span>
                </div>
                <h3 className="text-xl font-black text-primary-navy font-display leading-tight">
                  Master {inst.profile?.firstName} {inst.profile?.lastName}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {inst.profile?.firstName.includes("Ji-hoon")
                    ? "Master Ji-hoon is highly skilled in Olympic sparring training and teenager coaching. He focuses on speed kicking techniques and cardiovascular stamina."
                    : "Instructor Sarah specializes in preschool Tiny Tigers and youth starter classes. She designs high-focus games that make learning respect and balance extremely fun."}
                </p>
                <div className="pt-4 border-t border-slate-50 space-y-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Certifications:</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded">Kukkiwon Certified</span>
                    <span className="text-[10px] bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded">First Aid CPR</span>
                    <span className="text-[10px] bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded">Bully Prevention Specialist</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
