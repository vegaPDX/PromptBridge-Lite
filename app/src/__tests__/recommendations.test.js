import { describe, it, expect } from "vitest";
import { getRecommendedScenarios, buildRecommendation } from "../services/recommendations";
import { PRINCIPLES } from "../data/principles";
import { GUIDED_SCENARIOS } from "../data/scenarios";

describe("Recommendation engine — teaching order", () => {
  it("new users (no practiced principles) get P8 scenarios first", () => {
    const recs = getRecommendedScenarios([], [], GUIDED_SCENARIOS, 5);
    expect(recs.length).toBeGreaterThan(0);

    // The first recommendation should include P8 (teachingOrder 1)
    const firstRec = recs[0];
    expect(firstRec.unpracticedPrinciples).toContain("P8");
  });

  it("users who completed P8 get P1 scenarios next", () => {
    // Mark all P8 scenarios as completed so they're excluded
    const p8ScenarioIds = GUIDED_SCENARIOS
      .filter((s) => s.principles.includes("P8"))
      .map((s) => s.id);

    const recs = getRecommendedScenarios(["P8"], p8ScenarioIds, GUIDED_SCENARIOS, 5);
    expect(recs.length).toBeGreaterThan(0);

    // First recommendation should prioritize P1 (teachingOrder 2)
    const firstRec = recs[0];
    const minOrder = Math.min(
      ...firstRec.unpracticedPrinciples.map((id) => {
        const p = PRINCIPLES.find((pr) => pr.id === id);
        return p ? p.teachingOrder : 99;
      })
    );
    // P1 has teachingOrder 2, so the min should be 2
    expect(minOrder).toBe(2);
  });

  it("recommendation order follows teachingOrder sequence", () => {
    const recs = getRecommendedScenarios([], [], GUIDED_SCENARIOS, 10);

    // Extract the minimum teachingOrder for each recommendation
    const orders = recs.map((r) =>
      Math.min(
        ...r.unpracticedPrinciples.map((id) => {
          const p = PRINCIPLES.find((pr) => pr.id === id);
          return p ? p.teachingOrder : 99;
        })
      )
    );

    // Orders should be non-decreasing (sorted ascending)
    for (let i = 1; i < orders.length; i++) {
      expect(orders[i]).toBeGreaterThanOrEqual(orders[i - 1]);
    }
  });

  it("does not recommend already-completed scenarios", () => {
    const completedIds = GUIDED_SCENARIOS.slice(0, 5).map((s) => s.id);
    const recs = getRecommendedScenarios([], completedIds, GUIDED_SCENARIOS, 20);

    for (const rec of recs) {
      expect(completedIds).not.toContain(rec.scenario.id);
    }
  });

  it("does not recommend scenarios where all principles are practiced", () => {
    // Practice P1 and P4 — scenario 1.1-snow-shoveling uses [P1, P4]
    const recs = getRecommendedScenarios(["P1", "P4"], [], GUIDED_SCENARIOS, 50);

    for (const rec of recs) {
      // Every recommendation should have at least one unpracticed principle
      expect(rec.unpracticedPrinciples.length).toBeGreaterThan(0);
    }
  });

  it("returns empty array when all scenarios are completed", () => {
    const allIds = GUIDED_SCENARIOS.map((s) => s.id);
    const recs = getRecommendedScenarios([], allIds, GUIDED_SCENARIOS, 5);
    expect(recs).toEqual([]);
  });

  it("respects the limit parameter", () => {
    const recs = getRecommendedScenarios([], [], GUIDED_SCENARIOS, 3);
    expect(recs.length).toBeLessThanOrEqual(3);
  });
});

describe("buildRecommendation", () => {
  it("returns recommendation info for valid input", () => {
    const recs = getRecommendedScenarios([], [], GUIDED_SCENARIOS, 3);
    const result = buildRecommendation([], recs);

    expect(result).not.toBeNull();
    expect(result.nextScenario).toBeTruthy();
    expect(result.nextScenarioId).toBeTruthy();
    expect(Array.isArray(result.newSkills)).toBe(true);
    expect(result.newSkills.length).toBeGreaterThan(0);
  });

  it("returns null for empty recommendations", () => {
    const result = buildRecommendation([], []);
    expect(result).toBeNull();
  });

  it("includes practiced principle names", () => {
    const recs = getRecommendedScenarios(["P1"], [], GUIDED_SCENARIOS, 3);
    const result = buildRecommendation(["P1"], recs);

    expect(result.practiced).toContain("Be specific, not vague");
  });
});
