import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Shield, Target, Award, Users, BookOpen, Calendar, MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import HomeContactForm from "@/components/HomeContactForm";
import QuickTrialForm from "@/components/QuickTrialForm";

export const revalidate = 0; // Disable caching to ensure real-time updates

export default async function HomePage() {
  // Fetch programs, instructors, latest blogs, and gallery from the SQLite DB
  const programs = await prisma.program.findMany({ take: 3 });
  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    include: { profile: true },
    take: 2,
  });
  const blogs = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const gallery = await prisma.galleryItem.findMany({
    take: 4,
  });

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="relative bg-primary-navy py-32 md:py-48 overflow-hidden">
        {/* Background Overlay Decor */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#dc2626_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-martial-red/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent-gold/10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-martial-red/10 text-martial-red border border-martial-red/20 uppercase tracking-widest">
                👊 Lewisville's Premier Dojang
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-display">
                Become Strong.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-martial-red to-accent-gold">Build Confidence.</span><br />
                Build Character.
              </h1>
              <p className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0">
                Professional World Class Taekwondo training for toddlers, kids, youth, teens, and adults. Shaping minds and bodies for success.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/join"
                  className="bg-martial-red hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-red-950/30 text-center transition-all duration-200 hover:translate-y-[-2px]"
                >
                  🥋 Join Class
                </Link>
                <Link
                  href="/try-free"
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-full border border-slate-700 text-center transition-all duration-200 hover:translate-y-[-2px]"
                >
                  🎁 Try a Free Class
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-400 pt-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent-gold" />
                  <span>Kukkiwon Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent-gold" />
                  <span>All Ages & Skill Levels</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent-gold" />
                  <span>Olympic Style Sparring</span>
                </div>
              </div>
            </div>

            {/* Quick Trial Booking Widget */}
            <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2 text-center">Book a Free Trial Session</h3>
              <p className="text-slate-400 text-xs text-center mb-6">Start your martial arts journey today. No experience needed.</p>
              <QuickTrialForm />
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual Grid */}
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-martial-red/10 to-transparent rounded-3xl blur-2xl -z-10"></div>
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400"
                  alt="Adult training"
                  className="rounded-2xl shadow-md object-cover h-64 w-full"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400"
                  alt="Kids class"
                  className="rounded-2xl shadow-md object-cover h-48 w-full"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=400"
                  alt="Sparring"
                  className="rounded-2xl shadow-md object-cover h-48 w-full"
                />
                <div className="bg-primary-navy text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-64">
                  <div className="bg-martial-red/10 p-3 rounded-xl w-12 h-12 flex items-center justify-center">
                    <Award className="h-6 w-6 text-martial-red" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">20+</p>
                    <p className="text-xs text-slate-400">Years of Training Experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <span className="text-sm font-bold text-martial-red tracking-wider uppercase">About Our Academy</span>
              <h2 className="text-3xl sm:text-4xl font-black text-primary-navy font-display leading-tight">
                Where Discipline Meets Athletic Excellence
              </h2>
              <p className="text-slate-600 leading-relaxed">
                At Martial Arts Tae Kwon Do, we believe martial arts is more than kicking and punching—it is a foundation for lifelong growth. Located in Lewisville, Texas, our state-of-the-art dojang is a community hub where students learn focus, respect, and physical agility under the instruction of world-certified masters.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Whether you want to build bully-defense skills for your child, dynamic conditioning for yourself, or prepare for elite Olympic-style sparring tournaments, our customized programs support your goals.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-3">
                  <div className="text-martial-red bg-red-50 p-2 rounded-lg mt-0.5"><Shield className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-bold text-primary-navy text-sm">Self-Defense</h4>
                    <p className="text-xs text-slate-500">Practical defense techniques for all ages.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-martial-red bg-red-50 p-2 rounded-lg mt-0.5"><Target className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-bold text-primary-navy text-sm">Focus & Mindset</h4>
                    <p className="text-xs text-slate-500">Cultivating concentration and discipline.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 text-sm font-bold text-martial-red hover:text-red-700 transition-colors"
                >
                  Learn more about our legacy <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Programs Highlights */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Our Programs</span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary-navy font-display">
              Training Tailored For Every Age & Goal
            </h2>
            <p className="text-slate-500">
              We offer structured curriculum levels starting from age 3 to adults. Discover which class matches your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((prog) => (
              <div key={prog.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Styled program block header */}
                  <div className="bg-primary-navy p-6 text-white relative">
                    <span className="absolute top-4 right-4 bg-martial-red text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {prog.ageGroup}
                    </span>
                    <h3 className="text-lg font-bold group-hover:text-accent-gold transition-colors pt-2">{prog.name}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 line-clamp-3">{prog.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Benefits:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {prog.benefits.split(",").map((b: string) => (
                          <span key={b} className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100">
                            {b.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-50 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Tuition Rate</span>
                    <p className="text-lg font-black text-primary-navy">${prog.pricing}<span className="text-xs font-medium text-slate-400">/mo</span></p>
                  </div>
                  <Link
                    href={`/join?programId=${prog.id}`}
                    className="bg-slate-900 group-hover:bg-martial-red text-white text-xs font-bold px-5 py-3 rounded-full transition-all duration-300"
                  >
                    Join Class
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-12">
            <Link
              href="/programs"
              className="bg-slate-100 hover:bg-slate-200 text-primary-navy font-bold px-8 py-3.5 rounded-full text-sm transition-all"
            >
              Explore All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-24 bg-primary-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 w-96 h-96 bg-martial-red rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Why Choose Us</span>
              <h2 className="text-3xl sm:text-4xl font-black font-display leading-tight">
                More Than Just An Academy. We Are A Family.
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Our curriculum aligns physical techniques with character building. We focus heavily on building courtesy, integrity, perseverance, self-control, and an indomitable spirit.
              </p>
              <div className="pt-2">
                <Link
                  href="/schedule"
                  className="bg-martial-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-all inline-flex items-center gap-1.5"
                >
                  <Calendar className="h-4 w-4" /> View Weekly Class Schedule
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                <div className="text-accent-gold bg-slate-800 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><Shield className="h-5 w-5" /></div>
                <h4 className="text-base font-bold mb-2">Bully Prevention</h4>
                <p className="text-xs text-slate-400">Equipping children with the verbal confidence and de-escalation skills to handle schoolyard conflict.</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                <div className="text-accent-gold bg-slate-800 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><Target className="h-5 w-5" /></div>
                <h4 className="text-base font-bold mb-2">Goal-Oriented Progress</h4>
                <p className="text-xs text-slate-400">Structured belt tests motivate students to set and achieve progressive skill benchmarks.</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                <div className="text-accent-gold bg-slate-800 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><Users className="h-5 w-5" /></div>
                <h4 className="text-base font-bold mb-2">Community & Family</h4>
                <p className="text-xs text-slate-400">We host family nights, local tournaments, summer camps, and demonstrations in Lewisville.</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                <div className="text-accent-gold bg-slate-800 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><Award className="h-5 w-5" /></div>
                <h4 className="text-base font-bold mb-2">Olympic Conditioning</h4>
                <p className="text-xs text-slate-400">For students wanting to compete, we train with cutting-edge sparring and electronic scoring rules.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Belt Progression System Overview */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Belt Progression System</span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary-navy font-display">
              A Structured Roadmap to Black Belt
            </h2>
            <p className="text-slate-500">
              Students progress from beginner belt fundamentals to elite advanced black belt leadership roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Beginner */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-4 h-4 rounded-full border border-slate-200 bg-white"></span>
                <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
                <span className="w-4 h-4 rounded-full bg-orange-500"></span>
                <h4 className="font-bold text-sm text-primary-navy ml-auto">Beginner</h4>
              </div>
              <h3 className="font-bold text-base mb-2">White, Yellow, Orange</h3>
              <p className="text-xs text-slate-500 mb-4">Focuses on stances, simple blocks, punches, front kick, roundhouse kick, and basic discipline.</p>
              <ul className="text-xs text-slate-600 space-y-1.5 border-t border-slate-50 pt-3">
                <li>• Basic Bow & Stances</li>
                <li>• Front Kick (Ap Chagi)</li>
                <li>• Basic Blocks (High, Low)</li>
              </ul>
            </div>

            {/* Intermediate */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-4 h-4 rounded-full bg-green-500"></span>
                <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                <span className="w-4 h-4 rounded-full bg-purple-500"></span>
                <h4 className="font-bold text-sm text-primary-navy ml-auto">Intermediate</h4>
              </div>
              <h3 className="font-bold text-base mb-2">Green, Blue, Purple</h3>
              <p className="text-xs text-slate-500 mb-4">Focuses on sparring stances, side kick, back kick, Taegeuk Poomsae forms, and board breaking.</p>
              <ul className="text-xs text-slate-600 space-y-1.5 border-t border-slate-50 pt-3">
                <li>• Side Kick (Yeop Chagi)</li>
                <li>• Taegeuk 3, 4, 5 Forms</li>
                <li>• Sparring Introductions</li>
              </ul>
            </div>

            {/* Advanced */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-4 h-4 rounded-full bg-amber-800"></span>
                <span className="w-4 h-4 rounded-full bg-red-600"></span>
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-red-600 to-slate-900"></span>
                <h4 className="font-bold text-sm text-primary-navy ml-auto">Advanced</h4>
              </div>
              <h3 className="font-bold text-base mb-2">Brown, Red, Red Stripe</h3>
              <p className="text-xs text-slate-500 mb-4">Olympic sparring prep, complex kicking combinations, advanced forms, assistant teaching.</p>
              <ul className="text-xs text-slate-600 space-y-1.5 border-t border-slate-50 pt-3">
                <li>• Spinning Hook Kicks</li>
                <li>• Taegeuk 6, 7, 8 Forms</li>
                <li>• Speed & Board Breaking</li>
              </ul>
            </div>

            {/* Black Belt */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent-gold text-slate-900 text-[9px] font-black uppercase px-3 py-1 rounded-bl-lg">Elite</div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-4 h-4 rounded-full bg-slate-950"></span>
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-red-600 to-slate-950"></span>
                <h4 className="font-bold text-sm text-primary-navy ml-auto">Black Belt</h4>
              </div>
              <h3 className="font-bold text-base mb-2">1st – 9th Dan</h3>
              <p className="text-xs text-slate-500 mb-4">Elite level certifications, assistant teaching, leadership, complex self defense, weapons.</p>
              <ul className="text-xs text-slate-600 space-y-1.5 border-t border-slate-50 pt-3">
                <li>• Koryo & Black Belt Forms</li>
                <li>• Leadership & Teaching</li>
                <li>• Master Certifications</li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-10">
            <Link
              href="/belt-progression"
              className="text-sm font-bold text-martial-red hover:text-red-700 transition-colors inline-flex items-center gap-1"
            >
              Review all belt testing requirements <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Instructor Highlights */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Our Masters</span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary-navy font-display">
              Learn From Certified Black Belt Instructors
            </h2>
            <p className="text-slate-500">
              Our instructors hold international Kukkiwon certifications and have combined decades of coaching success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {instructors.map((inst) => (
              <div key={inst.id} className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden flex flex-col sm:flex-row items-center">
                <div className="w-full sm:w-1/2 h-64 relative bg-slate-200">
                  <img
                    src={
                      inst.profile?.firstName.includes("Ji-hoon")
                        ? "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400"
                        : "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=400"
                    }
                    alt={inst.profile?.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full sm:w-1/2 p-6 space-y-3">
                  <span className="text-[10px] font-black bg-martial-red/10 text-martial-red px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {inst.profile?.currentBelt}
                  </span>
                  <h3 className="text-lg font-bold text-primary-navy leading-tight">
                    {inst.profile?.firstName} {inst.profile?.lastName}
                  </h3>
                  <p className="text-xs text-slate-500">Certified Kukkiwon Coach</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dedicated to guiding students of all ages. Focused on form perfection and self-discipline.
                  </p>
                  <div className="pt-2 border-t border-slate-200/50 flex gap-4 text-xs text-slate-400">
                    <span>Active Coach</span>
                    <span>•</span>
                    <span>Lewisville Dojang</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Gallery Snippet */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Gallery</span>
              <h2 className="text-3xl sm:text-4xl font-black text-primary-navy font-display mt-2">
                Moments From The Dojang
              </h2>
            </div>
            <Link
              href="/gallery"
              className="bg-white hover:bg-slate-100 text-primary-navy border border-slate-200 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1"
            >
              View Full Gallery <ChevronRight className="h-4.5 w-4.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.length > 0 ? (
              gallery.map((item) => (
                <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square bg-slate-100 shadow-sm">
                  <img
                    src={item.url}
                    alt={item.title || "Gallery"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-xs font-bold text-white truncate">{item.title}</p>
                  </div>
                </div>
              ))
            ) : (
              // Fallback placeholders
              [1, 2, 3, 4].map((id) => (
                <div key={id} className="bg-white rounded-2xl border border-slate-100 aspect-square shadow-sm"></div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 8. Latest Blogs */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Latest Articles</span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary-navy font-display">
              Insights From Our Instructors
            </h2>
            <p className="text-slate-500">
              Read tips on training at home, child discipline, stretching guides, and updates on tournament rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((b) => (
              <article key={b.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between">
                <div>
                  <div className="h-48 bg-slate-100 relative">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-primary-navy text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {b.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <h3 className="text-base font-bold text-primary-navy group-hover:text-martial-red leading-snug">
                      <Link href={`/blog/${b.slug}`} className="hover:text-martial-red">
                        {b.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3">{b.summary}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 border-t border-slate-50 mt-4">
                  <Link
                    href={`/blog/${b.slug}`}
                    className="text-xs font-bold text-martial-red hover:text-red-700 inline-flex items-center gap-1.5"
                  >
                    Read Full Article <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Contact & Google Map */}
      <section id="contact" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Info and Map */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Contact Academy</span>
                <h2 className="text-3xl font-black text-primary-navy font-display mt-2 leading-tight">
                  Reach Out To Us
                </h2>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Have questions about trial classes, family plans, or billing? Visit us at our Lewisville Dojang or drop us a message.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-4">
                  <div className="text-martial-red bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-bold text-primary-navy">Academy Address</h4>
                    <p className="text-slate-500 text-xs mt-0.5">2154 S State Hwy 121, Suite 600, Lewisville, TX 75067</p>
                    <a
                      href="https://maps.google.com/?q=2154+S+State+Hwy+121+Suite+600+Lewisville+TX+75067"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-martial-red hover:underline mt-1"
                    >
                      Get Directions Button
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-martial-red bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm"><Phone className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-bold text-primary-navy">Call/Text Us</h4>
                    <p className="text-slate-500 text-xs mt-0.5">972-555-0199</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-martial-red bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm"><Mail className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-bold text-primary-navy">Email Address</h4>
                    <p className="text-slate-500 text-xs mt-0.5">info@martialartstkd.com</p>
                  </div>
                </div>
              </div>

              {/* Map Embed (Lewisville Location placeholder or iframe) */}
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3342.3486338874623!2d-96.99446262444391!3d33.05389657354921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c2438316279f3%3A0xe510f8c772c96c42!2s2154%20S%20State%20Hwy%20121%20%23600%2C%20Lewisville%2C%20TX%2075067!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Academy Location Map"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white border border-slate-100 p-8 md:p-10 rounded-3xl shadow-sm">
              <h3 className="text-xl font-bold text-primary-navy mb-2">Send Us A Message</h3>
              <p className="text-slate-500 text-xs mb-6">We will get back to you within 24 business hours.</p>
              <HomeContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
