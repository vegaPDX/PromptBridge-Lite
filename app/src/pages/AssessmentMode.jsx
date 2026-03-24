import React, { useState, useMemo } from "react";
import {
  ArrowLeft, ArrowRight, Send, BarChart3, Check, Target,
} from "lucide-react";
import { SCENARIOS } from "../data/scenarios";
import { PRINCIPLE_MAP } from "../data/principles";
import { PRE_SCENARIOS, POST_SCENARIOS } from "../data/assessment-scenarios";
import { scorePrompt } from "../services/heuristic-scorer";

export default function AssessmentMode({ onComplete, onBack, assessmentData }) {
  const isPost = Boolean(assessmentData?.pre);
  const scenarioIds = isPost ? POST_SCENARIOS : PRE_SCENARIOS;
  const scenarios = useMemo(
    () => scenarioIds.map(id => SCENARIOS.find(s => s.id === id)).filter(Boolean),
    [scenarioIds]
  );

  const [step, setStep] = useState("intro"); // intro | scenario-0 | scenario-1 | scenario-2 | results
  const [prompts, setPrompts] = useState(["", "", ""]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [scores, setScores] = useState(null);

  const currentIdx = step.startsWith("scenario-") ? parseInt(step.split("-")[1], 10) : -1;
  const currentScenario = currentIdx >= 0 ? scenarios[currentIdx] : null;

  const handleSubmitPrompt = () => {
    if (!currentPrompt.trim()) return;
    const newPrompts = [...prompts];
    newPrompts[currentIdx] = currentPrompt.trim();
    setPrompts(newPrompts);

    if (currentIdx < scenarios.length - 1) {
      setCurrentPrompt("");
      setStep(`scenario-${currentIdx + 1}`);
    } else {
      // Score all prompts
      const allScores = scenarios.map((s, i) => scorePrompt(newPrompts[i], s));
      const aggregate = {
        totalScore: Math.round(allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length),
        perScenario: allScores.map((s, i) => ({ scenario: scenarios[i], ...s })),
        allDetected: [...new Set(allScores.flatMap(s => s.principlesDetected))],
        allMissing: [...new Set(allScores.flatMap(s => s.principlesMissing))],
      };
      setScores(aggregate);
      setStep("results");

      // Save to parent
      const result = {
        date: new Date().toISOString(),
        scores: aggregate,
        prompts: newPrompts,
        scenarioIds,
      };
      onComplete(isPost ? "post" : "pre", result);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-stone-500 hover:text-stone-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Intro */}
      {step === "intro" && (
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <Target className="w-7 h-7 text-indigo-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-800 mb-3">
            {isPost ? "Measure Your Progress" : "See Where You Stand"}
          </h1>
          <p className="text-stone-600 max-w-md mx-auto mb-6">
            You'll see {scenarios.length} scenarios. Write a prompt for each one — just
            like you'd type into an AI tool. No feedback until the end.
          </p>
          <button
            onClick={() => {
              setCurrentPrompt("");
              setStep("scenario-0");
            }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
          >
            Start <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Scenario steps */}
      {currentScenario && (
        <div className="animate-fadeIn">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-4">
            {scenarios.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < currentIdx ? "bg-indigo-500" :
                  i === currentIdx ? "bg-indigo-300" :
                  "bg-stone-200"
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-stone-600 font-medium uppercase tracking-wide mb-2">
            Scenario {currentIdx + 1} of {scenarios.length}
          </p>

          <div className="bg-white rounded-xl border border-stone-200 p-5 mb-4">
            <h2 className="font-serif text-lg font-bold text-stone-800 mb-1">{currentScenario.title}</h2>
            <p className="text-stone-600 text-base">{currentScenario.situation}</p>
          </div>

          <textarea
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            maxLength={4000}
            aria-label="Write your prompt"
            placeholder="How would you ask an AI to help with this?"
            rows={5}
            className="w-full bg-white border border-stone-300 rounded-xl p-4 text-stone-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 placeholder:text-stone-300"
          />
          {currentPrompt.length > 3500 && (
            <p className="text-xs text-amber-600 mt-1">{4000 - currentPrompt.length} characters remaining</p>
          )}
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmitPrompt}
              disabled={!currentPrompt.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              <Send className="w-4 h-4" />
              {currentIdx < scenarios.length - 1 ? "Next" : "See Results"}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {step === "results" && scores && (
        <div className="animate-fadeIn">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold ${
              scores.totalScore >= 75 ? "bg-emerald-100 text-emerald-700" :
              scores.totalScore >= 40 ? "bg-amber-100 text-amber-700" :
              "bg-rose-100 text-rose-700"
            }`}>
              {scores.totalScore}
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-1">
              {isPost ? "Your Progress" : "Your Starting Point"}
            </h2>
            <p className="text-stone-600">
              {scores.totalScore >= 75 ? "Strong communication skills!" :
               scores.totalScore >= 40 ? "Good foundation — practice will sharpen these skills." :
               "Everyone starts somewhere. The guided scenarios will help you improve quickly."}
            </p>
          </div>

          {/* Before/after comparison */}
          {isPost && assessmentData?.pre?.scores && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Before & After
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Before</p>
                  <p className="text-3xl font-bold text-stone-400">{assessmentData.pre.scores.totalScore}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-600 uppercase tracking-wide mb-1">After</p>
                  <p className="text-3xl font-bold text-indigo-700">{scores.totalScore}</p>
                </div>
              </div>
              {scores.totalScore > assessmentData.pre.scores.totalScore && (
                <p className="text-center text-sm text-emerald-700 font-medium mt-3">
                  +{scores.totalScore - assessmentData.pre.scores.totalScore} points improvement!
                </p>
              )}
            </div>
          )}

          {/* Skills detected */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
            <h3 className="font-semibold text-stone-800 mb-3">Skills applied</h3>
            <div className="space-y-2">
              {[...scores.allDetected, ...scores.allMissing].map(pid => {
                const detected = scores.allDetected.includes(pid);
                return (
                  <div key={pid} className={`flex items-center gap-3 p-2 rounded-lg ${detected ? "bg-emerald-50" : "bg-stone-50"}`}>
                    {detected
                      ? <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      : <div className="w-4 h-4 rounded-full border-2 border-stone-300 flex-shrink-0" />
                    }
                    <span className={`text-sm ${detected ? "text-emerald-800 font-medium" : "text-stone-500"}`}>
                      {PRINCIPLE_MAP[pid]?.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-scenario breakdown */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
            <h3 className="font-semibold text-stone-800 mb-3">Per-scenario scores</h3>
            <div className="space-y-3">
              {scores.perScenario.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                    s.score >= 75 ? "bg-emerald-100 text-emerald-700" :
                    s.score >= 40 ? "bg-amber-100 text-amber-700" :
                    "bg-rose-100 text-rose-700"
                  }`}>
                    {s.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-700 truncate">{s.scenario.title}</p>
                    <p className="text-xs text-stone-500">
                      {s.principlesDetected.length} of {s.principlesDetected.length + s.principlesMissing.length} skills
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onBack()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              {isPost ? "Back to Progress" : "Start Practicing"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
