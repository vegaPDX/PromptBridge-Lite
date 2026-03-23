#!/usr/bin/env node

/**
 * PromptBridge — Scenario Validator
 *
 * Validates a scenario definition against the expected schema.
 *
 * Usage:
 *   node scripts/validate-scenario.js 1.1-snow-shoveling
 *   node scripts/validate-scenario.js --all
 */

import { SCENARIOS } from "../src/data/scenarios.js";

const VALID_CATEGORIES = [
  "vague_vs_specific",
  "context_and_framing",
  "iterative_refinement",
  "smart_strategies",
  "full_conversation_loop",
];

const VALID_PRINCIPLES = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];
const VALID_MODES = ["guided", "freeform"];
const VALID_RELEVANCE = ["work", "coding", "school", "personal", "other"];

function validate(scenario) {
  const errors = [];

  if (!scenario.id || typeof scenario.id !== "string") {
    errors.push("Missing or invalid 'id' (string required)");
  }

  if (!VALID_CATEGORIES.includes(scenario.category)) {
    errors.push(`Invalid category: "${scenario.category}". Must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  if (!scenario.title || scenario.title.length > 60) {
    errors.push("Title is missing or too long (max 60 characters)");
  }

  if (!scenario.situation || scenario.situation.length < 20) {
    errors.push("Situation is missing or too short (min 20 characters)");
  }

  if (!VALID_MODES.includes(scenario.mode)) {
    errors.push(`Invalid mode: "${scenario.mode}". Must be "guided" or "freeform"`);
  }

  if (!Array.isArray(scenario.principles) || scenario.principles.length === 0) {
    errors.push("Principles must be a non-empty array");
  } else {
    for (const p of scenario.principles) {
      if (!VALID_PRINCIPLES.includes(p)) {
        errors.push(`Invalid principle: "${p}". Must be one of: ${VALID_PRINCIPLES.join(", ")}`);
      }
    }
  }

  if (scenario.relevance) {
    if (!Array.isArray(scenario.relevance)) {
      errors.push("Relevance must be an array");
    } else {
      for (const r of scenario.relevance) {
        if (!VALID_RELEVANCE.includes(r)) {
          errors.push(`Invalid relevance tag: "${r}". Must be one of: ${VALID_RELEVANCE.join(", ")}`);
        }
      }
    }
  }

  if (scenario.mode === "guided" && !scenario.feedbackNotes) {
    errors.push("Guided scenarios should have feedbackNotes");
  }

  return errors;
}

// ── Main ────────────────────────────────────────────────────

const args = process.argv.slice(2);
const scenarioId = args[0];

if (!scenarioId) {
  console.error("Usage: node scripts/validate-scenario.js <scenario-id>");
  console.error("       node scripts/validate-scenario.js --all");
  process.exit(1);
}

if (scenarioId === "--all") {
  let totalErrors = 0;
  for (const s of SCENARIOS) {
    const errors = validate(s);
    if (errors.length > 0) {
      console.log(`\n  ${s.id}:`);
      errors.forEach(e => console.log(`    ${e}`));
      totalErrors += errors.length;
    }
  }
  if (totalErrors === 0) {
    console.log(`\n  All ${SCENARIOS.length} scenarios valid.`);
  } else {
    console.log(`\n  ${totalErrors} error(s) found.`);
    process.exit(1);
  }
} else {
  const scenario = SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) {
    console.error(`Scenario not found: ${scenarioId}`);
    console.error(`Available: ${SCENARIOS.map(s => s.id).join(", ")}`);
    process.exit(1);
  }

  const errors = validate(scenario);
  if (errors.length === 0) {
    console.log(`  ${scenarioId}: Valid`);
  } else {
    console.log(`  ${scenarioId}:`);
    errors.forEach(e => console.log(`    ${e}`));
    process.exit(1);
  }
}
