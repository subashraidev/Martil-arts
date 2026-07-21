import { Shield, Award, Users, Target, BookOpen, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Our Legacy</span>
          <h1 className="text-4xl font-black text-primary-navy font-display">About Martial Arts Tae Kwon Do</h1>
          <p className="text-slate-500">
            Learn about our founding principles, Kukkiwon certified teaching staff, and our dedication to building character in Lewisville, Texas.
          </p>
        </div>

        {/* Section 1: Main Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-primary-navy font-display">Shaping Leaders Since 2006</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Martial Arts Tae Kwon Do was established with a singular mission: to provide high-quality, authentic Korean martial arts training that fosters physical strength, mental clarity, and moral character.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Under the guidance of Grand Master Kim, we have graduated hundreds of black belts who have gone on to become academic scholars, community leaders, and national-level sparring competitors. Our academy is affiliated with the World Taekwondo Headquarters (Kukkiwon) in Seoul, South Korea, ensuring that your rank is recognized globally.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Our training environment focuses on cooperative support. Higher ranks mentor lower ranks, children learn respect and courtesy, and adults find a rigorous workout paired with practical self-defense techniques.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden aspect-video shadow-xl relative bg-slate-200">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
              alt="Dojang Training Group"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Section 2: The Tenets */}
        <div className="bg-primary-navy text-white rounded-3xl p-8 md:p-12 mb-20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-5 w-96 h-96 bg-martial-red rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-martial-red tracking-wider uppercase">Our Philosophy</span>
              <h2 className="text-2xl md:text-3xl font-black font-display text-white">The Five Tenets of Taekwondo</h2>
              <p className="text-slate-400 text-xs">These values serve as the core moral guide for every student in our dojang.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 text-center">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                <h4 className="text-base font-black text-accent-gold mb-1 font-display">Courtesy</h4>
                <p className="text-[10px] text-slate-400">Ye Ui</p>
                <p className="text-xs text-slate-300 mt-3">Showing respect, bowing, and treating everyone with politeness.</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                <h4 className="text-base font-black text-accent-gold mb-1 font-display">Integrity</h4>
                <p className="text-[10px] text-slate-400">Yeom Chi</p>
                <p className="text-xs text-slate-300 mt-3">Distinguishing right from wrong; training honestly with oneself.</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                <h4 className="text-base font-black text-accent-gold mb-1 font-display">Perseverance</h4>
                <p className="text-[10px] text-slate-400">In Nae</p>
                <p className="text-xs text-slate-300 mt-3">Never giving up; persisting through challenging tasks.</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                <h4 className="text-base font-black text-accent-gold mb-1 font-display">Self-Control</h4>
                <p className="text-[10px] text-slate-400">Geuk Gi</p>
                <p className="text-xs text-slate-300 mt-3">Controlling power during sparring and emotions in conflict.</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                <h4 className="text-base font-black text-accent-gold mb-1 font-display">Spirit</h4>
                <p className="text-[10px] text-slate-400">Baekjul Boolgool</p>
                <p className="text-xs text-slate-300 mt-3">Indomitable courage; standing up for justice without fear.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Pillars of training */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Pillars of Growth</span>
          <h2 className="text-2xl md:text-3xl font-black text-primary-navy font-display">What We Cultivate</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-start gap-4">
            <div className="bg-red-50 text-martial-red p-3 rounded-2xl"><Shield className="h-6 w-6" /></div>
            <div>
              <h3 className="font-bold text-base text-primary-navy">Physical Fitness</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Improve core strength, cardiovascular endurance, agility, and flexibility through high-energy kicking drills and structured exercises.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-start gap-4">
            <div className="bg-red-50 text-martial-red p-3 rounded-2xl"><Target className="h-6 w-6" /></div>
            <div>
              <h3 className="font-bold text-base text-primary-navy">Mental Discipline</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Cultivate unshakeable focus, self-discipline, and stress-release strategies that translate directly to academic and career success.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-start gap-4">
            <div className="bg-red-50 text-martial-red p-3 rounded-2xl"><Heart className="h-6 w-6" /></div>
            <div>
              <h3 className="font-bold text-base text-primary-navy">Character Excellence</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Build courtesy, integrity, respect for parents/teachers, and leadership skills that empower students to become moral role models.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
