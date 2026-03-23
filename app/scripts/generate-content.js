#!/usr/bin/env node

/**
 * PromptBridge — Static Content Generator
 *
 * Generates all static content for 30 guided scenarios.
 * Run once, produces JSON files that ship with the app.
 *
 * Usage:
 *   node scripts/generate-content.js                    # Uses Claude (default)
 *   node scripts/generate-content.js --provider gemini  # Uses Gemini free tier
 *   node scripts/generate-content.js --scenario 1.1-snow-shoveling  # Single scenario
 *
 * Env vars:
 *   ANTHROPIC_API_KEY  — for Claude provider (default)
 *   GEMINI_API_KEY     — for Gemini provider
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GUIDED_SCENARIOS } from "../src/data/scenarios.js";
import {
  OPTION_GENERATOR_SYSTEM,
  RESPONSE_SIMULATOR_SYSTEM,
  FEEDBACK_GENERATOR_SYSTEM,
  buildOptionGeneratorMessage,
  buildResponseSimulatorMessage,
  buildFeedbackGeneratorMessage,
} from "../src/data/prompts.js";
import { PRINCIPLE_MAP } from "../src/data/principles.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "generated");

// ── CLI args ────────────────────────────────────────────────

const args = process.argv.slice(2);
const providerFlag = args.includes("--provider") ? args[args.indexOf("--provider") + 1] : "claude";
const scenarioFlag = args.includes("--scenario") ? args[args.indexOf("--scenario") + 1] : null;

const PROVIDER = providerFlag || "claude";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (PROVIDER === "claude" && !ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY env var is required for Claude provider.");
  console.error("Set it: export ANTHROPIC_API_KEY=sk-ant-...");
  console.error("Or use Gemini: node scripts/generate-content.js --provider gemini");
  process.exit(1);
}

if (PROVIDER === "gemini" && !GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY env var is required for Gemini provider.");
  console.error("Get a free key at: https://aistudio.google.com/apikey");
  process.exit(1);
}

// ── LLM Call Functions ──────────────────────────────────────

async function callClaude(systemPrompt, userMessage, { temperature = 0.7, maxTokens = 1024 } = {}) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`Claude API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (!data.content || !data.content[0]) throw new Error("Empty response from Claude");
  return parseJSON(data.content[0].text);
}

async function callGemini(systemPrompt, userMessage, { temperature = 0.7, maxTokens = 1024 } = {}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");
  return parseJSON(text);
}

function parseJSON(text) {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // If parsing fails, sanitize control characters inside string values only.
    // Walk through the text and replace raw control chars inside quoted strings.
    let inString = false;
    let escaped = false;
    let result = "";
    for (const ch of cleaned) {
      if (escaped) { escaped = false; result += ch; continue; }
      if (ch === "\\") { escaped = true; result += ch; continue; }
      if (ch === '"') { inString = !inString; result += ch; continue; }
      if (inString && ch.charCodeAt(0) < 32) {
        // Replace raw control characters inside strings
        if (ch === "\n") { result += "\\n"; continue; }
        if (ch === "\r") { result += "\\r"; continue; }
        if (ch === "\t") { result += "\\t"; continue; }
        result += " "; continue;
      }
      result += ch;
    }
    return JSON.parse(result);
  }
}

async function callLLM(systemPrompt, userMessage, opts = {}) {
  if (PROVIDER === "gemini") return callGemini(systemPrompt, userMessage, opts);
  return callClaude(systemPrompt, userMessage, opts);
}

// ── Rate Limiting ───────────────────────────────────────────

const DELAY_MS = PROVIDER === "gemini" ? 4500 : 1000; // Gemini free: 15 RPM → ~4s between calls

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Generation Pipeline ─────────────────────────────────────

async function generateForScenario(scenario) {
  const outputPath = path.join(OUTPUT_DIR, `${scenario.id}.json`);

  // Skip if already generated (resumability)
  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭  Skipping ${scenario.id} (already exists)`);
    return;
  }

  console.log(`  📝 Generating options...`);
  const principleNames = scenario.principles.map(p => PRINCIPLE_MAP[p]?.name || p).join(", ");
  const optionsResult = await callLLM(
    OPTION_GENERATOR_SYSTEM,
    buildOptionGeneratorMessage(scenario, principleNames),
    { temperature: 0.8, maxTokens: 800 }
  );
  await sleep(DELAY_MS);

  const options = optionsResult.options;
  const weakOpt = options.find(o => o.quality === "weak");
  const strongOpt = options.find(o => o.quality === "strong");

  if (!weakOpt || !strongOpt) {
    throw new Error(`Missing weak/strong options for ${scenario.id}`);
  }

  console.log(`  🔄 Generating responses...`);
  const responses = await callLLM(
    RESPONSE_SIMULATOR_SYSTEM,
    buildResponseSimulatorMessage(weakOpt.text, strongOpt.text, scenario.situation),
    { temperature: 0.5, maxTokens: 1500 }
  );
  await sleep(DELAY_MS);

  // Generate feedback for each possible user choice
  const feedback = {};
  for (const quality of ["weak", "medium", "strong"]) {
    const userChoice = options.find(o => o.quality === quality);
    console.log(`  💬 Generating feedback (user picks ${quality})...`);
    const fb = await callLLM(
      FEEDBACK_GENERATOR_SYSTEM,
      buildFeedbackGeneratorMessage(scenario, options, userChoice, responses),
      { temperature: 0.3, maxTokens: 600 }
    );
    feedback[quality] = fb;
    await sleep(DELAY_MS);
  }

  const output = {
    scenarioId: scenario.id,
    generatedAt: new Date().toISOString(),
    generatedWith: PROVIDER === "gemini" ? "gemini-2.0-flash" : "claude-sonnet-4-20250514",
    options,
    responses,
    feedback,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`  ✅ Saved ${scenario.id}.json`);
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌉 PromptBridge Content Generator`);
  console.log(`   Provider: ${PROVIDER}`);
  console.log(`   Output:   ${OUTPUT_DIR}\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Filter to specific scenario if requested
  const scenarios = scenarioFlag
    ? GUIDED_SCENARIOS.filter(s => s.id === scenarioFlag)
    : GUIDED_SCENARIOS;

  if (scenarios.length === 0) {
    console.error(`No matching scenarios found for: ${scenarioFlag}`);
    process.exit(1);
  }

  console.log(`   Scenarios: ${scenarios.length} guided scenarios`);
  console.log(`   API calls: ~${scenarios.length * 5} total (5 per scenario)\n`);

  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    console.log(`[${i + 1}/${scenarios.length}] ${scenario.title} (${scenario.id})`);
    try {
      await generateForScenario(scenario);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      console.error(`     Run again to retry — completed scenarios will be skipped.\n`);
      // Continue with next scenario instead of stopping
    }
  }

  // Summary
  const generated = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith(".json")).length;
  console.log(`\n🏁 Done! Generated ${generated}/${GUIDED_SCENARIOS.length} scenarios.`);
  if (generated < GUIDED_SCENARIOS.length) {
    console.log(`   Run again to retry failed scenarios.`);
  }
}

main().catch(err => {
  console.error(`\nFatal error: ${err.message}`);
  process.exit(1);
});
