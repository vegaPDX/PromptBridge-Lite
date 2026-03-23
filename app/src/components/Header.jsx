import React from "react";
import { MessageSquare, BarChart3, HelpCircle } from "lucide-react";

export default function Header({ page, practicedPrinciples, onNavigate }) {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 font-serif font-bold text-stone-800 hover:text-indigo-600 transition-colors"
        >
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          PromptBridge
        </button>
        <nav className="flex items-center gap-1">
          <button
            onClick={() => onNavigate("scenarios")}
            aria-label="Scenarios"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              page === "scenarios" || page === "guided" || page === "freeform"
                ? "bg-indigo-50 text-indigo-700"
                : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
            }`}
          >
            Scenarios
          </button>
          <button
            onClick={() => onNavigate("progress")}
            aria-label="Progress"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              page === "progress"
                ? "bg-indigo-50 text-indigo-700"
                : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Progress
            {practicedPrinciples.length > 0 && (
              <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-semibold">
                {practicedPrinciples.length}/8
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigate("help")}
            className={`p-1.5 rounded-lg transition-colors ${
              page === "help"
                ? "bg-indigo-50 text-indigo-700"
                : "text-stone-400 hover:text-stone-600 hover:bg-stone-100"
            }`}
            aria-label="Help"
          >
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
