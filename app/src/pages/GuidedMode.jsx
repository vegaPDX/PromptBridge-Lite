import React, { useState, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, MessageSquare, Lightbulb, RefreshCw,
  PenTool, Send, Check, ChevronDown,
} from "lucide-react";
import { loadGuidedContent } from "../services/guided-data";
import { hasApiKey, analyzeFreeform, simulateResponses } from "../services/llm";
import { scorePrompt } from "../services/heuristic-scorer";
import { PRINCIPLE_MAP } from "../data/principles";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import PrincipleBadge from "../components/PrincipleBadge";
import ResponseComparison from "../components/ResponseComparison";
import CopyButton from "../components/CopyButton";
import MarkdownText from "../components/MarkdownText";

import { GUIDED_SCENARIOS } from "../data/scenarios";
import { getRecommendedScenarios, buildRecommendation } from "../services/recommendations";

export default function GuidedMode({ scenario, onComplete, onBack, practicedPrinciples = [], completedScenarios = [] }) {
  const [step, setStep] = useState("loading"); // loading | explore | try-yourself | try-loading | try-results
  const [content, setContent] = useState(null); // { options, responses, feedback }
  const [error, setError] = useState(null);
  const [expandedTier, setExpandedTier] = useState("weak");

  // Try It Yourself state
  const [tryPrompt, setTryPrompt] = useState("");
  const [tryAnalysis, setTryAnalysis] = useState(null);
  const [tryResponses, setTryResponses] = useState(null);
  const [tryHeuristic, setTryHeuristic] = useState(null);

  // Load pre-generated content on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStep("loading");
      setError(null);
      try {
        const data = await loadGuidedContent(scenario.id);
        if (cancelled) return;
        setContent(data);
        setStep("explore");
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [scenario]);

  const retryFromError = () => {
    setError(null);
    setStep("loading");
    loadGuidedContent(scenario.id)
      .then(data => {
        setContent(data);
        setStep("explore");
      })
      .catch(e => setError(e.message));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to scenarios
      </button>

      {/* Scenario header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-indigo-500" />
          <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Guided Practice</span>
        </div>
        <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">{scenario.title}</h2>
        <p className="text-stone-600 text-sm">{scenario.situation}</p>
      </div>

      {/* Error state */}
      {error && <div className="mb-6"><ErrorBanner message={error} onRetry={retryFromError} /></div>}

      {/* Step: Loading */}
      {step === "loading" && !error && (
        <LoadingSpinner message="Loading scenario..." />
      )}

      {/* Step: Explore */}
      {step === "explore" && content && (
        <div className="animate-fadeIn">
          {/* Collapsible prompt + response accordion */}
          <h3 className="font-semibold text-stone-700 mb-3">Compare three approaches to this scenario</h3>
          <p className="text-stone-500 text-sm mb-4">Click each tier to see the prompt and what the AI gives back.</p>
          <div className="space-y-3">
            {[
              { key: "weak", label: "Weak", quality: "weak", response: content.responses.response_weak,
                icon: <span className="text-rose-500 text-sm font-bold">&times;</span>,
                colors: { border: "border-rose-200", bg: "bg-rose-50", headerBg: "bg-rose-50", headerText: "text-rose-700", iconBg: "bg-rose-100", responseBorder: "border-rose-100", responseFrom: "from-rose-50" } },
              { key: "medium", label: "Getting There", quality: "medium", response: content.responses.response_medium,
                icon: <ArrowRight className="w-4 h-4 text-amber-500" />,
                colors: { border: "border-amber-200", bg: "bg-amber-50", headerBg: "bg-amber-50", headerText: "text-amber-700", iconBg: "bg-amber-100", responseBorder: "border-amber-100", responseFrom: "from-amber-50" } },
              { key: "strong", label: "Effective", quality: "strong", response: content.responses.response_strong,
                icon: <Check className="w-4 h-4 text-emerald-500" />,
                colors: { border: "border-emerald-200", bg: "bg-emerald-50", headerBg: "bg-emerald-50", headerText: "text-emerald-700", iconBg: "bg-emerald-100", responseBorder: "border-emerald-100", responseFrom: "from-emerald-50" } },
            ].map(tier => {
              const isOpen = expandedTier === tier.key;
              const promptText = content.options.find(o => o.quality === tier.quality)?.text;
              return (
                <div key={tier.key} className={`border-2 ${tier.colors.border} rounded-xl overflow-hidden transition-all`}>
                  {/* Clickable header */}
                  <button
                    onClick={() => setExpandedTier(isOpen ? null : tier.key)}
                    className={`w-full flex items-center justify-between gap-3 p-4 ${tier.colors.headerBg} hover:brightness-95 transition-all`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${tier.colors.iconBg} flex items-center justify-center flex-shrink-0`}>
                        {tier.icon}
                      </div>
                      <span className={`text-sm font-medium ${tier.colors.headerText}`}>{tier.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span onClick={(e) => e.stopPropagation()}>
                        <CopyButton text={promptText} label="Copy prompt" className="text-xs" />
                      </span>
                      <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {/* Expanded content: prompt + response */}
                  {isOpen && (
                    <div className="animate-fadeIn">
                      {/* The prompt */}
                      <div className={`px-5 pt-4 pb-3 ${tier.colors.bg}`}>
                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-1">The prompt</p>
                        <p className="text-stone-700 text-sm leading-relaxed italic">"{promptText}"</p>
                      </div>

                      {/* The AI response */}
                      <div className={`px-5 pt-3 pb-5 bg-gradient-to-b ${tier.colors.responseFrom} to-white`}>
                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-2">What the AI gives back</p>
                        <div className="text-stone-600 text-sm">
                          <MarkdownText text={tier.response} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Section 3: Copy the effective prompt CTA */}
          <div className="mt-4 flex justify-end">
            <CopyButton
              text={content.options.find(o => o.quality === "strong")?.text}
              label="Copy this prompt — try it in your own AI tool"
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            />
          </div>

          {/* Section 4: Feedback panel */}
          {content.feedback && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-amber-800">What happened here</span>
              </div>
              <p className="text-stone-700 text-sm mb-4">{content.feedback.what_happened}</p>
              <div className="bg-white rounded-lg p-4 mb-4 border border-amber-100">
                <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">The Principle</p>
                <p className="font-semibold text-stone-800 mb-1">{content.feedback.principle_name}</p>
                <p className="text-stone-600 text-sm">{content.feedback.principle}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-amber-100">
                <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">Try This Next Time</p>
                <p className="text-stone-700 text-sm">{content.feedback.tip}</p>
              </div>
            </div>
          )}

          {/* Section 5: Principle badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {scenario.principles.map(pid => (
              <PrincipleBadge key={pid} principleId={pid} />
            ))}
          </div>

          {/* Section 6: Recommendation callout */}
          <RecommendationCallout
            practicedPrinciples={[...new Set([...practicedPrinciples, ...(scenario.principles || [])])]}
            completedScenarios={[...new Set([...completedScenarios, scenario.id])]}
          />

          {/* Section 7: Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onComplete(scenario)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Next Scenario <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setTryPrompt("");
                setTryAnalysis(null);
                setTryResponses(null);
                setTryHeuristic(null);
                setStep("try-yourself");
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-medium transition-colors"
            >
              <PenTool className="w-4 h-4" /> Now Write Your Own
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-medium transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>
      )}

      {/* Step: Try It Yourself — write */}
      {step === "try-yourself" && (
        <div className="animate-fadeIn">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <PenTool className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Now it's your turn</span>
            </div>
            <p className="text-stone-600 text-sm">
              Write your own request for this scenario. Try to include these skills:
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {scenario.principles.map(pid => (
                <span key={pid} className="text-xs px-2 py-0.5 bg-white text-emerald-700 rounded-full border border-emerald-200 font-medium">
                  {PRINCIPLE_MAP[pid]?.name}
                </span>
              ))}
            </div>
          </div>
          <textarea
            value={tryPrompt}
            onChange={(e) => setTryPrompt(e.target.value)}
            placeholder="Type your request here..."
            rows={5}
            className="w-full bg-white border border-stone-300 rounded-xl p-4 text-stone-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 placeholder:text-stone-300"
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={async () => {
                if (!tryPrompt.trim()) return;
                if (hasApiKey()) {
                  setStep("try-loading");
                  try {
                    const analysis = await analyzeFreeform(scenario, tryPrompt.trim());
                    setTryAnalysis(analysis);
                    const resp = await simulateResponses(tryPrompt.trim(), analysis.improved_prompt, scenario.situation);
                    setTryResponses(resp);
                    setStep("try-results");
                  } catch (e) {
                    setError(e.message);
                    setStep("try-yourself");
                  }
                } else {
                  const result = scorePrompt(tryPrompt.trim(), scenario);
                  setTryHeuristic(result);
                  setStep("try-results");
                }
              }}
              disabled={!tryPrompt.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              <Send className="w-4 h-4" /> Check My Prompt
            </button>
            <button
              onClick={() => setStep("explore")}
              className="px-4 py-2.5 text-stone-500 hover:text-stone-700 text-sm transition-colors"
            >
              Back to results
            </button>
          </div>
        </div>
      )}

      {/* Step: Try It Yourself — loading */}
      {step === "try-loading" && !error && (
        <LoadingSpinner message="Analyzing your prompt..." />
      )}

      {/* Step: Try It Yourself — results */}
      {step === "try-results" && (
        <div className="animate-fadeIn space-y-6">
          {/* API-powered results */}
          {tryAnalysis && tryResponses && (
            <>
              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h3 className="font-semibold text-stone-800 mb-4">How you did</h3>
                <div className="bg-emerald-50 rounded-lg p-4 mb-3 border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide mb-1">What's working</p>
                  <p className="text-stone-700 text-sm">{tryAnalysis.strengths}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 mb-3 border border-amber-100">
                  <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">What to improve</p>
                  <p className="text-stone-700 text-sm">{tryAnalysis.improvements}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">Improved version</p>
                      <p className="text-stone-700 text-sm italic">"{tryAnalysis.improved_prompt}"</p>
                    </div>
                    <CopyButton text={tryAnalysis.improved_prompt} label="Copy" className="flex-shrink-0 bg-indigo-100 text-indigo-700 hover:bg-indigo-200" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-stone-700 mb-3">See the difference</h3>
                <ResponseComparison
                  weakPrompt={tryPrompt}
                  strongPrompt={tryAnalysis.improved_prompt}
                  weakResponse={tryResponses.response_weak}
                  strongResponse={tryResponses.response_strong}
                />
              </div>
            </>
          )}

          {/* Heuristic results (no API) */}
          {tryHeuristic && !tryAnalysis && (
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-semibold text-stone-800 mb-4">How you did</h3>

              {/* Score */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${
                  tryHeuristic.score >= 75 ? "bg-emerald-100 text-emerald-700" :
                  tryHeuristic.score >= 40 ? "bg-amber-100 text-amber-700" :
                  "bg-rose-100 text-rose-700"
                }`}>
                  {tryHeuristic.score}
                </div>
                <div>
                  <p className="font-medium text-stone-800">
                    {tryHeuristic.score >= 75 ? "Strong prompt!" : tryHeuristic.score >= 40 ? "Good start — room to grow" : "Keep practicing!"}
                  </p>
                  <p className="text-stone-500 text-xs">
                    {tryHeuristic.principlesDetected.length} of {tryHeuristic.principlesDetected.length + tryHeuristic.principlesMissing.length} skills applied
                  </p>
                </div>
              </div>

              {/* Detected principles */}
              {tryHeuristic.principlesDetected.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide mb-2">Skills detected</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tryHeuristic.principlesDetected.map(pid => (
                      <span key={pid} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-200 inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> {PRINCIPLE_MAP[pid]?.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing principles with suggestions */}
              {tryHeuristic.suggestions.length > 0 && (
                <div>
                  <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-2">Try adding</p>
                  <div className="space-y-2">
                    {tryHeuristic.suggestions.map((s, i) => (
                      <div key={i} className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                        <p className="text-stone-700 text-sm">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onComplete(scenario)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Next Scenario <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setTryPrompt("");
                setTryAnalysis(null);
                setTryResponses(null);
                setTryHeuristic(null);
                setStep("try-yourself");
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendationCallout({ practicedPrinciples, completedScenarios }) {
  const recs = getRecommendedScenarios(practicedPrinciples, completedScenarios, GUIDED_SCENARIOS, 1);
  const rec = buildRecommendation(practicedPrinciples, recs);
  if (!rec) return null;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
      <p className="text-sm text-indigo-700 font-medium mb-1">What to try next</p>
      <p className="text-sm text-stone-600">
        Try <strong>"{rec.nextScenario}"</strong> to practice{" "}
        {rec.newSkills.length === 1
          ? <strong>{rec.newSkills[0]}</strong>
          : rec.newSkills.map((s, i) => (
              <span key={s}>
                {i > 0 && (i === rec.newSkills.length - 1 ? " and " : ", ")}
                <strong>{s}</strong>
              </span>
            ))
        }.
      </p>
    </div>
  );
}
