import React from "react";
import { Check, ArrowRight, Award, Target } from "lucide-react";
import { PRINCIPLES } from "../data/principles";
import { SCENARIOS } from "../data/scenarios";
import { resolveIcon } from "../data/icon-map";

export default function ProgressPage({ completedScenarios, practicedPrinciples, onNavigate, assessmentData }) {
  const totalScenarios = SCENARIOS.length;
  const completedCount = completedScenarios.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Your Progress</h1>
      <p className="text-stone-500 mb-8">
        {completedCount} of {totalScenarios} scenarios completed
      </p>

      {/* Progress bar */}
      <div className="bg-stone-200 rounded-full h-3 mb-8 overflow-hidden">
        <div
          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${totalScenarios > 0 ? (completedCount / totalScenarios) * 100 : 0}%` }}
        />
      </div>

      {/* Assessment CTA */}
      {completedCount === 0 && !assessmentData?.pre && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-indigo-800 text-sm">See where you stand</p>
              <p className="text-stone-600 text-xs">Take a quick 3-scenario assessment to measure your starting point.</p>
            </div>
            <button
              onClick={() => onNavigate("assessment")}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
            >
              Start
            </button>
          </div>
        </div>
      )}
      {completedCount >= 10 && assessmentData?.pre && !assessmentData?.post && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-emerald-800 text-sm">Measure your progress</p>
              <p className="text-stone-600 text-xs">You've completed {completedCount} scenarios. Take a post-assessment to see how much you've improved.</p>
            </div>
            <button
              onClick={() => onNavigate("assessment")}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
            >
              Start
            </button>
          </div>
        </div>
      )}
      {assessmentData?.pre && assessmentData?.post && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 mb-8">
          <p className="font-medium text-stone-800 text-sm mb-2">Assessment Results</p>
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-xs text-stone-400">Before</p>
              <p className="text-2xl font-bold text-stone-400">{assessmentData.pre.scores.totalScore}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-300" />
            <div>
              <p className="text-xs text-indigo-600">After</p>
              <p className="text-2xl font-bold text-indigo-700">{assessmentData.post.scores.totalScore}</p>
            </div>
            {assessmentData.post.scores.totalScore > assessmentData.pre.scores.totalScore && (
              <span className="text-sm text-emerald-600 font-medium">
                +{assessmentData.post.scores.totalScore - assessmentData.pre.scores.totalScore} points
              </span>
            )}
          </div>
        </div>
      )}

      {/* Principles grid */}
      <h2 className="font-serif text-xl font-bold text-stone-800 mb-4">Communication Skills</h2>
      <div className="space-y-3 mb-8">
        {PRINCIPLES.map(p => {
          const Icon = resolveIcon(p.icon);
          const practiced = practicedPrinciples.includes(p.id);
          return (
            <div
              key={p.id}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                practiced
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-white border-stone-200"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                practiced ? "bg-emerald-100" : "bg-stone-100"
              }`}>
                {practiced
                  ? <Check className="w-5 h-5 text-emerald-500" />
                  : Icon ? <Icon className="w-5 h-5 text-stone-400" /> : null
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${practiced ? "text-emerald-800" : "text-stone-700"}`}>{p.name}</p>
                <p className={`text-xs ${practiced ? "text-emerald-600" : "text-stone-500"}`}>{p.description}</p>
              </div>
              {practiced && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                  Practiced
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {completedCount < totalScenarios && (
        <div className="text-center">
          <button
            onClick={() => onNavigate("scenarios")}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            Continue Practicing <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {completedCount === totalScenarios && (
        <div className="text-center bg-amber-50 border border-amber-200 rounded-xl p-6">
          <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="font-serif text-lg font-bold text-stone-800 mb-1">All scenarios completed!</p>
          <p className="text-stone-500 text-sm">You've practiced every scenario. Try the "Write Your Own" mode to keep building skills.</p>
        </div>
      )}
    </div>
  );
}
