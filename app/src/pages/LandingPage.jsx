import React, { useState } from "react";
import {
  ChevronRight, Check, X, Lightbulb, ExternalLink, HelpCircle,
} from "lucide-react";
import { PRINCIPLES } from "../data/principles";
import {
  DEMO_BAD_PROMPT, DEMO_BAD_RESPONSE,
  DEMO_GOOD_PROMPT, DEMO_GOOD_RESPONSE,
} from "../data/demo";
import { resolveIcon } from "../data/icon-map";
import MarkdownText from "../components/MarkdownText";

export default function LandingPage({ onNavigate }) {
  const [showGood, setShowGood] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Help button — upper right */}
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={() => onNavigate("help")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-stone-500 hover:text-indigo-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          Help
        </button>
      </div>

      {/* Hero */}
      <div className="text-center pt-4 pb-10 px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-800 mb-4">
          Learn to talk to AI
        </h1>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
          The way you phrase your request changes everything.
          <br className="hidden md:block" />
          See the difference in 5 seconds.
        </p>
      </div>

      {/* Snow Shoveling Demo */}
      <div className="px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="bg-stone-50 px-6 py-3 border-b border-stone-200">
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">
              Same question, two different ways
            </p>
          </div>

          <div className="p-6">
            {/* Bad example -- always visible */}
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div>
                  <p className="text-stone-800 font-medium italic">"{DEMO_BAD_PROMPT}"</p>
                </div>
              </div>
              <div className="ml-9 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
                <p className="text-stone-600 text-sm">
                  <span className="text-rose-400 text-xs font-medium mr-2">AI:</span>
                  {DEMO_BAD_RESPONSE}
                </p>
              </div>
            </div>

            {/* Reveal button */}
            {!showGood && (
              <button
                onClick={() => setShowGood(true)}
                className="w-full py-3 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-sm font-medium"
              >
                Now see what happens with a better request &rarr;
              </button>
            )}

            {/* Good example -- revealed */}
            {showGood && (
              <div className="animate-fadeIn">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-stone-800 font-medium italic">"{DEMO_GOOD_PROMPT}"</p>
                  </div>
                </div>
                <div className="ml-9 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
                  <div className="text-stone-600 text-sm">
                    <span className="text-emerald-500 text-xs font-medium mr-2">AI:</span>
                    <MarkdownText text={DEMO_GOOD_RESPONSE} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insight callout */}
      {showGood && (
        <div className="px-4 mb-8 animate-fadeIn">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
            <Lightbulb className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <p className="text-stone-700 text-sm max-w-xl mx-auto">
              <strong>Same topic. Wildly different results.</strong> The first question can be answered with one word. The second tells the AI exactly what you need — and it delivers.
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center px-4 pb-12">
        <button
          onClick={() => onNavigate("scenarios")}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-colors text-lg"
        >
          Try It Yourself <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-stone-500 text-sm mt-3">
          Interactive scenarios that build real skills
        </p>
        <p className="text-stone-400 text-xs mt-4 max-w-md mx-auto">
          AI tools are powerful but not perfect — they can sound confident even when wrong.{" "}
          <button
            onClick={() => onNavigate("help")}
            className="text-indigo-500 hover:text-indigo-700 underline"
          >
            Learn how to verify what you get back
          </button>
        </p>
      </div>

      {/* What you'll learn */}
      <div className="px-4 pb-12">
        <h2 className="font-serif text-2xl font-bold text-stone-800 text-center mb-6">
          8 skills that work with any AI
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRINCIPLES.map(p => {
            const Icon = resolveIcon(p.icon);
            return (
              <div key={p.id} className="flex items-start gap-3 bg-white rounded-xl border border-stone-200 p-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
                </div>
                <div>
                  <p className="font-medium text-stone-700 text-sm">{p.name}</p>
                  <p className="text-stone-500 text-xs mt-0.5">{p.description}</p>
                  {p.learnMoreUrl && (
                    <a
                      href={p.learnMoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-500 hover:text-indigo-700 text-xs mt-1.5 transition-colors"
                    >
                      {p.learnMoreLabel || "Learn more"}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
