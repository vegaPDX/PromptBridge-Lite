import React, { useState } from "react";
import {
  ArrowLeft, ArrowRight, PenTool, Send, Lightbulb,
  RefreshCw, Check, Copy, ExternalLink,
} from "lucide-react";
import { PRINCIPLE_MAP } from "../data/principles";
import { FREEFORM_SCENARIOS } from "../data/scenarios";
import { hasApiKey, analyzeFreeform, simulateResponses } from "../services/llm";
import { getRecommendedScenarios, buildRecommendation } from "../services/recommendations";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import PrincipleBadge from "../components/PrincipleBadge";
import ResponseComparison from "../components/ResponseComparison";
import CopyButton from "../components/CopyButton";

export default function FreeformMode({ scenario, onComplete, onBack, practicedPrinciples = [], completedScenarios = [], userContext }) {
  // States: write | tips | loading-analysis | loading-responses | results
  const [step, setStep] = useState("write");
  const [userPrompt, setUserPrompt] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [responses, setResponses] = useState(null);
  const [error, setError] = useState(null);

  const apiKeyAvailable = hasApiKey();

  // ── Path 1: Full AI-powered flow ──────────────────────────

  const handleSubmit = async () => {
    if (!userPrompt.trim()) return;
    setStep("loading-analysis");
    setError(null);
    try {
      const result = await analyzeFreeform(scenario, userPrompt.trim(), userContext);
      setAnalysis(result);

      // Now simulate responses
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
    }
  };

  const retryFromError = () => {
    if (!analysis) {
      handleSubmit();
    } else {
      setStep("loading-responses");
      setError(null);
      simulateResponses(userPrompt.trim(), analysis.improved_prompt, scenario.situation)
        .then(resp => {
          setResponses(resp);
          setStep("results");
        })
        .catch(e => setError(e.message));
    }
  };

  // ── Path 2: No API key — Copy & Tips ──────────────────────

  const handleCopyAndTry = async () => {
    try {
      await navigator.clipboard.writeText(userPrompt.trim());
    } catch (err) {
      // If clipboard fails, still proceed
      console.error("Failed to copy:", err);
    }
    setStep("tips");
  };

  const resetForm = () => {
    setStep("write");
    setUserPrompt("");
    setAnalysis(null);
    setResponses(null);
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
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Type your request here..."
            rows={5}
            className="w-full bg-white border border-stone-300 rounded-xl p-4 text-stone-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 placeholder:text-stone-300"
          />
          <div className="flex items-center justify-end gap-3 mt-3">
            {apiKeyAvailable ? (
              /* Path 1: API key exists -- Submit for AI analysis */
              <button
                onClick={handleSubmit}
                disabled={!userPrompt.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
              >
                <Send className="w-4 h-4" /> Submit
              </button>
            ) : (
              /* Path 2: No API key -- Copy & Try + disabled Analyze */
              <>
                <button
                  onClick={handleCopyAndTry}
                  disabled={!userPrompt.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                >
                  <Copy className="w-4 h-4" /> Copy &amp; Try It
                </button>
                <div className="text-right">
                  <button
                    disabled
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-200 text-stone-400 rounded-xl font-medium cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" /> Analyze with AI
                  </button>
                  <p className="text-xs text-stone-400 mt-1">
                    Requires a free Gemini key &mdash;{" "}
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-700 underline"
                    >
                      Get one at Google AI Studio
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Step: Tips (no API key path) ────────────────────── */}
      {step === "tips" && (
        <div className="animate-fadeIn space-y-6">
          {/* Success message */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="font-semibold text-emerald-800 mb-1">Prompt copied!</p>
            <p className="text-stone-600 text-sm">Now paste it into any AI tool.</p>
          </div>

          {/* Tips panel */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-stone-800">Try it out</span>
            </div>
            <ul className="space-y-2 text-stone-600 text-sm">
              <li>Try it in <strong>ChatGPT</strong>, <strong>Gemini</strong>, or any AI assistant you have access to.</li>
              <li>Compare what you get back to what you expected.</li>
              <li>If the result isn't useful, think about what context or details were missing from your request.</li>
            </ul>
          </div>

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

          {/* API key callout */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center">
            <p className="text-stone-600 text-sm">
              Want AI-powered feedback on your prompts?{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-medium underline inline-flex items-center gap-1"
              >
                Get a free Gemini API key <ExternalLink className="w-3 h-3" />
              </a>
            </p>
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
