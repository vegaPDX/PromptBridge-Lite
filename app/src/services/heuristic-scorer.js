// ============================================================
// Heuristic Scorer — Client-side prompt quality scoring
// No LLM needed. Scores a user's prompt against the principles
// associated with a given scenario.
// ============================================================

import { PRINCIPLE_MAP } from "../data/principles";

const PRINCIPLE_CHECKS = {
  P1: {
    name: "Be specific, not vague",
    test(prompt) {
      const words = prompt.trim().split(/\s+/).length;
      const hasNumbers = /\d/.test(prompt);
      const isKeywordStyle = words <= 5;
      return words > 15 && !isKeywordStyle && hasNumbers;
    },
    suggestion: "Add specific details like numbers, quantities, or exact requirements.",
  },
  P2: {
    name: "Provide context",
    test(prompt) {
      const contextMarkers = /\b(i am|i'm|my |we |our |i work|i have|currently|background|situation|constraint|because)\b/i;
      return contextMarkers.test(prompt);
    },
    suggestion: "Add who you are, what you're working on, or what constraints exist.",
  },
  P3: {
    name: "State your intent",
    test(prompt) {
      const intentMarkers = /\b(i need to|i want to|so that|so i can|for |because |i'll use|the goal|the purpose|this is for|i'm trying to)\b/i;
      return intentMarkers.test(prompt);
    },
    suggestion: "Explain what you'll use the result for — it helps the AI tailor its answer.",
  },
  P4: {
    name: "Avoid ambiguity",
    test(prompt) {
      const binaryStarters = /^(do you know|can you|is it possible|is there|are there|have you|would you|could you)\b/i;
      return !binaryStarters.test(prompt.trim());
    },
    suggestion: "Rephrase yes/no questions as direct requests. Instead of 'Do you know...?', try 'Tell me...' or 'List...'",
  },
  P5: {
    name: "Show what 'good' looks like",
    test(prompt) {
      const exampleMarkers = /\b(for example|like this|such as|in the format|formatted as|bullet points|table|numbered list|similar to|here's an example|style of)\b/i;
      return exampleMarkers.test(prompt);
    },
    suggestion: "Give an example of the format, tone, or style you want in the response.",
  },
  P6: {
    name: "Give specific feedback",
    test(prompt) {
      const feedbackMarkers = /\b(change the|make it more|make it less|instead of|too formal|too casual|too long|too short|more specific|less generic|keep the|remove the|add more)\b/i;
      return feedbackMarkers.test(prompt);
    },
    suggestion: "Be specific about what to change — say what's wrong AND what you want instead.",
  },
  P7: {
    name: "Ask the AI to ask you questions",
    test(prompt) {
      const interviewMarkers = /\b(ask me|what do you need|what questions|interview me|what information|what else do you need|before you start)\b/i;
      return interviewMarkers.test(prompt);
    },
    suggestion: "Try adding 'Before you start, ask me any questions you need answered.'",
  },
  P8: {
    name: "Ask the AI to write prompts for you",
    test(prompt) {
      const promptWriteMarkers = /\b(write a prompt|create a prompt|reusable|template|save this as|turn this into a prompt|crystallize)\b/i;
      return promptWriteMarkers.test(prompt);
    },
    suggestion: "Ask the AI to write a reusable prompt based on what you've discussed.",
  },
};

/**
 * Score a user-written prompt against the principles of a given scenario.
 *
 * @param {string} userPrompt - The prompt the user wrote
 * @param {object} scenario - The scenario object (must have .principles array)
 * @returns {{ score: number, principlesDetected: string[], principlesMissing: string[], suggestions: string[] }}
 */
export function scorePrompt(userPrompt, scenario) {
  const relevantPrinciples = scenario.principles || [];
  const detected = [];
  const missing = [];
  const suggestions = [];

  for (const pid of relevantPrinciples) {
    const check = PRINCIPLE_CHECKS[pid];
    if (!check) continue;

    if (check.test(userPrompt)) {
      detected.push(pid);
    } else {
      missing.push(pid);
      suggestions.push(`${PRINCIPLE_MAP[pid]?.name}: ${check.suggestion}`);
    }
  }

  const total = relevantPrinciples.length;
  const score = total > 0 ? Math.round((detected.length / total) * 100) : 0;

  return {
    score,
    principlesDetected: detected,
    principlesMissing: missing,
    suggestions,
  };
}
