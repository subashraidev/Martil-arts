import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, MapPin, User, Info } from "lucide-react";

export const revalidate = 0;

export default async function SchedulePage() {
  const classes = await prisma.class.findMany({
    include: {
      program: true,
      instructor: { include: { profile: true } },
    },
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Group classes by day of week
  const scheduleByDay: { [key: string]: typeof classes } = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  };

  classes.forEach((c) => {
    if (scheduleByDay[c.dayOfWeek]) {
      scheduleByDay[c.dayOfWeek].push(c);
    }
  });

  // Sort classes in each day by start time
  Object.keys(scheduleByDay).forEach((day) => {
    scheduleByDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
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

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {daysOfWeek.map((day) => {
            const dayClasses = scheduleByDay[day] || [];
            return (
              <div key={day} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="font-black text-primary-navy text-lg font-display">{day}</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-semibold">
                    {dayClasses.length} Classes
                  </span>
                </div>

                <div className="flex-1 space-y-3.5">
                  {dayClasses.length > 0 ? (
                    dayClasses.map((cls) => (
                      <div key={cls.id} className="bg-slate-50/60 hover:bg-slate-50 border border-slate-100/80 rounded-xl p-3.5 space-y-2.5 transition-colors">
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-xs font-black text-slate-700 leading-snug">{cls.program.name}</span>
                          <span className="text-[9px] bg-martial-red/10 text-martial-red font-bold px-1.5 py-0.5 rounded uppercase flex-shrink-0">
                            {cls.program.ageGroup.split(" ")[0]}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="h-3.5 w-3.5 text-accent-gold" />
                          <span>{cls.startTime} - {cls.endTime}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span className="truncate">
                            {cls.instructor?.profile ? `Master ${cls.instructor.profile.lastName}` : "TBA"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-24 flex items-center justify-center text-xs text-slate-400 bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
                      No Scheduled Classes
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

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
