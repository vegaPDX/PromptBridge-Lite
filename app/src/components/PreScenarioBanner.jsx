import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function PreScenarioBanner({ onDismiss }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-6 flex items-center gap-3 animate-fadeIn">
      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
      <p className="text-stone-700 text-sm flex-1">
        Quick reminder: AI can sound confident and still be wrong. Always check important facts.
      </p>
      <button
        onClick={onDismiss}
        className="p-1 text-stone-400 hover:text-stone-600 transition-colors flex-shrink-0"
        aria-label="Dismiss reminder"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
