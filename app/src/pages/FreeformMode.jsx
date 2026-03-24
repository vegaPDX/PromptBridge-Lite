import React, { useState } from "react";
import {
  ArrowLeft, ArrowRight, PenTool, Send,
  RefreshCw, Check,
} from "lucide-react";
import { PRINCIPLE_MAP } from "../data/principles";
import { scorePrompt, getFeedbackSummary } from "../services/heuristic-scorer";
import AiToolLinks from "../components/AiToolLinks";

export default function FreeformMode({ scenario, onComplete, onBack, practicedPrinciples = [], completedScenarios = [] }) {
  // States: write | heuristic-results
  const [step, setStep] = useState("write");
  const [userPrompt, setUserPrompt] = useState("");
  const [heuristic, setHeuristic] = useState(null);

  // ── Check My Skills: heuristic scoring ──

  const handleCheckSkills = () => {
    if (!userPrompt.trim()) return;
    const result = scorePrompt(userPrompt.trim(), scenario);
    setHeuristic(result);
    setStep("heuristic-results");
  };

  const resetForm = () => {
    setStep("write");
    setUserPrompt("");
    setHeuristic(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-1 text-stone-500 hover:text-stone-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to scenarios
      </button>

      {/* Scenario header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <PenTool className="w-4 h-4 text-indigo-500" />
          <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Write Your Own</span>
        </div>
        <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">{scenario.title}</h2>
        <p className="text-stone-600 text-base">{scenario.situation}</p>
      </div>

      {/* ── Step: Write ─────────────────────────────────────── */}
      {step === "write" && (
        <div>
          <h3 className="font-semibold text-stone-700 mb-1">Write your request</h3>
          <p className="text-stone-600 text-sm mb-4">How would you ask an AI to help with this? Write the message you'd actually send.</p>
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
            aria-label="Write your prompt"
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
          </div>

          {/* Copy & try in a real AI tool */}
          {userPrompt.trim() && (
            <div className="mt-6">
              <AiToolLinks
                prompt={userPrompt}
                message="Copy your prompt and try it in any AI tool:"
              />
            </div>
          )}
        </div>
      )}

      {/* ── Step: Heuristic Results ───────────────────────────── */}
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
                <p className="text-stone-600 text-sm">
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
    </div>
  );
}
