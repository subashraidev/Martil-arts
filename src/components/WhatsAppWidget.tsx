"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";

export default function WhatsAppWidget() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tool tip after 3 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2 pointer-events-none">
      {showTooltip && (
        <div className="bg-white text-slate-800 text-sm font-medium px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-start space-x-3 pointer-events-auto animate-bounce max-w-xs">
          <div className="flex-1">
            <p className="font-bold text-xs text-green-600 mb-0.5">WhatsApp Chat</p>
            <p className="text-slate-600 text-xs">Hi! Have any questions about our Taekwondo classes? Ask us here!</p>
          </div>
          <button 
            onClick={() => setShowTooltip(false)} 
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <a
        href="https://wa.me/19725550199" // Seeding number
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center pointer-events-auto transform hover:scale-110 active:scale-95 transition-all duration-200"
        title="Chat on WhatsApp"
        onClick={() => setShowTooltip(false)}
      >
        {/* Simple WhatsApp SVG Icon */}
        <svg
          className="h-6 w-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.161.001 6.136 1.233 8.375 3.474 2.238 2.24 3.467 5.218 3.465 8.385-.005 6.537-5.329 11.86-11.859 11.86-2.007-.001-3.98-.513-5.736-1.489L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.277.002 9.57-4.287 9.574-9.564.002-2.556-1.002-4.959-2.83-6.782C16.29 2.435 13.9 1.432 11.857 1.432c-5.28 0-9.576 4.29-9.58 9.568-.002 1.61.474 3.178 1.38 4.568l-.986 3.606 3.702-.97z" />
        </svg>
      </a>
    </div>
  );
}
