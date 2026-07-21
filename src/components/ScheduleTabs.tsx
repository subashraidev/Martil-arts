"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, User, Info, ArrowRight } from "lucide-react";

interface Program {
  id: number;
  name: string;
  ageGroup: string;
  pricing: number;
}

interface InstructorProfile {
  firstName: string;
  lastName: string;
}

interface Instructor {
  profile: InstructorProfile | null;
}

interface ClassItem {
  id: number;
  name: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  capacity: number;
  program: Program;
  instructor: Instructor | null;
}

interface ScheduleTabsProps {
  initialClasses: ClassItem[];
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ScheduleTabs({ initialClasses }: ScheduleTabsProps) {
  const [activeDay, setActiveDay] = useState("Monday");

  // Group classes by day of week
  const classesForActiveDay = initialClasses
    .filter((c) => c.dayOfWeek === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-8">
      {/* Day Selector Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center gap-3">
        {daysOfWeek.map((day) => {
          const count = initialClasses.filter((c) => c.dayOfWeek === day).length;
          const isActive = activeDay === day;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                isActive
                  ? "bg-primary-navy text-white border-primary-navy shadow-lg shadow-slate-900/10 scale-105"
                  : "bg-white text-slate-500 hover:bg-slate-50 border-slate-200"
              }`}
            >
              <span>{day}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-martial-red text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Classes List for Selected Day */}
      <div className="max-w-4xl mx-auto space-y-6">
        {classesForActiveDay.length > 0 ? (
          classesForActiveDay.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Side: Time & Program */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 flex-1">
                {/* Time Block */}
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-1 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl border border-slate-100 md:border-0 flex-shrink-0">
                  <div className="bg-accent-gold/15 p-2 rounded-xl text-accent-gold md:hidden">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Time Slot</span>
                    <p className="text-base font-black text-primary-navy flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent-gold hidden md:inline" />
                      {cls.startTime} - {cls.endTime}
                    </p>
                  </div>
                </div>

                {/* Vertical Divider for desktop */}
                <div className="hidden md:block w-px h-12 bg-slate-100"></div>

                {/* Class Details */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] bg-martial-red/10 text-martial-red font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-martial-red/10">
                      {cls.program.ageGroup}
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-500 font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-slate-200/60">
                      Max Capacity: {cls.capacity}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-primary-navy font-display">{cls.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      Led by:{" "}
                      <strong className="text-slate-700 font-semibold">
                        {cls.instructor?.profile
                          ? `Master ${cls.instructor.profile.firstName} ${cls.instructor.profile.lastName}`
                          : "TBA"}
                      </strong>
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Side: CTA Action */}
              <div className="flex items-center gap-4 border-t border-slate-50 pt-4 md:border-0 md:pt-0">
                <Link
                  href={`/join?programId=${cls.program.id}`}
                  className="bg-primary-navy hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-full text-xs transition-colors flex items-center gap-1.5 w-full md:w-auto justify-center"
                >
                  Register <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="text-slate-300 text-5xl">🥋</div>
            <h3 className="font-bold text-slate-700 text-sm">No Scheduled Classes</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no classes scheduled for {activeDay}. Please select another day to explore our training options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
