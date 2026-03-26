import React, { useState } from "react";
import {
  ChevronRight, Check, X, Lightbulb, ExternalLink, HelpCircle, AlertTriangle,
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
      {/* Top nav — upper right */}
      <div className="flex justify-end gap-1 px-4 pt-4">
        <button
          onClick={() => onNavigate("ai-safety")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-stone-500 hover:text-amber-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          AI Limits
        </button>
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
        <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Tired of generic AI responses? What you say determines what you get back.
          <br className="hidden md:block" />
          See the difference in 5 seconds.
        </p>
      </div>

      {/* Snow Shoveling Demo */}
      <div className="px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="bg-stone-50 px-6 py-3 border-b border-stone-200">
            <p className="text-xs text-stone-600 font-medium uppercase tracking-wide">
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
                <p className="text-stone-700 text-sm leading-relaxed">
                  <span className="text-rose-500 text-xs font-medium mr-2">AI:</span>
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
                  <div className="text-stone-700 text-sm leading-relaxed">
                    <span className="text-emerald-600 text-xs font-medium mr-2">AI:</span>
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
            <Lightbulb className="w-5 h-5 text-amber-500 mx-auto mb-2" aria-hidden="true" />
            <p className="text-stone-700 text-base max-w-xl mx-auto">
              <strong>Same topic. Wildly different results.</strong> The first question gets a one-word answer. The second tells AI exactly what you need — and it actually delivers.
            </p>
          </div>
        </div>
      )}

      {/* Research stat */}
      {showGood && (
        <div className="px-4 mb-8 animate-fadeIn">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
            <p className="text-stone-700 text-base">
              How you talk to AI really matters — giving it an example of what you want
              can improve accuracy from <strong className="text-indigo-600">0% to 90%</strong>.
            </p>
            <p className="text-stone-500 text-xs mt-1">
              Based on peer-reviewed AI communication research
            </p>
          </div>
        </div>
      )}

      {/* AI honesty section */}
      {showGood && (
        <div className="px-4 mb-8 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">
              We believe in being honest about AI
            </h2>
            <p className="text-stone-600 text-sm mb-4">
              AI is a powerful tool — but like any tool, it works better when you know its limits.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <p className="text-stone-700 text-sm leading-relaxed pt-0.5">
                  <strong>AI makes things up.</strong> It can generate statistics, citations, and URLs that don't exist — and it sounds equally confident whether it's right or wrong.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <p className="text-stone-700 text-sm leading-relaxed pt-0.5">
                  <strong>AI tells you what you want to hear.</strong> It's trained to agree with you — even when you're wrong.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <p className="text-stone-700 text-sm leading-relaxed pt-0.5">
                  <strong>How you talk to AI really matters.</strong> About 60% of frustrations come from communication gaps — and that's exactly what you'll practice here.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("ai-safety")}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              Learn more about AI limitations <ChevronRight className="w-4 h-4" />
            </button>
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
        <p className="text-stone-600 text-sm mt-3">
          Hands-on practice that works with any AI tool
        </p>
      </div>

      {/* What you'll learn */}
      <div className="px-4 pb-12">
        <h2 className="font-serif text-2xl font-bold text-stone-800 text-center mb-6">
          {PRINCIPLES.length} ways to stop getting generic AI slop
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
                  <p className="font-medium text-stone-800 text-sm">{p.name}</p>
                  <p className="text-stone-600 text-sm mt-0.5 leading-snug">{p.description}</p>
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
