import React, { useState } from "react";
import {
  ArrowLeft, ArrowRight, Send, RefreshCw, Lightbulb,
  MessageSquare, ChevronRight,
} from "lucide-react";
import { PRINCIPLE_MAP } from "../data/principles";
import {
  generateInitialResponse,
  generateImprovedResponse,
  generateMultiTurnFeedback,
} from "../services/llm";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import PrincipleBadge from "../components/PrincipleBadge";
import CopyButton from "../components/CopyButton";
import MarkdownText from "../components/MarkdownText";

export default function MultiTurnMode({ scenario, onComplete, onBack }) {
  // Steps: write-initial | loading-1 | review-response | write-followup | loading-2 | loading-feedback | results
  const [step, setStep] = useState("write-initial");
  const [initialPrompt, setInitialPrompt] = useState("");
  const [initialResult, setInitialResult] = useState(null); // { response, missing }
  const [followUp, setFollowUp] = useState("");
  const [improvedResult, setImprovedResult] = useState(null); // { response }
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  // ── Step 1: Submit initial prompt ───────────────────────────

  const handleSubmitInitial = async () => {
    if (!initialPrompt.trim()) return;
    setStep("loading-1");
    setError(null);
    try {
      const result = await generateInitialResponse(scenario, initialPrompt.trim());
      setInitialResult(result);
      setStep("review-response");
    } catch (e) {
      setError(e.message);
      setStep("write-initial");
    }
  };

  // ── Step 2: Submit follow-up ────────────────────────────────

  const handleSubmitFollowUp = async () => {
    if (!followUp.trim()) return;
    setStep("loading-2");
    setError(null);
    try {
      const improved = await generateImprovedResponse(
        scenario,
        initialPrompt.trim(),
        initialResult.response,
        followUp.trim()
      );
      setImprovedResult(improved);

      // Now get feedback
      setStep("loading-feedback");
      const fb = await generateMultiTurnFeedback(
        scenario,
        initialPrompt.trim(),
        initialResult.response,
        followUp.trim(),
        improved.response
      );
      setFeedback(fb);
      setStep("results");
    } catch (e) {
      setError(e.message);
      if (!improvedResult) {
        setStep("write-followup");
      }
    }
  };

  // ── Retry from error ────────────────────────────────────────

  const retryFromError = () => {
    setError(null);
    if (!initialResult) {
      handleSubmitInitial();
    } else if (!improvedResult) {
      handleSubmitFollowUp();
    } else {
      // Retry feedback only
      setStep("loading-feedback");
      generateMultiTurnFeedback(
        scenario,
        initialPrompt.trim(),
        initialResult.response,
        followUp.trim(),
        improvedResult.response
      )
        .then((fb) => {
          setFeedback(fb);
          setStep("results");
        })
        .catch((e) => {
          setError(e.message);
          setStep("results");
        });
    }
  };

  // ── Reset ───────────────────────────────────────────────────

  const resetForm = () => {
    setStep("write-initial");
    setInitialPrompt("");
    setInitialResult(null);
    setFollowUp("");
    setImprovedResult(null);
    setFeedback(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to scenarios
      </button>

      {/* Scenario header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-amber-600 font-medium uppercase tracking-wide">
            Multi-Turn Practice
          </span>
        </div>
        <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">
          {scenario.title}
        </h2>
        <p className="text-stone-600 text-sm">{scenario.situation}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {scenario.principles.map((pid) => (
            <PrincipleBadge key={pid} principleId={pid} />
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6 text-xs text-stone-400">
        <span className={step === "write-initial" || step === "loading-1" ? "text-indigo-600 font-medium" : initialResult ? "text-emerald-600" : ""}>
          1. Write prompt
        </span>
        <ChevronRight className="w-3 h-3" />
        <span className={step === "review-response" || step === "write-followup" || step === "loading-2" ? "text-indigo-600 font-medium" : improvedResult ? "text-emerald-600" : ""}>
          2. Refine it
        </span>
        <ChevronRight className="w-3 h-3" />
        <span className={step === "loading-feedback" || step === "results" ? "text-indigo-600 font-medium" : ""}>
          3. See results
        </span>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onRetry={retryFromError} />
        </div>
      )}

      {/* ── Step: Write Initial Prompt ──────────────────────── */}
      {step === "write-initial" && (
        <div className="animate-fadeIn">
          <h3 className="font-semibold text-stone-700 mb-1">
            Write your first attempt
          </h3>
          <p className="text-stone-500 text-sm mb-4">
            How would you ask an AI to help with this? Don't overthink it
            &mdash; write what you'd naturally type.
          </p>
          <textarea
            value={initialPrompt}
            onChange={(e) => setInitialPrompt(e.target.value)}
            placeholder="Type your request here..."
            rows={5}
            className="w-full bg-white border border-stone-300 rounded-xl p-4 text-stone-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 placeholder:text-stone-300"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmitInitial}
              disabled={!initialPrompt.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              <Send className="w-4 h-4" /> Send to AI
            </button>
          </div>
        </div>
      )}

      {/* ── Loading: Initial Response ──────────────────────── */}
      {step === "loading-1" && !error && (
        <LoadingSpinner message="Generating AI response..." />
      )}

      {/* ── Step: Review Response ──────────────────────────── */}
      {step === "review-response" && initialResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* What you sent */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-5">
            <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-2">
              Your prompt
            </p>
            <p className="text-stone-700 text-sm italic">
              "{initialPrompt}"
            </p>
          </div>

          {/* AI response */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-stone-400" />
              <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">
                AI Response
              </p>
            </div>
            <div className="text-stone-700 text-sm">
              <MarkdownText text={initialResult.response} />
            </div>
          </div>

          {/* What's missing */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <p className="font-semibold text-amber-800 text-sm">
                This response could be better. Here's what's missing:
              </p>
            </div>
            <ul className="space-y-2">
              {(initialResult.missing || []).map((item, i) => (
                <li
                  key={i}
                  className="text-stone-700 text-sm flex items-start gap-2"
                >
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">
                    &bull;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setStep("write-followup")}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            Write a follow-up <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Step: Write Follow-up ──────────────────────────── */}
      {step === "write-followup" && initialResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Conversation so far (collapsed) */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-2">
              Conversation so far
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-stone-600">
                <span className="font-medium text-stone-700">You:</span>{" "}
                <span className="italic">"{initialPrompt}"</span>
              </p>
              <p className="text-stone-500">
                <span className="font-medium text-stone-600">AI:</span>{" "}
                {initialResult.response.length > 150
                  ? initialResult.response.slice(0, 150) + "..."
                  : initialResult.response}
              </p>
            </div>
          </div>

          {/* Follow-up input */}
          <div>
            <h3 className="font-semibold text-stone-700 mb-1">
              Now refine your request
            </h3>
            <p className="text-stone-500 text-sm mb-4">
              Write a follow-up message that adds the missing context,
              clarifies your needs, or gives the AI better direction.
            </p>
            <textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Add more context, clarify what you need, give specific feedback..."
              rows={5}
              className="w-full bg-white border border-stone-300 rounded-xl p-4 text-stone-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 placeholder:text-stone-300"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmitFollowUp}
                disabled={!followUp.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
              >
                <Send className="w-4 h-4" /> Send follow-up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Loading: Improved Response ─────────────────────── */}
      {step === "loading-2" && !error && (
        <LoadingSpinner message="Generating improved response..." />
      )}

      {/* ── Loading: Feedback ──────────────────────────────── */}
      {step === "loading-feedback" && !error && (
        <LoadingSpinner message="Analyzing your conversation..." />
      )}

      {/* ── Step: Results ──────────────────────────────────── */}
      {step === "results" && initialResult && improvedResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Full conversation */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-800 mb-4">
              Your conversation
            </h3>

            <div className="space-y-4">
              {/* Turn 1: Initial prompt */}
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">
                  Your first message
                </p>
                <p className="text-stone-700 text-sm italic">
                  "{initialPrompt}"
                </p>
              </div>

              {/* Turn 2: Initial response */}
              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-1">
                  AI response (before)
                </p>
                <div className="text-stone-700 text-sm">
                  <MarkdownText text={initialResult.response} />
                </div>
              </div>

              {/* Turn 3: Follow-up */}
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">
                  Your follow-up
                </p>
                <p className="text-stone-700 text-sm italic">
                  "{followUp}"
                </p>
              </div>

              {/* Turn 4: Improved response */}
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide mb-1">
                      AI response (after)
                    </p>
                    <div className="text-stone-700 text-sm">
                      <MarkdownText text={improvedResult.response} />
                    </div>
                  </div>
                  <CopyButton
                    text={improvedResult.response}
                    label="Copy"
                    className="flex-shrink-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-semibold text-stone-800 mb-4">
                How you did
              </h3>

              {/* Initial assessment */}
              <div className="bg-stone-50 rounded-lg p-4 mb-3 border border-stone-100">
                <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-1">
                  Your first message
                </p>
                <p className="text-stone-700 text-sm">
                  {feedback.initial_assessment}
                </p>
              </div>

              {/* Follow-up quality */}
              <div className="bg-indigo-50 rounded-lg p-4 mb-3 border border-indigo-100">
                <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">
                  Your follow-up
                </p>
                <p className="text-stone-700 text-sm">
                  {feedback.followup_quality}
                </p>
              </div>

              {/* Improvement summary */}
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide mb-1">
                  The improvement
                </p>
                <p className="text-stone-700 text-sm">
                  {feedback.improvement_summary}
                </p>
              </div>
            </div>
          )}

          {/* Tip */}
          {feedback && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-amber-800">
                  Remember This
                </span>
              </div>
              <p className="text-stone-700 text-sm">{feedback.tip}</p>
            </div>
          )}

          {/* Principle badges */}
          <div>
            <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-2">
              Skills practiced
            </p>
            <div className="flex flex-wrap gap-2">
              {scenario.principles.map((pid) => (
                <PrincipleBadge key={pid} principleId={pid} size="md" />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onComplete(scenario, scenario.principles)}
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
