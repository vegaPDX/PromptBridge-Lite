import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AiSafetyBanner from "../components/AiSafetyBanner";
import PreScenarioBanner from "../components/PreScenarioBanner";
import Header from "../components/Header";

describe("AiSafetyBanner", () => {
  it("renders welcome heading", () => {
    render(<AiSafetyBanner onDismiss={() => {}} />);
    expect(screen.getByText("Welcome to PromptBridge")).toBeInTheDocument();
  });

  it("renders 3 AI facts", () => {
    render(<AiSafetyBanner onDismiss={() => {}} />);
    expect(screen.getByText(/AI sounds equally confident/)).toBeInTheDocument();
    expect(screen.getByText(/AI is trained to agree with you/)).toBeInTheDocument();
    expect(screen.getByText(/60% of AI frustrations/)).toBeInTheDocument();
  });

  it("renders dismiss button with correct text", () => {
    render(<AiSafetyBanner onDismiss={() => {}} />);
    expect(screen.getByText("Got it, let's start learning")).toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button is clicked", () => {
    const onDismiss = vi.fn();
    render(<AiSafetyBanner onDismiss={onDismiss} />);
    fireEvent.click(screen.getByText("Got it, let's start learning"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss when X button is clicked", () => {
    const onDismiss = vi.fn();
    render(<AiSafetyBanner onDismiss={onDismiss} />);
    fireEvent.click(screen.getByLabelText("Dismiss welcome banner"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("PreScenarioBanner", () => {
  it("renders the reminder text", () => {
    render(<PreScenarioBanner onDismiss={() => {}} />);
    expect(screen.getByText(/AI can sound confident and still be wrong/)).toBeInTheDocument();
  });

  it("calls onDismiss when X button is clicked", () => {
    const onDismiss = vi.fn();
    render(<PreScenarioBanner onDismiss={onDismiss} />);
    fireEvent.click(screen.getByLabelText("Dismiss reminder"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("Header", () => {
  it("renders 'AI Limits' text label", () => {
    render(<Header page="landing" practicedPrinciples={[]} onNavigate={() => {}} />);
    expect(screen.getByText("AI Limits")).toBeInTheDocument();
  });

  it("renders Scenarios and Progress nav buttons", () => {
    render(<Header page="landing" practicedPrinciples={[]} onNavigate={() => {}} />);
    expect(screen.getByText("Scenarios")).toBeInTheDocument();
    expect(screen.getByText("Progress")).toBeInTheDocument();
  });

  it("renders PromptBridge logo/title", () => {
    render(<Header page="landing" practicedPrinciples={[]} onNavigate={() => {}} />);
    expect(screen.getByText("PromptBridge")).toBeInTheDocument();
  });

  it("shows principle count badge when principles are practiced", () => {
    render(<Header page="landing" practicedPrinciples={["P1", "P2"]} onNavigate={() => {}} />);
    expect(screen.getByText("2/12")).toBeInTheDocument();
  });

  it("does not show badge when no principles are practiced", () => {
    render(<Header page="landing" practicedPrinciples={[]} onNavigate={() => {}} />);
    expect(screen.queryByText(/\/12/)).not.toBeInTheDocument();
  });

  it("highlights AI safety button when on ai-safety page", () => {
    render(<Header page="ai-safety" practicedPrinciples={[]} onNavigate={() => {}} />);
    const aiLimitsButton = screen.getByText("AI Limits").closest("button");
    expect(aiLimitsButton.className).toContain("bg-amber-50");
    expect(aiLimitsButton.className).toContain("text-amber-700");
  });

  it("calls onNavigate with correct page when buttons are clicked", () => {
    const onNavigate = vi.fn();
    render(<Header page="landing" practicedPrinciples={[]} onNavigate={onNavigate} />);

    fireEvent.click(screen.getByText("Scenarios"));
    expect(onNavigate).toHaveBeenCalledWith("scenarios");

    fireEvent.click(screen.getByText("Progress"));
    expect(onNavigate).toHaveBeenCalledWith("progress");

    fireEvent.click(screen.getByText("AI Limits"));
    expect(onNavigate).toHaveBeenCalledWith("ai-safety");
  });
});
