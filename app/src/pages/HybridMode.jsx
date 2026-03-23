import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, PenTool, Send, Lightbulb, MessageSquare } from "lucide-react";
import { shuffle } from "lodash-es";
import { generateVariations, simulateResponses } from "../services/llm";
import { PRINCIPLE_MAP } from "../data/principles";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import PrincipleBadge from "../components/PrincipleBadge";
import ResponseComparison from "../components/ResponseComparison";
import CopyButton from "../components/CopyButton";

export default function HybridMode({ scenario, onComplete, onBack }) {
  const [step, setStep] = useState("write");
  const [userPrompt, setUserPrompt] = useState("");
  const [options, setOptions] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [responses, setResponses] = useState(null);
  const [error, setError] = useState(null);

  const weakOption = useRef(null);
  const strongOption = useRef(null);

  const handleWriteSubmit = async () => {
    if (!userPrompt.trim()) return;
    setStep("loading-variations");
    setError(null);
    try {
      const result = await generateVariations(scenario, userPrompt.trim());
      const opts = result.options;
      setOptions(opts);
      weakOption.current = opts.find(o => o.quality === "weak");
      strongOption.current = opts.find(o => o.quality === "strong");
      setShuffledOptions(shuffle([...opts]));
      setStep("evaluate");
    } catch (e) {
      setError(e.message);
      setStep("write");
    }
  };

  const handleSelect = async (option) => {
    setSelectedOption(option);
    setStep("loading-comparison");
    setError(null);
    try {
      const resp = await simulateResponses(
        weakOption.current?.text || "",
        strongOption.current?.text || "",
        scenario.situation
      );
      setResponses(resp);
      setStep("results");
    } catch (e) {
      setError(e.message);
      setStep("evaluate");
    }
  };

  const qualityLabel = (q) => {
    if (q === "strong") return { text: "Strong", color: "emerald" };
    if (q === "medium") return { text: "Okay", color: "amber" };
    return { text: "Weak", color: "rose" };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to scenarios
      </button>

      {/* Scenario header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <PenTool className="w-4 h-4 text-indigo-500" />
          <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Write First</span>
        </div>
        <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">{scenario.title}</h2>
        <p className="text-stone-600 text-sm">{scenario.situation}</p>
      </div>

      {error && <div className="mb-6"><ErrorBanner message={error} onRetry={() => step === "write" ? handleWriteSubmit() : null} /></div>}

      {/* Step: Write */}
      {step === "write" && (
        <div>
          <h3 className="font-semibold text-stone-700 mb-1">Write your request first</h3>
          <p className="text-stone-500 text-sm mb-4">How would you ask an AI to help with this? Write the message you'd actually send.</p>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Type your request here..."
            rows={5}
            className="w-full bg-white border border-stone-300 rounded-xl p-4 text-stone-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 placeholder:text-stone-300"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleWriteSubmit}
              disabled={!userPrompt.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              <Send className="w-4 h-4" /> See Variations
            </button>
          </div>
        </div>
      )}

      {/* Loading: variations */}
      {step === "loading-variations" && !error && (
        <LoadingSpinner message="Creating variations of your prompt..." />
      )}

      {/* Step: Evaluate */}
      {step === "evaluate" && (
        <div className="animate-fadeIn">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-indigo-700">
              <strong>Your original:</strong> "{userPrompt}"
            </p>
          </div>
          <h3 className="font-semibold text-stone-700 mb-1">Which version would get the best result?</h3>
          <p className="text-stone-500 text-sm mb-4">We created 3 variations of your prompt. Pick the strongest one.</p>
          <div className="space-y-3">
            {shuffledOptions.map((opt, idx) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className="w-full text-left bg-white rounded-xl border-2 border-stone-200 p-4 hover:border-indigo-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 font-semibold text-sm text-stone-500 group-hover:text-indigo-600 transition-colors">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <p className="text-stone-700 text-sm leading-relaxed flex-1">{opt.text}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading: comparison */}
      {step === "loading-comparison" && !error && (
        <LoadingSpinner message="Simulating AI responses..." />
      )}

      {/* Step: Results */}
      {step === "results" && selectedOption && responses && (
        <div className="animate-fadeIn">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-stone-500">You picked:</span>
            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
              selectedOption.quality === "strong" ? "bg-emerald-100 text-emerald-700" :
              selectedOption.quality === "medium" ? "bg-amber-100 text-amber-700" :
              "bg-rose-100 text-rose-700"
            }`}>
              {qualityLabel(selectedOption.quality).text}
            </span>
          </div>

          {/* Your original vs strong */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
            <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-2">Your original prompt</p>
            <p className="text-stone-700 text-sm italic">"{userPrompt}"</p>
          </div>

          <h3 className="font-semibold text-stone-700 mb-3">See the difference</h3>
          <ResponseComparison
            weakPrompt={weakOption.current?.text}
            strongPrompt={strongOption.current?.text}
            weakResponse={responses.response_weak}
            strongResponse={responses.response_strong}
          />

          <div className="mt-4 flex justify-end">
            <CopyButton
              text={strongOption.current?.text}
              label="Copy the strong version — try it in your own AI tool"
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            />
          </div>

          {/* Principle badges */}
          <div className="flex flex-wrap gap-2 my-6">
            {scenario.principles.map(pid => (
              <PrincipleBadge key={pid} principleId={pid} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onComplete(scenario)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Next Scenario <ArrowRight className="w-4 h-4" />
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
    </div>
  );
}
