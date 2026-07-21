import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Info } from "lucide-react";
import ScheduleTabs from "@/components/ScheduleTabs";

export const revalidate = 0;

export default async function SchedulePage() {
  const classes = await prisma.class.findMany({
    include: {
      program: true,
      instructor: { include: { profile: true } },
    },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Training Timetable</span>
          <h1 className="text-4xl font-black text-primary-navy font-display">Weekly Class Schedule</h1>
          <p className="text-slate-500">
            Find the perfect training block that fits your calendar. We offer flexible times across six days a week for all experience levels.
          </p>
        </div>

        {/* Schedule Tabs */}
        <ScheduleTabs initialClasses={classes} />

        {/* Info Box */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="bg-slate-800 text-accent-gold p-3 rounded-xl"><Info className="h-6 w-6" /></div>
            <div>
              <h4 className="font-bold text-base">New to Martial Arts?</h4>
              <p className="text-slate-300 text-xs mt-1">We recommend booking a free trial class first. Our instructors will guide you through the initial basics before placing you in a scheduled class.</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Link
              href="/try-free"
              className="bg-martial-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full text-xs text-center flex-1 md:flex-none transition-colors"
            >
              Book Free Trial
            </Link>
            <Link
              href="/join"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-full text-xs text-center border border-slate-700 flex-1 md:flex-none transition-colors"
            >
              Join Classes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
