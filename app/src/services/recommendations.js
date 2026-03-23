// ============================================================
// Recommendations — Suggest next scenarios based on unpracticed principles
// ============================================================

import { PRINCIPLE_MAP } from "../data/principles";

/**
 * Get recommended next scenarios based on which principles the user
 * hasn't practiced yet. Prioritizes scenarios that teach the most
 * new (unpracticed) principles.
 *
 * @param {string[]} practicedPrinciples - IDs of principles already practiced (e.g., ["P1", "P2"])
 * @param {string[]} completedScenarios - IDs of scenarios already completed
 * @param {object[]} scenarios - Full scenario objects to choose from
 * @param {number} limit - Max recommendations to return
 * @returns {Array<{ scenario: object, unpracticedPrinciples: string[] }>}
 */
export function getRecommendedScenarios(practicedPrinciples, completedScenarios, scenarios, limit = 3) {
  const practicedSet = new Set(practicedPrinciples);
  const completedSet = new Set(completedScenarios);

  const scored = scenarios
    .filter(s => !completedSet.has(s.id))
    .map(s => {
      const unpracticed = (s.principles || []).filter(p => !practicedSet.has(p));
      return { scenario: s, unpracticedPrinciples: unpracticed };
    })
    .filter(r => r.unpracticedPrinciples.length > 0)
    .sort((a, b) => b.unpracticedPrinciples.length - a.unpracticedPrinciples.length);

  return scored.slice(0, limit);
}

/**
 * Build a human-readable recommendation message.
 *
 * @param {string[]} practicedPrinciples
 * @param {Array<{ scenario: object, unpracticedPrinciples: string[] }>} recommendations
 * @returns {{ practiced: string[], nextScenario: string, newSkills: string[] } | null}
 */
export function buildRecommendation(practicedPrinciples, recommendations) {
  if (!recommendations.length) return null;

  const top = recommendations[0];
  return {
    practiced: practicedPrinciples.map(id => PRINCIPLE_MAP[id]?.name).filter(Boolean),
    nextScenario: top.scenario.title,
    nextScenarioId: top.scenario.id,
    newSkills: top.unpracticedPrinciples.map(id => PRINCIPLE_MAP[id]?.name).filter(Boolean),
  };
}
