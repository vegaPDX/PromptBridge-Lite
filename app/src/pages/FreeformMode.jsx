import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, ArrowRight, PenTool, Send, Lightbulb,
  RefreshCw, Check,
} from "lucide-react";
import { PRINCIPLE_MAP } from "../data/principles";
import { FREEFORM_SCENARIOS } from "../data/scenarios";
import { hasApiKey, analyzeFreeform, simulateResponses } from "../services/llm";
import { scorePrompt, getFeedbackSummary } from "../services/heuristic-scorer";
import { getRecommendedScenarios, buildRecommendation } from "../services/recommendations";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import PrincipleBadge from "../components/PrincipleBadge";
import ResponseComparison from "../components/ResponseComparison";
import CopyButton from "../components/CopyButton";
import AiToolLinks from "../components/AiToolLinks";

export default function FreeformMode({ scenario, onComplete, onBack, practicedPrinciples = [], completedScenarios = [], userContext }) {
  // States: write | tips | loading-analysis | loading-responses | results | heuristic-results
  const [step, setStep] = useState("write");
  const [userPrompt, setUserPrompt] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [responses, setResponses] = useState(null);
  const [heuristic, setHeuristic] = useState(null);
  const [error, setError] = useState(null);

  // Unmount guard for async operations
  const unmountedRef = useRef(false);
  useEffect(() => () => { unmountedRef.current = true; }, []);

  // ── Check My Skills: API if available, heuristic otherwise ──

  const handleCheckSkills = async () => {
    if (!userPrompt.trim()) return;
    if (hasApiKey()) {
      setStep("loading-analysis");
      setError(null);
      try {
        const result = await analyzeFreeform(scenario, userPrompt.trim(), userContext);
        setAnalysis(result);
        setStep("loading-responses");
        const resp = await simulateResponses(
          userPrompt.trim(),
          result.improved_prompt,
          scenario.situation
        );
        setResponses(resp);
        setStep("results");
      } catch (e) {
        setError(e.message);
        setStep("write");
      }
    } else {
      const result = scorePrompt(userPrompt.trim(), scenario);
      setHeuristic(result);
      setStep("heuristic-results");
    }
  };

  // ── Copy & Try ──

  const handleCopyAndTry = async () => {
    try {
      await navigator.clipboard.writeText(userPrompt.trim());
    } catch (err) {
      console.error("Failed to copy:", err);
    }
    setStep("tips");
  };

  const retryFromError = () => {
    if (!analysis) {
      handleCheckSkills();
    } else {
      setStep("loading-responses");
      setError(null);
      simulateResponses(userPrompt.trim(), analysis.improved_prompt, scenario.situation)
        .then(resp => {
          if (unmountedRef.current) return;
          setResponses(resp);
          setStep("results");
        })
        .catch(e => {
          if (unmountedRef.current) return;
          setError(e.message);
        });
    }
  };

  const resetForm = () => {
    setStep("write");
    setUserPrompt("");
    setAnalysis(null);
    setResponses(null);
    setHeuristic(null);
    setError(null);
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
          <PenTool className="w-4 h-4 text-indigo-500" />
          <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Write Your Own</span>
        </div>
        <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">{scenario.title}</h2>
        <p className="text-stone-600 text-sm">{scenario.situation}</p>
      </div>

      {error && <div className="mb-6"><ErrorBanner message={error} onRetry={retryFromError} /></div>}

      {/* ── Step: Write ─────────────────────────────────────── */}
      {step === "write" && (
        <div>
          <h3 className="font-semibold text-stone-700 mb-1">Write your request</h3>
          <p className="text-stone-500 text-sm mb-4">How would you ask an AI to help with this? Write the message you'd actually send.</p>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4">
            <p className="text-stone-600 text-sm">
              <strong>Tip:</strong> After writing your prompt, check your skills and then try it in a real AI tool —{" "}
              <strong>ChatGPT</strong>, <strong>Claude</strong>, <strong>Gemini</strong>, or{" "}
              <strong>Copilot</strong>.
            </p>
          </div>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            maxLength={4000}
            placeholder="Type your request here..."
            rows={5}
            className="w-full bg-white border border-stone-300 rounded-xl p-4 text-stone-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 placeholder:text-stone-300"
          />
          {userPrompt.length > 3500 && (
            <p className="text-xs text-amber-600 mt-1">{4000 - userPrompt.length} characters remaining</p>
          )}
          <div className="flex items-center justify-end gap-3 mt-3">
            <button
              onClick={handleCheckSkills}
              disabled={!userPrompt.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              <Send className="w-4 h-4" /> Check My Skills
            </button>
            <button
              onClick={handleCopyAndTry}
              disabled={!userPrompt.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-50 hover:bg-emerald-100 disabled:bg-stone-100 disabled:text-stone-300 disabled:cursor-not-allowed text-emerald-700 border border-emerald-200 rounded-xl font-medium transition-colors"
            >
              Copy &amp; Try It
            </button>
          </div>
        </div>
      )}

      {/* ── Step: Tips (Copy & Try path) ──────────────────────── */}
      {step === "tips" && (
        <div className="animate-fadeIn space-y-6">
          {/* Success message */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="font-semibold text-emerald-800 mb-1">Prompt copied!</p>
            <p className="text-stone-600 text-sm">Now paste it into your AI tool and compare what you get to what you expected.</p>
          </div>

          {/* AI tool links */}
          <AiToolLinks message="Open any of these and paste your prompt:" />

          {/* Principles to think about */}
          <div>
            <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-2">Skills to think about for this scenario</p>
            <div className="flex flex-wrap gap-2">
              {scenario.principles.map(pid => (
                <PrincipleBadge key={pid} principleId={pid} size="md" />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Write Another
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

      {/* ── Loading states ──────────────────────────────────── */}
      {step === "loading-analysis" && !error && (
        <LoadingSpinner message="Analyzing your request..." />
      )}

      {step === "loading-responses" && !error && (
        <LoadingSpinner message="Simulating AI responses..." />
      )}

      {/* ── Step: Heuristic Results (no API key) ─────────────── */}
      {step === "heuristic-results" && heuristic && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-800 mb-4">How you did</h3>

            {/* Score */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${
                heuristic.score >= 75 ? "bg-emerald-100 text-emerald-700" :
                heuristic.score >= 40 ? "bg-amber-100 text-amber-700" :
                "bg-rose-100 text-rose-700"
              }`}>
                {heuristic.score}
              </div>
              <div>
                <p className="font-medium text-stone-800">{getFeedbackSummary(heuristic)}</p>
                <p className="text-stone-500 text-xs">
                  {heuristic.principlesDetected.length} of {heuristic.principlesDetected.length + heuristic.principlesMissing.length} skills applied
                </p>
              </div>
            </div>

            {/* Detected */}
            {heuristic.principlesDetected.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide mb-2">Skills detected</p>
                <div className="flex flex-wrap gap-1.5">
                  {heuristic.principlesDetected.map(pid => (
                    <span key={pid} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-200 inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> {PRINCIPLE_MAP[pid]?.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing */}
            {heuristic.suggestions.length > 0 && (
              <div>
                <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-2">Try adding</p>
                <div className="space-y-2">
                  {heuristic.suggestions.map((s, i) => (
                    <div key={i} className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                      <p className="text-stone-700 text-sm">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Try it for real */}
          <AiToolLinks
            prompt={userPrompt}
            message="Now try it for real — paste your prompt and see how the AI responds. Then come back and improve it."
          />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onComplete(scenario, [...(heuristic.principlesDetected || []), ...(heuristic.principlesMissing || [])])}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Next Scenario <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      )}

      {/* ── Step: Results (API key path) ────────────────────── */}
      {step === "results" && analysis && responses && (
        <div className="space-y-6 animate-fadeIn">
          {/* Analysis */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-800 mb-4">How you did</h3>

            {/* Strengths */}
            <div className="bg-emerald-50 rounded-lg p-4 mb-3 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide mb-1">What's working</p>
              <p className="text-stone-700 text-sm">{analysis.strengths}</p>
            </div>

            {/* Improvements */}
            <div className="bg-amber-50 rounded-lg p-4 mb-3 border border-amber-100">
              <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">What to improve</p>
              <p className="text-stone-700 text-sm">{analysis.improvements}</p>
            </div>

            {/* Improved prompt */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">Improved version</p>
                  <p className="text-stone-700 text-sm italic">"{analysis.improved_prompt}"</p>
                </div>
                <CopyButton
                  text={analysis.improved_prompt}
                  label="Copy improved version"
                  className="flex-shrink-0 bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                />
              </div>
            </div>
          </div>

          {/* Side-by-side comparison */}
          <div>
            <h3 className="font-semibold text-stone-700 mb-3">See the difference</h3>
            <ResponseComparison
              weakPrompt={userPrompt}
              strongPrompt={analysis.improved_prompt}
              weakResponse={responses.response_weak}
              strongResponse={responses.response_strong}
            />
          </div>

          {/* Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-amber-800">Try This Next Time</span>
            </div>
            <p className="text-stone-700 text-sm">{analysis.tip}</p>
          </div>

          {/* Principle badges */}
          <div>
            <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-2">Skills practiced</p>
            <div className="flex flex-wrap gap-2">
              {(analysis.principles_present || []).map(pid => (
                <span key={pid} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-200">
                  &#10003; {PRINCIPLE_MAP[pid]?.name}
                </span>
              ))}
              {(analysis.principles_missing || []).map(pid => (
                <span key={pid} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full font-medium border border-stone-200">
                  {PRINCIPLE_MAP[pid]?.name}
                </span>
              ))}
            </div>
          </div>

          {/* Try it for real */}
          <AiToolLinks
            prompt={analysis.improved_prompt}
            message="Try the improved version in a real AI tool and see the difference:"
          />

          {/* Recommendation callout */}
          <FreeformRecommendation
            practicedPrinciples={[...new Set([...practicedPrinciples, ...(analysis.principles_present || []), ...(analysis.principles_missing || [])])]}
            completedScenarios={[...new Set([...completedScenarios, scenario.id])]}
          />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onComplete(scenario, [...(analysis.principles_present || []), ...(analysis.principles_missing || [])])}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Next Scenario <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetForm}
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

function FreeformRecommendation({ practicedPrinciples, completedScenarios }) {
  const recs = getRecommendedScenarios(practicedPrinciples, completedScenarios, FREEFORM_SCENARIOS, 1);
  const rec = buildRecommendation(practicedPrinciples, recs);
  if (!rec) return null;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
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
