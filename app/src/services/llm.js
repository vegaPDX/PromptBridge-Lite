// ============================================================
// LLM Service — Multi-provider adapter (Gemini, Claude, OpenAI)
// ============================================================

import {
  FREEFORM_ANALYSIS_SYSTEM,
  RESPONSE_SIMULATOR_SYSTEM,
  VARIATION_GENERATOR_SYSTEM,
  MULTI_TURN_INITIAL_RESPONSE_SYSTEM,
  MULTI_TURN_IMPROVED_RESPONSE_SYSTEM,
  MULTI_TURN_FEEDBACK_SYSTEM,
  buildFreeformAnalysisMessage,
  buildResponseSimulatorMessage,
  buildVariationGeneratorMessage,
  buildMultiTurnInitialMessage,
  buildMultiTurnImprovedMessage,
  buildMultiTurnFeedbackMessage,
} from "../data/prompts.js";

const PROVIDER_STORAGE_KEY = "promptbridge_provider";

// ── Provider config ─────────────────────────────────────────

/**
 * Read provider configuration from localStorage.
 *
 * localStorage shape:
 *   { provider: "gemini"|"claude"|"openai", apiKey: "..." }
 */
export function getProviderConfig() {
  try {
    const raw = localStorage.getItem(PROVIDER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.provider && parsed.apiKey) {
        return parsed;
      }
    }
  } catch {
    // fall through
  }

  return { provider: null, apiKey: null };
}

/**
 * Returns true when a usable API key is configured.
 */
export function hasApiKey() {
  const { apiKey } = getProviderConfig();
  return Boolean(apiKey);
}

// ── Shared helpers ──────────────────────────────────────────

/**
 * Strip API key patterns from error messages to prevent leakage.
 */
function sanitizeErrorText(provider, status, errText) {
  const cleaned = errText
    .replace(/AIza[A-Za-z0-9_-]{30,}/g, "[REDACTED]")
    .replace(/sk-ant-[A-Za-z0-9_-]+/g, "[REDACTED]")
    .replace(/sk-[A-Za-z0-9]{20,}/g, "[REDACTED]")
    .slice(0, 500);
  return `${provider} API error (${status}): ${cleaned}`;
}

/**
 * Strip markdown code fences and parse as JSON.
 */
function parseJSON(text) {
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  return JSON.parse(cleaned);
}

// ── Gemini ──────────────────────────────────────────────────

export async function callGemini(
  apiKey,
  systemPrompt,
  userMessage,
  { temperature = 0.7, maxTokens = 1024 } = {}
) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    throw new Error(sanitizeErrorText("Gemini", response.status, errText));
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response from Gemini API");
  }

  return parseJSON(text);
}

// ── Claude ──────────────────────────────────────────────────

export async function callClaude(
  apiKey,
  systemPrompt,
  userMessage,
  { temperature = 0.7, maxTokens = 1024 } = {}
) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    throw new Error(sanitizeErrorText("Claude", response.status, errText));
  }

  const data = await response.json();
  if (!data.content || !data.content[0]) {
    throw new Error("Empty response from Claude API");
  }

  return parseJSON(data.content[0].text);
}

// ── OpenAI ──────────────────────────────────────────────────

export async function callOpenAI(
  apiKey,
  systemPrompt,
  userMessage,
  { temperature = 0.7, maxTokens = 1024 } = {}
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    throw new Error(sanitizeErrorText("OpenAI", response.status, errText));
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Empty response from OpenAI API");
  }

  return parseJSON(text);
}

// ── Router ──────────────────────────────────────────────────

/**
 * Call the currently-configured LLM provider.
 * Reads provider/key from localStorage (or env fallback) and
 * routes to the correct provider function.
 */
export async function callLLM(systemPrompt, userMessage, opts = {}) {
  const { provider, apiKey } = getProviderConfig();

  if (!apiKey) {
    throw new Error(
      "No API key configured. Go to Settings and add your API key."
    );
  }

  switch (provider) {
    case "gemini":
      return callGemini(apiKey, systemPrompt, userMessage, opts);
    case "claude":
      return callClaude(apiKey, systemPrompt, userMessage, opts);
    case "openai":
      return callOpenAI(apiKey, systemPrompt, userMessage, opts);
    default:
      throw new Error(`Unknown provider: "${provider}"`);
  }
}

// ── Convenience wrappers ────────────────────────────────────

/**
 * Analyze a user-written freeform prompt for a given scenario.
 */
export async function analyzeFreeform(scenario, userPrompt, userContext) {
  const userMsg = buildFreeformAnalysisMessage(scenario, userPrompt, userContext);
  return callLLM(FREEFORM_ANALYSIS_SYSTEM, userMsg, {
    temperature: 0.4,
    maxTokens: 1200,
  });
}

/**
 * Generate weak/medium/strong variations of a user-written prompt.
 */
export async function generateVariations(scenario, userPrompt) {
  const userMsg = buildVariationGeneratorMessage(scenario, userPrompt);
  return callLLM(VARIATION_GENERATOR_SYSTEM, userMsg, {
    temperature: 0.8,
    maxTokens: 800,
  });
}

/**
 * Simulate weak/strong AI responses for the comparison view.
 */
export async function simulateResponses(weakPrompt, strongPrompt, situation) {
  const userMsg = buildResponseSimulatorMessage(weakPrompt, strongPrompt, situation);
  return callLLM(RESPONSE_SIMULATOR_SYSTEM, userMsg, {
    temperature: 0.5,
    maxTokens: 1500,
  });
}

/**
 * Generate a mediocre initial AI response for multi-turn practice.
 */
export async function generateInitialResponse(scenario, userPrompt) {
  const userMsg = buildMultiTurnInitialMessage(scenario, userPrompt);
  return callLLM(MULTI_TURN_INITIAL_RESPONSE_SYSTEM, userMsg, {
    temperature: 0.5,
    maxTokens: 800,
  });
}

/**
 * Generate an improved AI response after a follow-up in multi-turn practice.
 */
export async function generateImprovedResponse(scenario, initialPrompt, initialResponse, followUp) {
  const userMsg = buildMultiTurnImprovedMessage(scenario, initialPrompt, initialResponse, followUp);
  return callLLM(MULTI_TURN_IMPROVED_RESPONSE_SYSTEM, userMsg, {
    temperature: 0.5,
    maxTokens: 1200,
  });
}

/**
 * Analyze the full multi-turn conversation and provide feedback.
 */
export async function generateMultiTurnFeedback(scenario, initialPrompt, initialResponse, followUp, improvedResponse) {
  const userMsg = buildMultiTurnFeedbackMessage(scenario, initialPrompt, initialResponse, followUp, improvedResponse);
  return callLLM(MULTI_TURN_FEEDBACK_SYSTEM, userMsg, {
    temperature: 0.3,
    maxTokens: 600,
  });
}
