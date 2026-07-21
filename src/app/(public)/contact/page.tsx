import HomeContactForm from "@/components/HomeContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Find Us</span>
          <h1 className="text-4xl font-black text-primary-navy font-display">Contact Our Academy</h1>
          <p className="text-slate-500 text-xs">
            Have questions about registration, class curriculum, or billing? Reach out to us or visit our Lewisville location.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          {/* Column 1: Info and Map */}
          <div className="lg:col-span-5 space-y-8">
            {/* Contact details */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-primary-navy border-b border-slate-100 pb-3">Contact Details</h3>
              <ul className="text-sm space-y-4">
                <li className="flex items-start gap-3.5">
                  <MapPin className="h-5 w-5 text-martial-red flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800">Dojang Location</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      2154 S State Hwy 121, Suite 600<br />
                      Lewisville, TX 75067
                    </p>
                    <a
                      href="https://maps.google.com/?q=2154+S+State+Hwy+121+Suite+600+Lewisville+TX+75067"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-martial-red hover:underline mt-1.5"
                    >
                      Get Directions Button
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5 border-t border-slate-50 pt-4">
                  <Phone className="h-5 w-5 text-martial-red flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800">Phone Number</h4>
                    <p className="text-xs text-slate-500 mt-0.5">972-555-0199</p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5 border-t border-slate-50 pt-4">
                  <Mail className="h-5 w-5 text-martial-red flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800">Email Address</h4>
                    <p className="text-xs text-slate-500 mt-0.5">info@martialartstkd.com</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-primary-navy border-b border-slate-100 pb-3 flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-accent-gold" /> Opening Hours
              </h3>
              <div className="text-xs space-y-2 text-slate-500">
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span>Monday</span>
                  <span className="text-slate-800 font-medium">3:30 PM – 8:30 PM</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span>Tuesday</span>
                  <span className="text-slate-800 font-medium">3:30 PM – 8:30 PM</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span>Wednesday</span>
                  <span className="text-slate-800 font-medium">3:30 PM – 8:30 PM</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span>Thursday</span>
                  <span className="text-slate-800 font-medium">3:30 PM – 8:30 PM</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span>Friday</span>
                  <span className="text-slate-800 font-medium">3:30 PM – 8:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span>Saturday</span>
                  <span className="text-slate-800 font-medium">9:00 AM – 1:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-rose-600 font-bold">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Form & Map embed */}
          <div className="lg:col-span-7 space-y-6">
            {/* Map Embed */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-200 h-64 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3342.3486338874623!2d-96.99446262444391!3d33.05389657354921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c2438316279f3%3A0xe510f8c772c96c42!2s2154%20S%20State%20Hwy%20121%20%23600%2C%20Lewisville%2C%20TX%2075067!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dojang Map Location"
              ></iframe>
            </div>

            {/* Contact Form card */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
              <h3 className="text-lg font-bold text-primary-navy mb-1.5">Send a Message</h3>
              <p className="text-slate-400 text-xs mb-6">Drop us a line and our administrative staff will respond to you shortly.</p>
              <HomeContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
