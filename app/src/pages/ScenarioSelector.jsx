import React, { useState } from "react";
import { Check, BookOpen, PenTool, Sparkles, X, MessageSquare, RefreshCw } from "lucide-react";
import { groupBy } from "lodash-es";
import { GUIDED_SCENARIOS, FREEFORM_SCENARIOS } from "../data/scenarios";
import { CATEGORIES } from "../data/categories";
import { PRINCIPLE_MAP } from "../data/principles";
import { resolveIcon } from "../data/icon-map";
import { getRecommendedScenarios } from "../services/recommendations";
import { hasApiKey } from "../services/llm";

const CONTEXT_PILLS = [
  { label: "Work emails & docs", tags: ["work"] },
  { label: "Coding & tech", tags: ["coding"] },
  { label: "School & learning", tags: ["school"] },
  { label: "Personal projects", tags: ["personal"] },
  { label: "A bit of everything", tags: ["work", "coding", "school", "personal", "other"] },
];

function getMatchingTags(userContext) {
  const pill = CONTEXT_PILLS.find(p => p.label === userContext);
  return pill ? pill.tags : [];
}

export default function ScenarioSelector({ onSelectScenario, completedScenarios, practicedPrinciples = [], userContext, onSetUserContext }) {
  const [activeTab, setActiveTab] = useState("guided");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const scenarios = activeTab === "guided" ? GUIDED_SCENARIOS : activeTab === "freeform" ? FREEFORM_SCENARIOS : GUIDED_SCENARIOS;

  // Sort scenarios by relevance match within each category group
  const matchingTags = userContext ? getMatchingTags(userContext) : [];
  const sortedScenarios = userContext
    ? [...scenarios].sort((a, b) => {
        const aMatch = (a.relevance || []).some(r => matchingTags.includes(r)) ? 1 : 0;
        const bMatch = (b.relevance || []).some(r => matchingTags.includes(r)) ? 1 : 0;
        return bMatch - aMatch;
      })
    : scenarios;

  const grouped = groupBy(sortedScenarios, "category");

  const recommendedIds = new Set(
    getRecommendedScenarios(practicedPrinciples, completedScenarios, scenarios, 3)
      .map(r => r.scenario.id)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Choose a Scenario</h1>
      <p className="text-stone-500 mb-6">Pick a situation and practice talking to AI effectively.</p>

      {/* Onboarding banner */}
      {!userContext && !bannerDismissed && (
        <div className="relative bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6">
          <button
            onClick={() => setBannerDismissed(true)}
            className="absolute top-2 right-2 p-1 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="font-semibold text-stone-700 mb-3">What do you use AI for?</p>
          <div className="flex flex-wrap gap-2">
            {CONTEXT_PILLS.map(pill => (
              <button
                key={pill.label}
                onClick={() => onSetUserContext(pill.label)}
                className="px-4 py-2 bg-white border border-indigo-200 rounded-full text-sm font-medium text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("guided")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "guided"
              ? "bg-indigo-600 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          Guided Practice
        </button>
        <button
          onClick={() => setActiveTab("freeform")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "freeform"
              ? "bg-indigo-600 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <PenTool className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          Write Your Own
        </button>
        <button
          onClick={() => setActiveTab("hybrid")}
          disabled={!hasApiKey()}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "hybrid"
              ? "bg-indigo-600 text-white"
              : hasApiKey()
                ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                : "bg-stone-100 text-stone-300 cursor-not-allowed"
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          Write First
          {!hasApiKey() && <span className="text-xs ml-1 opacity-60">(API key)</span>}
        </button>
      </div>

      {/* Scenario cards grouped by category */}
      {Object.entries(grouped).map(([catKey, catScenarios]) => {
        const cat = CATEGORIES[catKey];
        if (!cat) return null;
        const CatIcon = resolveIcon(cat.icon);
        return (
          <section key={catKey} aria-labelledby={`cat-${catKey}`} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              {CatIcon && <CatIcon className="w-5 h-5 text-stone-400" />}
              <h2 id={`cat-${catKey}`} className="font-serif text-lg font-semibold text-stone-700">{cat.label}</h2>
            </div>
            <p className="text-stone-500 text-sm mb-4">{cat.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catScenarios.map(scenario => {
                const isCompleted = completedScenarios.includes(scenario.id);
                const isRecommended = recommendedIds.has(scenario.id);
                return (
                  <button
                    key={scenario.id}
                    onClick={() => onSelectScenario(scenario, activeTab === "hybrid" ? "hybrid" : undefined)}
                    className={`text-left bg-white rounded-xl border p-4 hover:border-indigo-300 hover:shadow-md transition-all group ${
                      isRecommended && !isCompleted ? "border-indigo-200" : "border-stone-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h3 className="font-semibold text-stone-800 group-hover:text-indigo-700 transition-colors text-sm">
                          {scenario.title}
                        </h3>
                        {isRecommended && !isCompleted && (
                          <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full font-medium flex-shrink-0 inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Next
                          </span>
                        )}
                      </div>
                      {isCompleted && (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-500" />
                        </div>
                      )}
                    </div>
                    <p className="text-stone-500 text-xs mb-3 line-clamp-2">{scenario.situation}</p>
                    <div className="flex flex-wrap gap-1">
                      {scenario.principles.map(pid => (
                        <span key={pid} className="text-xs px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded font-medium">
                          {PRINCIPLE_MAP[pid]?.name}
                        </span>
                      ))}
                    </div>
                    {scenario.multiTurnEligible && hasApiKey() && activeTab === "guided" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectScenario(scenario, "multiturn");
                        }}
                        className="mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full hover:bg-amber-100 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" /> Practice iterating
                      </button>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
