"use client";

import { useState } from "react";
import { Award, Shield, CheckCircle2, ChevronRight, BookOpen, Star } from "lucide-react";

interface BeltDetail {
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  level: string;
  poomsae: string;
  stances: string[];
  kicks: string[];
  blocks: string[];
  selfDefense: string[];
  characterTrait: string;
  breakingRequirement?: string;
}

export default function BeltProgressionPage() {
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced" | "black">("beginner");
  const [activeBeltIdx, setActiveBeltIdx] = useState(0);

  const curriculum = {
    beginner: [
      {
        color: "White Belt (10th Gup)",
        bgColor: "bg-white",
        textColor: "text-slate-800",
        borderColor: "border-slate-300",
        level: "Beginner",
        poomsae: "Basic Stances (Kibon Junbi)",
        stances: ["Attention Stance (Charyot)", "Bow Stance (Kyongye)", "Ready Stance (Junbi)"],
        kicks: ["Front Kick (Ap Chagi)", "Knee Strike (Mup Chigi)"],
        blocks: ["Low Block (Arae Makki)", "Middle Block (Momtong Makki)"],
        selfDefense: ["Wrist Escape (Single Hand)", "Grab escape fundamentals"],
        characterTrait: "Courtesy & Respect (Ye Ui) - Learning to bow and follow instructions.",
        breakingRequirement: "Not required",
      },
      {
        color: "Yellow Belt (9th Gup)",
        bgColor: "bg-yellow-400",
        textColor: "text-yellow-950",
        borderColor: "border-yellow-500",
        level: "Beginner",
        poomsae: "Taegeuk Il Jang (Form 1 - Keon: Heaven and Light)",
        stances: ["Walking Stance (Ap Seogi)", "Front Stance (Ap Kubi)"],
        kicks: ["Axe Kick (Naeryeo Chagi)", "Roundhouse Kick (Dollyo Chagi)"],
        blocks: ["High Block (Olgul Makki)"],
        selfDefense: ["Double Wrist escape", "Shoulder grab defense"],
        characterTrait: "Integrity (Yeom Chi) - Distinguishing right from wrong; training honestly.",
        breakingRequirement: "Palm Strike (1/2 inch board)",
      },
      {
        color: "Orange Belt (8th Gup)",
        bgColor: "bg-orange-500",
        textColor: "text-white",
        borderColor: "border-orange-600",
        level: "Beginner",
        poomsae: "Taegeuk Ee Jang (Form 2 - Tae: Joyfulness)",
        stances: ["Back Stance (Dwit Kubi)"],
        kicks: ["Side Kick (Yeop Chagi)", "Fast Kick (Flog Kick)"],
        blocks: ["Knife Hand Block (Sonnal Makki)"],
        selfDefense: ["Collar grab release", "Basic punching defenses"],
        characterTrait: "Perseverance (In Nae) - Sticking with tough training exercises.",
        breakingRequirement: "Hammer Fist (1/2 inch board)",
      },
    ],
    intermediate: [
      {
        color: "Green Belt (7th Gup)",
        bgColor: "bg-green-600",
        textColor: "text-white",
        borderColor: "border-green-700",
        level: "Intermediate",
        poomsae: "Taegeuk Sam Jang (Form 3 - Ri: Fire and Sun)",
        stances: ["Tiger Stance (Beom Seogi)"],
        kicks: ["Back Kick (Dwit Chagi)", "Double Roundhouse Kick"],
        blocks: ["Single Knife Hand High Block"],
        selfDefense: ["Bear hug defenses", "Basic dynamic blocking defense"],
        characterTrait: "Self-Control (Geuk Gi) - Controlling power in sparring; discipline at school.",
        breakingRequirement: "Axe Kick (1 inch board)",
      },
      {
        color: "Blue Belt (6th Gup)",
        bgColor: "bg-blue-600",
        textColor: "text-white",
        borderColor: "border-blue-700",
        level: "Intermediate",
        poomsae: "Taegeuk Sa Jang (Form 4 - Jin: Thunder)",
        stances: ["Cross Stance (Koa Seogi)"],
        kicks: ["Spinning Hook Kick (Dwi Dollyo)", "Crescent Kick"],
        blocks: ["Double Outer Forearm Block"],
        selfDefense: ["Choke escapes", "Grab transitions"],
        characterTrait: "Indomitable Spirit (Baekjul Boolgool) - Overcoming fear of sparring contact.",
        breakingRequirement: "Side Kick (1 inch board)",
      },
      {
        color: "Purple Belt (5th Gup)",
        bgColor: "bg-purple-600",
        textColor: "text-white",
        borderColor: "border-purple-700",
        level: "Intermediate",
        poomsae: "Taegeuk Oh Jang (Form 5 - Seon: Wind)",
        stances: ["Assorted Stances review"],
        kicks: ["Tornado Kick", "Jumping Front Kick"],
        blocks: ["Low Knife Hand Guarding Block"],
        selfDefense: ["Ground defense, escaping mounts"],
        characterTrait: "Humility (Gyeomson) - Mentoring lower belts with kindness.",
        breakingRequirement: "Elbow Strike (1 inch board)",
      },
    ],
    advanced: [
      {
        color: "Brown Belt (4th Gup)",
        bgColor: "bg-amber-800",
        textColor: "text-white",
        borderColor: "border-amber-900",
        level: "Advanced",
        poomsae: "Taegeuk Yuk Jang (Form 6 - Gam: Water)",
        stances: ["All standard stances fluent"],
        kicks: ["Jumping Side Kick", "Flying Axe Kick"],
        blocks: ["Palm Pressing Block (Batangson 눌러막기)"],
        selfDefense: ["Weapon disarms (knife attacks basics)"],
        characterTrait: "Focus - Directing all physical force into precise targets.",
        breakingRequirement: "Jumping Side Kick (1 inch board)",
      },
      {
        color: "Red Belt (3rd Gup)",
        bgColor: "bg-red-600",
        textColor: "text-white",
        borderColor: "border-red-700",
        level: "Advanced",
        poomsae: "Taegeuk Chil Jang (Form 7 - Gan: Mountain)",
        stances: ["Deep Front Stances, transitions"],
        kicks: ["Double jumping kicks", "Counter kick timing"],
        blocks: ["Scissors Block (Gawi Makki)"],
        selfDefense: ["Multiple attacker defense strategy"],
        characterTrait: "Leadership - Leading class warmups and mentoring beginners.",
        breakingRequirement: "Spinning Hook Kick (1 inch board)",
      },
      {
        color: "Red Black Belt (2nd Gup)",
        bgColor: "bg-gradient-to-r from-red-600 to-slate-900",
        textColor: "text-white",
        borderColor: "border-slate-800",
        level: "Advanced",
        poomsae: "Taegeuk Pal Jang (Form 8 - Gon: Earth)",
        stances: ["Perfect stances, high-speed transitions"],
        kicks: ["Jumping Spinning Hook Kick", "Triple kicks"],
        blocks: ["Double low block combinations"],
        selfDefense: ["Advanced self defense locks and pins"],
        characterTrait: "Teacher Training - Assistant teaching kids programs.",
        breakingRequirement: "Back Kick & Palm Strike combo (two boards)",
      },
    ],
    black: [
      {
        color: "1st Dan Black Belt",
        bgColor: "bg-slate-950",
        textColor: "text-white",
        borderColor: "border-black",
        level: "Black Belt",
        poomsae: "Koryo (Korean Kingdom Core Core Form)",
        stances: ["All Kukkiwon Stances"],
        kicks: ["Elite high kicks, jump hook, jump back kick"],
        blocks: ["All blocks with internal ki power"],
        selfDefense: ["Full military-style combat self-defense"],
        characterTrait: "Character Excellence - Committing to lifelong learning and moral leader.",
        breakingRequirement: "Speed breaking (boards held only by gravity)",
      },
    ],
  };

  const activeLevelList = curriculum[selectedLevel];
  const activeBelt = activeLevelList[activeBeltIdx] || activeLevelList[0];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Rank Progression</span>
          <h1 className="text-4xl font-black text-primary-navy font-display">Tae Kwon Do Belt System</h1>
          <p className="text-slate-500">
            Click through our level categories to explore the Poomsae forms, kicking combinations, and character tenets required to progress in Rank.
          </p>
        </div>

        {/* Level Category Selectors */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(["beginner", "intermediate", "advanced", "black"] as const).map((level) => (
            <button
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setActiveBeltIdx(0);
              }}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                selectedLevel === level
                  ? "bg-primary-navy text-white shadow-lg"
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {level} Level
            </button>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Belt List Column */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest px-2 mb-2">Available Ranks</h3>
            {activeLevelList.map((belt, idx) => (
              <button
                key={belt.color}
                onClick={() => setActiveBeltIdx(idx)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeBeltIdx === idx
                    ? "bg-white border-martial-red shadow-md translate-x-1"
                    : "bg-white/60 hover:bg-white border-slate-200/80"
                }`}
              >
                <span className={`w-8 h-8 rounded-full border ${belt.bgColor} ${belt.borderColor} flex-shrink-0 shadow-inner`}></span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{belt.color}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{belt.level} Curriculum</p>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${activeBeltIdx === idx ? "text-martial-red translate-x-0.5" : "text-slate-300"}`} />
              </button>
            ))}
          </div>

          {/* Belt Detail Card Column */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-8">
            {/* Title Block */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <span className={`w-14 h-14 rounded-full border ${activeBelt.bgColor} ${activeBelt.borderColor} shadow-md`}></span>
                <div>
                  <h2 className="text-2xl font-black text-primary-navy font-display">{activeBelt.color}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{activeBelt.level} Ranking</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-martial-red border border-red-100 rounded-md text-[10px] font-black uppercase">
                <Award className="h-3.5 w-3.5" /> Promotion Required
              </div>
            </div>

            {/* Curriculum Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <BookOpen className="h-3.5 w-3.5 text-martial-red" /> Form (Poomsae)
                  </h4>
                  <p className="text-sm font-bold text-slate-800 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                    {activeBelt.poomsae}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <Shield className="h-3.5 w-3.5 text-martial-red" /> Stance & Kicking Skills
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Stances</p>
                      <div className="flex flex-wrap gap-1.5">
                        {activeBelt.stances.map((s) => (
                          <span key={s} className="text-xs bg-slate-50 text-slate-600 px-3 py-1 rounded-md border border-slate-100">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Kicks</p>
                      <div className="flex flex-wrap gap-1.5">
                        {activeBelt.kicks.map((k) => (
                          <span key={k} className="text-xs bg-slate-50 text-slate-600 px-3 py-1 rounded-md border border-slate-100">{k}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <Star className="h-3.5 w-3.5 text-martial-red" /> Character Tenet Focus
                  </h4>
                  <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 p-3.5 rounded-xl leading-relaxed">
                    {activeBelt.characterTrait}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Self-Defense (Hosinsool)</h5>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {activeBelt.selfDefense.map((sd) => (
                        <li key={sd} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                          <span>{sd}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Board Breaking (Kyokpa)</h5>
                    <p className="text-xs text-slate-600 bg-red-50/20 border border-red-100/40 p-2 rounded-xl">
                      {activeBelt.breakingRequirement || "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
