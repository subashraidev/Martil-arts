import { Calendar, MapPin, Clock, Award, Shield } from "lucide-react";

export default function EventsPage() {
  const events = [
    {
      title: "July Belt Promotion Testing",
      description: "Rank advancement exam for White through Red belts. Candidates must have pre-approval signature sheets submitted.",
      date: "Saturday, July 25, 2026",
      time: "2:00 PM – 5:30 PM",
      location: "Lewisville Main Dojang",
      type: "Belt Test",
      badgeBg: "bg-martial-red/10 text-martial-red border-martial-red/20",
    },
    {
      title: "North Texas Tae Kwon Do Championship",
      description: "Olympic-style sparring and Poomsae forms tournament. Open to all ranks and ages. Registration required by July 28th.",
      date: "Saturday, August 8, 2026",
      time: "8:00 AM – 6:00 PM",
      location: "Lewisville High School Gymnasium",
      type: "Tournament",
      badgeBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    {
      title: "Youth Summer Leadership Camp",
      description: "Five days of advanced weapons, kicking drills, self-defense, and character leadership lectures. Ages 7-14.",
      date: "August 10 – August 14, 2026",
      time: "9:00 AM – 3:00 PM Daily",
      location: "Lewisville Main Dojang",
      type: "Camp",
      badgeBg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      title: "Adult Self Defense Seminar",
      description: "Specialized workshop focusing on street self-defense, grabbing escapes, situational awareness, and pressure points.",
      date: "Friday, August 21, 2026",
      time: "6:30 PM – 8:30 PM",
      location: "Lewisville Main Dojang",
      type: "Seminar",
      badgeBg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Academy Events</span>
          <h1 className="text-4xl font-black text-primary-navy font-display">Upcoming Events & Tournaments</h1>
          <p className="text-slate-500 text-xs">
            Mark your calendar for our upcoming belt promotion testings, local sparring tournaments, summer training camps, and guest seminars.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {events.map((event) => (
            <div
              key={event.title}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border ${event.badgeBg}`}>
                    {event.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-accent-gold" /> {event.time}
                  </span>
                </div>

                <h3 className="text-xl font-black text-primary-navy font-display leading-tight">{event.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{event.description}</p>
              </div>

              <div className="border-t border-slate-50 pt-6 mt-6 space-y-3.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
