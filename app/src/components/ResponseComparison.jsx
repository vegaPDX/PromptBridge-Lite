import React from "react";
import { Check, X } from "lucide-react";
import MarkdownText from "./MarkdownText";

export default function ResponseComparison({
  weakPrompt,
  strongPrompt,
  weakResponse,
  strongResponse,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Weak side */}
      <div aria-label="Weak prompt and response" className="rounded-xl border-2 border-rose-200 bg-gradient-to-b from-rose-50 to-white p-5 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center">
            <X className="w-4 h-4 text-rose-500" />
          </div>
          <span className="font-semibold text-rose-700">Vague Request</span>
        </div>
        <div className="bg-white rounded-lg p-3.5 mb-3 border border-rose-100">
          <p className="text-xs text-stone-400 mb-1 font-medium uppercase tracking-wide">
            The request
          </p>
          <p className="text-stone-700 italic text-sm">"{weakPrompt}"</p>
        </div>
        <div className="bg-white rounded-lg p-3.5 border border-rose-100">
          <p className="text-xs text-stone-400 mb-1 font-medium uppercase tracking-wide">
            What the AI gave back
          </p>
          <div className="text-stone-600 text-sm">
            <MarkdownText text={weakResponse} />
          </div>
        </div>
      </div>

      {/* Strong side */}
      <div aria-label="Strong prompt and response" className="rounded-xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="font-semibold text-emerald-700">Clear Request</span>
        </div>
        <div className="bg-white rounded-lg p-3.5 mb-3 border border-emerald-100">
          <p className="text-xs text-stone-400 mb-1 font-medium uppercase tracking-wide">
            The request
          </p>
          <p className="text-stone-700 italic text-sm">"{strongPrompt}"</p>
        </div>
        <div className="bg-white rounded-lg p-3.5 border border-emerald-100">
          <p className="text-xs text-stone-400 mb-1 font-medium uppercase tracking-wide">
            What the AI gave back
          </p>
          <div className="text-stone-600 text-sm">
            <MarkdownText text={strongResponse} />
          </div>
        </div>
      </div>
    </div>
  );
}
