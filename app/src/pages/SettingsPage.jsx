import React, { useState, useEffect } from "react";
import {
  ArrowLeft, Check, Trash2, ExternalLink, Shield,
} from "lucide-react";

const STORAGE_KEY = "promptbridge_provider";

const PROVIDERS = [
  {
    id: "gemini",
    name: "Gemini",
    tag: "Recommended, free",
    help: "Free at aistudio.google.com/apikey — recommended for getting started",
    link: "https://aistudio.google.com/apikey",
    keyLabel: "Gemini API Key",
  },
  {
    id: "claude",
    name: "Claude",
    tag: "BYOK",
    help: "From console.anthropic.com — higher quality, pay per use",
    link: "https://console.anthropic.com",
    keyLabel: "Claude API Key",
  },
  {
    id: "openai",
    name: "OpenAI",
    tag: "BYOK",
    help: "From platform.openai.com — pay per use",
    link: "https://platform.openai.com",
    keyLabel: "OpenAI API Key",
  },
];

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.provider && parsed.apiKey) return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export default function SettingsPage({ onBack }) {
  const [provider, setProvider] = useState("gemini");
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  // Load existing config on mount
  useEffect(() => {
    const config = loadConfig();
    if (config) {
      setProvider(config.provider);
      setApiKey(config.apiKey);
      setHasExisting(true);
      setSaved(true);
    }
  }, []);

  const selectedProvider = PROVIDERS.find(p => p.id === provider);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    const config = { provider, apiKey: apiKey.trim() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSaved(true);
    setHasExisting(true);
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey("");
    setSaved(false);
    setHasExisting(false);
  };

  const handleProviderChange = (id) => {
    setProvider(id);
    // When switching providers, clear saved state if key doesn't match
    setSaved(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Settings</h1>

      {/* Section header */}
      <div className="mt-8 mb-6">
        <h2 className="font-serif text-xl font-bold text-stone-800 mb-2">AI Provider for Free-form Mode</h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          Guided mode works without any setup — all content is built in.
          For free-form mode (writing your own prompts and getting AI feedback),
          you need an API key.
        </p>
      </div>

      {/* Provider selection */}
      <div className="space-y-3 mb-6">
        {PROVIDERS.map(p => (
          <label
            key={p.id}
            className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${
              provider === p.id
                ? "bg-indigo-50 border-indigo-300"
                : "bg-white border-stone-200 hover:border-stone-300"
            }`}
          >
            <input
              type="radio"
              name="provider"
              value={p.id}
              checked={provider === p.id}
              onChange={() => handleProviderChange(p.id)}
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-stone-800">{p.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.id === "gemini"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-stone-100 text-stone-500"
                }`}>
                  {p.tag}
                </span>
              </div>
              <p className="text-stone-400 text-xs mt-0.5">{p.help}</p>
            </div>
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-indigo-500 hover:text-indigo-700 flex-shrink-0"
              title={`Get ${p.name} API key`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </label>
        ))}
      </div>

      {/* API key input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          {selectedProvider?.keyLabel || "API Key"}
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => { setApiKey(e.target.value); setSaved(false); }}
          placeholder="Paste your API key here..."
          className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 placeholder:text-stone-300"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
        >
          Save
        </button>
        {hasExisting && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        )}
        {saved && apiKey.trim() && (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
            <Check className="w-4 h-4" /> Key saved
          </span>
        )}
      </div>

      {/* Privacy note */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-stone-400 flex-shrink-0 mt-0.5" />
        <p className="text-stone-500 text-xs leading-relaxed">
          Your API key is stored only in your browser's local storage. It is never sent anywhere except directly to the provider's API.
        </p>
      </div>
    </div>
  );
}
