import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import fs from "fs";
import path from "path";

import { scorePrompt } from "../services/heuristic-scorer";
import { PRINCIPLES } from "../data/principles";
import { getRecommendedScenarios } from "../services/recommendations";
import LandingPage from "../pages/LandingPage";

// ---------------------------------------------------------------------------
// Test 1: Feedback format verification (extends data-integrity)
// ---------------------------------------------------------------------------
describe("Feedback format verification", () => {
  const GENERATED_DIR = path.resolve(__dirname, "../data/generated");
  const generatedFiles = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith(".json"));

  it("all feedback.principle and feedback.principle_name are not identical (content quality)", () => {
    const duplicates = [];
    for (const file of generatedFiles) {
      const content = JSON.parse(fs.readFileSync(path.join(GENERATED_DIR, file), "utf-8"));
      if (content.feedback.principle === content.feedback.principle_name) {
        duplicates.push(file);
      }
    }
    expect(duplicates).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Test 2: P5 curly/smart quote detection
// ---------------------------------------------------------------------------
describe("P5 curly quote detection", () => {
  it("detects curly double quotes (smart quotes from Word/Google Docs)", () => {
    const result = scorePrompt(
      '\u201CThis is the kind of warm, casual tone I prefer for all customer emails\u201D',
      { principles: ["P5"] }
    );
    expect(result.principlesDetected).toContain("P5");
  });

  it("detects regular straight quotes (20+ chars)", () => {
    const result = scorePrompt(
      '"This is a quoted block that is definitely over twenty characters long"',
      { principles: ["P5"] }
    );
    expect(result.principlesDetected).toContain("P5");
  });

  it("does not trigger on short quoted text (under 20 chars)", () => {
    const result = scorePrompt(
      '"hello world"',
      { principles: ["P5"] }
    );
    // Should NOT detect P5 from this short quote alone
    expect(result.principlesMissing).toContain("P5");
  });
});

// ---------------------------------------------------------------------------
// Test 3: scorePrompt edge cases
// ---------------------------------------------------------------------------
describe("scorePrompt edge cases", () => {
  it("handles undefined scenario.principles gracefully", () => {
    const result = scorePrompt("some text", {});
    expect(result.score).toBe(0);
    expect(result.principlesDetected).toEqual([]);
  });

  it("handles null-ish prompt by not crashing", () => {
    // Empty string already tested elsewhere, but test with whitespace-only
    const result = scorePrompt("   ", { principles: ["P1", "P2"] });
    expect(result).toHaveProperty("score");
  });
});

// ---------------------------------------------------------------------------
// Test 4: ProgressPage teaching order
// ---------------------------------------------------------------------------
describe("ProgressPage teaching order", () => {
  it("principles sorted by teachingOrder produce expected sequence", () => {
    const sorted = [...PRINCIPLES].sort((a, b) => a.teachingOrder - b.teachingOrder);
    const ids = sorted.map(p => p.id);
    expect(ids).toEqual(["P8", "P1", "P2", "P5", "P3", "P7", "P4", "P6", "P9", "P10", "P11", "P12"]);
  });

  it("spread-then-sort does not mutate original PRINCIPLES array", () => {
    const originalOrder = PRINCIPLES.map(p => p.id);
    [...PRINCIPLES].sort((a, b) => a.teachingOrder - b.teachingOrder);
    const afterOrder = PRINCIPLES.map(p => p.id);
    expect(afterOrder).toEqual(originalOrder);
  });
});

// ---------------------------------------------------------------------------
// Test 5: Recommendation engine unknown principle fallback
// ---------------------------------------------------------------------------
describe("Recommendation engine edge cases", () => {
  it("handles scenario with unknown principle ID without crashing", () => {
    const fakeScenarios = [
      { id: "test-1", principles: ["P1", "INVALID"], mode: "guided", category: "vague_vs_specific", title: "Test", situation: "Test" },
    ];
    const recs = getRecommendedScenarios([], [], fakeScenarios, 5);
    expect(recs).toBeDefined();
    expect(Array.isArray(recs)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Test 6: LandingPage smoke tests
// ---------------------------------------------------------------------------
describe("LandingPage", () => {
  it("renders hero heading", () => {
    render(<LandingPage onNavigate={() => {}} />);
    expect(screen.getByText("Learn to talk to AI")).toBeInTheDocument();
  });

  it("renders the demo toggle button", () => {
    render(<LandingPage onNavigate={() => {}} />);
    expect(screen.getByText(/Now see what happens/)).toBeInTheDocument();
  });

  it("reveals good example on button click", () => {
    render(<LandingPage onNavigate={() => {}} />);
    fireEvent.click(screen.getByText(/Now see what happens/));
    // After click, the AI honesty section should appear
    expect(screen.getByText("We believe in being honest about AI")).toBeInTheDocument();
  });

  it("renders all 12 principle names", () => {
    render(<LandingPage onNavigate={() => {}} />);
    expect(screen.getByText("Be specific, not vague")).toBeInTheDocument();
    expect(screen.getByText("Ask the AI to write prompts for you")).toBeInTheDocument();
    expect(screen.getByText("Use AI responsibly")).toBeInTheDocument();
  });

  it("calls onNavigate when CTA button is clicked", () => {
    const onNavigate = vi.fn();
    render(<LandingPage onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText("Try It Yourself"));
    expect(onNavigate).toHaveBeenCalledWith("scenarios");
  });
});
