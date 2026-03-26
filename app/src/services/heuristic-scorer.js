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
      const exampleMarkers = /\b(for example|like this|such as|in the format|formatted as|bullet points|table|numbered list|similar to|here's an example|style of|here's an example of what i want|here's a sample|something like|for reference|like this:|similar to:|for instance|modeled on|in the style of|based on this example)\b/i;
      // Also detect quoted text blocks (users pasting examples)
      const hasQuotedBlock = /["""\u201C\u201D][^"""\u201C\u201D]{20,}["""\u201C\u201D]/.test(prompt) || /```[\s\S]{10,}```/.test(prompt) || /^>.*$/m.test(prompt);
      return exampleMarkers.test(prompt) || hasQuotedBlock;
    },
    suggestion: "Show the AI what you want — paste an example of the format, tone, or style you're looking for. This one technique can improve AI accuracy from 0% to 90%.",
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
  P9: {
    name: "Verify before you trust",
    test(prompt) {
      const verifyMarkers = /\b(verify|source|cite|citation|confident|confidence|sure about|how certain|double[-\s]?check|fact[-\s]?check|evidence|reference|prove|are you sure|is that accurate|check your|review your)\b/i;
      return verifyMarkers.test(prompt);
    },
    suggestion: "Ask the AI to show where it got its information, flag what it's unsure about, or double-check its own answer.",
  },
  P10: {
    name: "Include everything needed — but nothing extra",
    test(prompt) {
      const words = prompt.trim().split(/\s+/).length;
      const hasStructure = /(\d[\.\)]\s|^[-•]\s|first|second|third|specifically|the key|most important)/im.test(prompt);
      return words >= 20 && (words <= 100 || hasStructure);
    },
    suggestion: "Check if your prompt includes all the essential details without extra information that might distract the AI. Try organizing long requests with bullet points or numbered items.",
  },
  P11: {
    name: "Know what AI can't do",
    test(prompt) {
      const limitMarkers = /\b(knowledge cutoff|training data|cut[-\s]?off|can you access|do you have access|do you know about recent|up to date|real[-\s]?time|current information|personal experience|your limitations|what don['']?t you know|what can['']?t you|are you able to|browse|internet access|after your training)\b/i;
      return limitMarkers.test(prompt);
    },
    suggestion: "Ask the AI about its limitations — when its training data ends, whether it can access the internet, or what it doesn't know about this topic.",
  },
  P12: {
    name: "Use AI responsibly",
    test(prompt) {
      const responsibleMarkers = /\b(bias|biased|stereotype|assumption|one[-\s]?sided|fair|fairness|inclusive|diverse|harmful|sensitive|ethical|responsible|check for|review for|any assumptions|different perspectives|who might this|could this be)\b/i;
      return responsibleMarkers.test(prompt);
    },
    suggestion: "Ask the AI to check its response for bias, assumptions, or one-sided perspectives — especially when the output affects people.",
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

/**
 * Generate a friendly one-line summary from heuristic results.
 */
export function getFeedbackSummary(result) {
  const { score, principlesDetected, principlesMissing } = result;
  if (score >= 75) return "Strong prompt! You applied the key skills for this scenario.";
  const missingNames = principlesMissing.map(id => PRINCIPLE_MAP[id]?.name).filter(Boolean);
  if (score >= 40) {
    return `Good start — you applied ${principlesDetected.length} skill${principlesDetected.length !== 1 ? "s" : ""}. Try adding ${missingNames.join(" and ")} to strengthen it.`;
  }
  return `Keep practicing! Try adding more detail — ${missingNames.join(", ")}.`;
}
