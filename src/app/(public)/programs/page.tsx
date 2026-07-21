import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Check, Shield, Clock, Users, Award } from "lucide-react";

export const revalidate = 0;

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Our Curriculum</span>
          <h1 className="text-4xl font-black text-primary-navy font-display">Tae Kwon Do Programs</h1>
          <p className="text-slate-500">
            We provide specialized training tailored to different age groups and development levels. From coordination play for preschoolers to competitive Olympic conditioning.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog) => (
            <div key={prog.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div>
                {/* Program Header */}
                <div className="bg-primary-navy p-8 text-white relative">
                  <div className="absolute top-4 right-4 bg-martial-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {prog.ageGroup}
                  </div>
                  <h2 className="text-2xl font-black group-hover:text-accent-gold transition-colors font-display pt-2">
                    {prog.name}
                  </h2>
                  <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-accent-gold" /> {prog.schedule}
                  </p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  <p className="text-slate-600 text-sm leading-relaxed">{prog.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Training Benefits</h4>
                    <ul className="space-y-2">
                      {prog.benefits.split(",").map((benefit: string) => (
                        <li key={benefit} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Max Capacity: 20</span>
                    <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Instructor: {prog.instructorName}</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Join */}
              <div className="p-8 pt-0 mt-4 flex items-center justify-between border-t border-slate-50">
                <div>
                  <span className="text-xs text-slate-400">Monthly Cost</span>
                  <p className="text-2xl font-black text-primary-navy">${prog.pricing}<span className="text-xs font-medium text-slate-400">/mo</span></p>
                </div>
                <Link
                  href={`/join?programId=${prog.id}`}
                  className="bg-martial-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full text-xs shadow-md transition-all"
                >
                  Join Program
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
