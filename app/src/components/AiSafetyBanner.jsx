import React from "react";
import { Sparkles, AlertTriangle, MessageSquare, X } from "lucide-react";

const FACTS = [
  {
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-50",
    text: "AI sounds equally confident whether it's right or wrong. Always check important facts.",
  },
  {
    icon: MessageSquare,
    color: "text-rose-500",
    bg: "bg-rose-50",
    text: "AI is trained to agree with you — it sometimes confirms your mistakes rather than correcting them.",
  },
  {
    icon: Sparkles,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    text: "About 60% of AI frustrations come from how you talk to it — and that's exactly what you'll practice here.",
  },
];

export default function AiSafetyBanner({ onDismiss }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm mx-4 mb-6 overflow-hidden animate-fadeIn">
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-800">
              Welcome to PromptBridge
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              3 things most people don't know about AI
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 text-stone-400 hover:text-stone-600 transition-colors -mt-1 -mr-1"
            aria-label="Dismiss welcome banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {FACTS.map((fact, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${fact.bg} flex items-center justify-center flex-shrink-0`}>
                <fact.icon className={`w-4 h-4 ${fact.color}`} />
              </div>
              <p className="text-stone-700 text-sm leading-relaxed pt-1">{fact.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-5 pt-2">
        <button
          onClick={onDismiss}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors text-sm"
        >
          Got it, let's start learning
        </button>
      </div>
    </div>
  );
}
