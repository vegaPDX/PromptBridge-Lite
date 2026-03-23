import React, { useState, useEffect } from "react";
import { ExternalLink, Copy, Check } from "lucide-react";

const AI_TOOLS = [
  { name: "ChatGPT", url: "https://chatgpt.com" },
  { name: "Claude", url: "https://claude.ai" },
  { name: "Gemini", url: "https://gemini.google.com" },
  { name: "Copilot", url: "https://copilot.microsoft.com" },
];

export default function AiToolLinks({ prompt, message }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
      {prompt && (
        <button
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors mb-4 ${
            copied
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {copied ? (
            <><Check className="w-4 h-4" /> Copied!</>
          ) : (
            <><Copy className="w-4 h-4" /> Copy your prompt</>
          )}
        </button>
      )}
      <p className="text-sm text-stone-600 mb-3">
        {message || "Paste it into any AI tool and see how it responds:"}
      </p>
      <div className="flex flex-wrap gap-2">
        {AI_TOOLS.map(tool => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors"
          >
            {tool.name}
            <ExternalLink className="w-3 h-3" />
          </a>
        ))}
      </div>
    </div>
  );
}
