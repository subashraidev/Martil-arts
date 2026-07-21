import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function LayoutFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-navy text-slate-300 border-t border-slate-900">
      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand & Desc */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white tracking-tight">
              🥋 MARTIAL ARTS <span className="text-martial-red">TKD</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Modern Tae Kwon Do academy in Lewisville, Texas, dedicated to building strength, character, and confidence. Join our family today and unlock your potential.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors text-slate-400" aria-label="Facebook">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors text-slate-400" aria-label="Instagram">
                <svg className="h-5 w-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors text-slate-400" aria-label="Youtube">
                <svg className="h-5 w-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Hours */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base flex items-center">
              <Clock className="h-4 w-4 mr-2 text-accent-gold" />
              Opening Hours
            </h4>
            <div className="text-sm space-y-2 text-slate-400">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span>Mon – Thu</span>
                <span className="text-white">3:30 PM – 8:30 PM</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span>Friday</span>
                <span className="text-white">3:30 PM – 8:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span>Saturday</span>
                <span className="text-white">9:00 AM – 1:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="text-red-400 font-medium">Closed</span>
              </div>
            </div>
          </div>

          {/* Column 3: Navigation */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/programs" className="hover:text-accent-gold transition-colors text-slate-400">Our Programs</Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-accent-gold transition-colors text-slate-400">Weekly Schedule</Link>
              </li>
              <li>
                <Link href="/belt-progression" className="hover:text-accent-gold transition-colors text-slate-400">Belt System</Link>
              </li>
              <li>
                <Link href="/instructors" className="hover:text-accent-gold transition-colors text-slate-400">Instructors</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-accent-gold transition-colors text-slate-400">Gallery</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent-gold transition-colors text-slate-400">Academy Blog</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-accent-gold" />
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 text-slate-500 mt-0.5 flex-shrink-0" />
                <span>
                  2154 S State Hwy 121, Suite 600<br />
                  Lewisville, TX 75067
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-slate-500 flex-shrink-0" />
                <a href="tel:9725550199" className="hover:text-white transition-colors">972-555-0199</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-slate-500 flex-shrink-0" />
                <a href="mailto:info@martialartstkd.com" className="hover:text-white transition-colors">info@martialartstkd.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950/60 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {currentYear} Martial Arts Tae Kwon Do. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
