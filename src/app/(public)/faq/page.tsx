"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "What age groups do you accept for classes?",
      a: "We accept students starting from age 3. Our Tiny Tigers program is specifically designed for toddlers aged 3 to 5. Kids Taekwondo covers ages 6 to 12. Teen classes cover ages 13 to 17, and our Adult classes are for ages 18 and up.",
    },
    {
      q: "Do I need any prior martial arts experience?",
      a: "Absolutely not! Over 90% of our new students start with zero martial arts experience. Our beginner classes and free trial sessions are designed to teach you the fundamentals at a comfortable, step-by-step pace.",
    },
    {
      q: "What should I wear to my free trial class?",
      a: "You do not need a special Taekwondo uniform (Dobok) for the trial class. Simply wear comfortable, loose-fitting athletic clothing (like t-shirt and sweatpants) and bring a water bottle. We train barefoot on safety-padded mats.",
    },
    {
      q: "How often do belt testings happen?",
      a: "Belt promotions usually occur every 3 to 4 months. Students are recommended for testing by their instructors once they have completed the minimum attendance requirements and demonstrated proficiency in their rank curriculum (stances, kicks, blocks, and forms).",
    },
    {
      q: "Do you offer family discounts?",
      a: "Yes! We have a popular 'Family Package Plan' which offers discounted rates when two or more members of the same household register. It is a fantastic way for parents and kids to bond and get fit together.",
    },
    {
      q: "What happens if I miss a scheduled class?",
      a: "We offer makeup classes! Students can attend alternative class times within their same age group or program during the same month. Simply notify the front desk or update your attendance preferences on your student dashboard.",
    },
    {
      q: "Is Taekwondo safe for children?",
      a: "Safety is our absolute priority. Our dojang is fully padded with high-density foam mats, and sparring is only performed with full protective gear (headgear, chest protector, forearm and shin guards) under the strict supervision of certified black belt instructors.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Help Center</span>
          <h1 className="text-4xl font-black text-primary-navy font-display">Frequently Asked Questions</h1>
          <p className="text-slate-500">
            Got questions about gear, testing schedules, or billing? Browse our common answers below or get in touch with our staff.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-slate-50/50"
                >
                  <span className="font-bold text-primary-navy text-sm sm:text-base flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-martial-red flex-shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-50/50 pl-14">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
