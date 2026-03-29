import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AssessmentMode from "../pages/AssessmentMode";

vi.mock("../services/heuristic-scorer", () => ({
  scorePrompt: vi.fn((prompt, scenario) => ({
    score: prompt.length > 20 ? 75 : 25,
    principlesDetected: prompt.length > 20 ? scenario.principles : [],
    principlesMissing: prompt.length > 20 ? [] : scenario.principles,
    suggestions: [],
  })),
}));

const PRE_PROPS = {
  assessmentData: { pre: null, post: null },
  onComplete: vi.fn(),
  onBack: vi.fn(),
};

const POST_PROPS = {
  assessmentData: {
    pre: { date: "2026-01-01", scores: { totalScore: 40 }, prompts: ["a", "b", "c"] },
    post: null,
  },
  onComplete: vi.fn(),
  onBack: vi.fn(),
};

/** Type a prompt into the textarea and click the submit button. */
function submitPrompt(text) {
  const textarea = screen.getByLabelText("Write your prompt");
  fireEvent.change(textarea, { target: { value: text } });
  const submitBtn = screen.getByRole("button", { name: /Next|See Results/ });
  fireEvent.click(submitBtn);
}

describe("AssessmentMode", () => {
  // ------------------------------------------------------------------
  // 1. Intro screen renders for pre-assessment
  // ------------------------------------------------------------------
  it("shows 'See Where You Stand' heading for pre-assessment", () => {
    render(<AssessmentMode {...PRE_PROPS} />);
    expect(screen.getByText("See Where You Stand")).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // 2. Intro shows "Measure Your Progress" for post-assessment
  // ------------------------------------------------------------------
  it("shows 'Measure Your Progress' heading for post-assessment", () => {
    render(<AssessmentMode {...POST_PROPS} />);
    expect(screen.getByText("Measure Your Progress")).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // 3. Start button advances to scenario-0
  // ------------------------------------------------------------------
  it("advances to scenario-0 when Start button is clicked", () => {
    render(<AssessmentMode {...PRE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: /Start/ }));
    expect(screen.getByText("Scenario 1 of 3")).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // 4. Scenario step shows scenario title and textarea
  // ------------------------------------------------------------------
  it("shows scenario title and textarea on a scenario step", () => {
    render(<AssessmentMode {...PRE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: /Start/ }));

    // First PRE_SCENARIO is "1.3-meal-plan" with title "The meal plan"
    expect(screen.getByText("The meal plan")).toBeInTheDocument();
    expect(screen.getByLabelText("Write your prompt")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("How would you ask an AI to help with this?")).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // 5. Submit button disabled when textarea empty
  // ------------------------------------------------------------------
  it("disables submit button when textarea is empty", () => {
    render(<AssessmentMode {...PRE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: /Start/ }));

    const submitBtn = screen.getByRole("button", { name: /Next/ });
    expect(submitBtn).toBeDisabled();
  });

  // ------------------------------------------------------------------
  // 6. Submitting advances through scenarios to results
  // ------------------------------------------------------------------
  it("advances through scenario-0, scenario-1, scenario-2, then shows results", () => {
    render(<AssessmentMode {...PRE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: /Start/ }));

    // Scenario 1
    expect(screen.getByText("Scenario 1 of 3")).toBeInTheDocument();
    submitPrompt("This is a sufficiently long prompt for scenario one to pass the length check");

    // Scenario 2
    expect(screen.getByText("Scenario 2 of 3")).toBeInTheDocument();
    submitPrompt("This is a sufficiently long prompt for scenario two to pass the length check");

    // Scenario 3
    expect(screen.getByText("Scenario 3 of 3")).toBeInTheDocument();
    submitPrompt("This is a sufficiently long prompt for scenario three to pass the length check");

    // Results screen
    expect(screen.getByText("Your Starting Point")).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // 7. Results screen shows aggregate score
  // ------------------------------------------------------------------
  it("displays the aggregate score on the results screen", () => {
    render(<AssessmentMode {...PRE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: /Start/ }));

    submitPrompt("This is a sufficiently long prompt for scenario one to pass the length check");
    submitPrompt("This is a sufficiently long prompt for scenario two to pass the length check");
    submitPrompt("This is a sufficiently long prompt for scenario three to pass the length check");

    // Mock scorePrompt returns 75 for long prompts => average 75
    // The aggregate score appears once in the hero circle, plus once per scenario in the breakdown.
    const scoreElements = screen.getAllByText("75");
    expect(scoreElements.length).toBeGreaterThanOrEqual(1);
    // The large aggregate score is inside a w-20 h-20 circle
    const aggregateScore = scoreElements.find(
      (el) => el.className.includes("w-20")
    );
    expect(aggregateScore).toBeDefined();
  });

  // ------------------------------------------------------------------
  // 8. Results screen shows per-scenario breakdown
  // ------------------------------------------------------------------
  it("displays per-scenario scores in the results breakdown", () => {
    render(<AssessmentMode {...PRE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: /Start/ }));

    submitPrompt("This is a sufficiently long prompt for scenario one to pass the length check");
    submitPrompt("This is a sufficiently long prompt for scenario two to pass the length check");
    submitPrompt("This is a sufficiently long prompt for scenario three to pass the length check");

    expect(screen.getByText("Per-scenario scores")).toBeInTheDocument();
    // All three PRE scenario titles should appear in the breakdown
    expect(screen.getByText("The meal plan")).toBeInTheDocument();
    expect(screen.getByText("The tone mismatch")).toBeInTheDocument();
    expect(screen.getByText("The vague rejection")).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // 9. Back button calls onBack
  // ------------------------------------------------------------------
  it("calls onBack when the Back button is clicked", () => {
    const onBack = vi.fn();
    render(<AssessmentMode {...PRE_PROPS} onBack={onBack} />);

    fireEvent.click(screen.getByText("Back"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // ------------------------------------------------------------------
  // 10. onComplete called with correct type
  // ------------------------------------------------------------------
  it("calls onComplete with 'pre' type when no prior assessment data exists", () => {
    const onComplete = vi.fn();
    render(<AssessmentMode {...PRE_PROPS} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole("button", { name: /Start/ }));

    submitPrompt("This is a sufficiently long prompt for scenario one to pass the length check");
    submitPrompt("This is a sufficiently long prompt for scenario two to pass the length check");
    submitPrompt("This is a sufficiently long prompt for scenario three to pass the length check");

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toBe("pre");
    // Verify the result shape
    const result = onComplete.mock.calls[0][1];
    expect(result).toHaveProperty("date");
    expect(result).toHaveProperty("scores");
    expect(result).toHaveProperty("prompts");
    expect(result).toHaveProperty("scenarioIds");
    expect(result.scores.totalScore).toBe(75);
    expect(result.prompts).toHaveLength(3);
  });

  it("calls onComplete with 'post' type when prior assessment data exists", () => {
    const onComplete = vi.fn();
    render(<AssessmentMode {...POST_PROPS} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole("button", { name: /Start/ }));

    submitPrompt("This is a sufficiently long prompt for scenario one to pass the length check");
    submitPrompt("This is a sufficiently long prompt for scenario two to pass the length check");
    submitPrompt("This is a sufficiently long prompt for scenario three to pass the length check");

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toBe("post");
  });
});
