import { describe, it, expect } from "vitest";
import { scorePrompt, getFeedbackSummary } from "../services/heuristic-scorer";

// Helper: score a prompt against a single principle
function testPrinciple(prompt, principleId) {
  const scenario = { principles: [principleId] };
  return scorePrompt(prompt, scenario);
}

describe("Heuristic scorer — P1 (Be specific)", () => {
  it("detects a specific prompt with numbers and sufficient length", () => {
    const result = testPrinciple(
      "I need a 5-paragraph essay about climate change focusing on 3 key solutions for reducing carbon emissions by 2030",
      "P1"
    );
    expect(result.principlesDetected).toContain("P1");
  });

  it("rejects a short keyword-style prompt", () => {
    const result = testPrinciple("climate change essay", "P1");
    expect(result.principlesMissing).toContain("P1");
  });
});

describe("Heuristic scorer — P2 (Provide context)", () => {
  it("detects context markers like 'I am' or 'my'", () => {
    const result = testPrinciple("I am a teacher working on my lesson plan for next week", "P2");
    expect(result.principlesDetected).toContain("P2");
  });

  it("rejects prompt without context", () => {
    const result = testPrinciple("Write a lesson plan", "P2");
    expect(result.principlesMissing).toContain("P2");
  });
});

describe("Heuristic scorer — P3 (State your intent)", () => {
  it("detects intent markers like 'I need to' or 'so that'", () => {
    const result = testPrinciple("I need to write a report so that my manager can review progress", "P3");
    expect(result.principlesDetected).toContain("P3");
  });

  it("rejects prompt without stated intent", () => {
    const result = testPrinciple("Write a report about project status", "P3");
    expect(result.principlesMissing).toContain("P3");
  });
});

describe("Heuristic scorer — P4 (Avoid ambiguity)", () => {
  it("passes for a direct request", () => {
    const result = testPrinciple("List the top 5 productivity frameworks", "P4");
    expect(result.principlesDetected).toContain("P4");
  });

  it("flags a yes/no question starting with 'Do you know'", () => {
    const result = testPrinciple("Do you know about productivity frameworks?", "P4");
    expect(result.principlesMissing).toContain("P4");
  });

  it("flags questions starting with 'Can you'", () => {
    const result = testPrinciple("Can you help me with this?", "P4");
    expect(result.principlesMissing).toContain("P4");
  });
});

describe("Heuristic scorer — P5 (Show what good looks like)", () => {
  it("detects 'for example' keyword", () => {
    const result = testPrinciple("Write a bio for example like this: professional and concise", "P5");
    expect(result.principlesDetected).toContain("P5");
  });

  it("detects 'here's an example of what I want'", () => {
    const result = testPrinciple("Here's an example of what I want: a casual, friendly email tone", "P5");
    expect(result.principlesDetected).toContain("P5");
  });

  it("detects 'here's a sample'", () => {
    const result = testPrinciple("Here's a sample of the format I need for the output", "P5");
    expect(result.principlesDetected).toContain("P5");
  });

  it("detects 'something like'", () => {
    const result = testPrinciple("I want something like a numbered list with brief descriptions", "P5");
    expect(result.principlesDetected).toContain("P5");
  });

  it("detects 'for reference'", () => {
    const result = testPrinciple("For reference, here is how we normally write these reports", "P5");
    expect(result.principlesDetected).toContain("P5");
  });

  it("detects 'in the style of'", () => {
    const result = testPrinciple("Write this in the style of a friendly newsletter", "P5");
    expect(result.principlesDetected).toContain("P5");
  });

  it("detects 'modeled on'", () => {
    const result = testPrinciple("Create a document modeled on our previous quarterly report", "P5");
    expect(result.principlesDetected).toContain("P5");
  });

  it("detects 'based on this example'", () => {
    const result = testPrinciple("Write a product description based on this example from our site", "P5");
    expect(result.principlesDetected).toContain("P5");
  });

  it("detects quoted text blocks (20+ chars)", () => {
    const result = testPrinciple(
      'Here is what I want it to look like: "This is the kind of warm, casual tone I prefer for all customer emails"',
      "P5"
    );
    expect(result.principlesDetected).toContain("P5");
  });

  it("detects triple-backtick code blocks", () => {
    const result = testPrinciple(
      "Format the output like this:\n```\nName: John\nRole: Engineer\nStatus: Active\n```",
      "P5"
    );
    expect(result.principlesDetected).toContain("P5");
  });

  it("detects blockquote markers", () => {
    const result = testPrinciple(
      "Use a tone similar to:\n> We're excited to announce our latest product update",
      "P5"
    );
    expect(result.principlesDetected).toContain("P5");
  });

  it("rejects a prompt with no examples or format hints", () => {
    const result = testPrinciple("Write me a product description", "P5");
    expect(result.principlesMissing).toContain("P5");
  });
});

describe("Heuristic scorer — P6 (Give specific feedback)", () => {
  it("detects feedback markers like 'make it more'", () => {
    const result = testPrinciple("Make it more casual and less formal in the opening paragraph", "P6");
    expect(result.principlesDetected).toContain("P6");
  });

  it("rejects vague feedback", () => {
    const result = testPrinciple("That's not right, try again", "P6");
    expect(result.principlesMissing).toContain("P6");
  });
});

describe("Heuristic scorer — P7 (Ask AI to ask questions)", () => {
  it("detects 'ask me' pattern", () => {
    const result = testPrinciple("Before you start, ask me any questions you need answered", "P7");
    expect(result.principlesDetected).toContain("P7");
  });

  it("detects 'what do you need' pattern", () => {
    const result = testPrinciple("What do you need to know before writing this proposal?", "P7");
    expect(result.principlesDetected).toContain("P7");
  });

  it("rejects prompt without interview request", () => {
    const result = testPrinciple("Write me a proposal for a new project", "P7");
    expect(result.principlesMissing).toContain("P7");
  });
});

describe("Heuristic scorer — P8 (Ask AI to write prompts)", () => {
  it("detects 'write a prompt' pattern", () => {
    const result = testPrinciple("Can you write a prompt for generating weekly meal plans?", "P8");
    expect(result.principlesDetected).toContain("P8");
  });

  it("detects 'template' pattern", () => {
    const result = testPrinciple("Turn this into a reusable template I can use every week", "P8");
    expect(result.principlesDetected).toContain("P8");
  });

  it("detects 'reusable' pattern", () => {
    const result = testPrinciple("Make this into something reusable for future requests", "P8");
    expect(result.principlesDetected).toContain("P8");
  });

  it("rejects prompt without meta-prompt request", () => {
    const result = testPrinciple("Help me plan my meals for next week", "P8");
    expect(result.principlesMissing).toContain("P8");
  });
});

describe("Heuristic scorer — P9 (Verify before you trust)", () => {
  it("detects 'verify' or 'source' keywords", () => {
    const result = testPrinciple("Please verify this information and cite your sources", "P9");
    expect(result.principlesDetected).toContain("P9");
  });

  it("detects 'are you sure' pattern", () => {
    const result = testPrinciple("Are you sure about that statistic? Double-check it please", "P9");
    expect(result.principlesDetected).toContain("P9");
  });

  it("rejects prompt without verification request", () => {
    const result = testPrinciple("Tell me about remote work statistics", "P9");
    expect(result.principlesMissing).toContain("P9");
  });
});

describe("Heuristic scorer — P10 (Include everything needed, nothing extra)", () => {
  it("detects a well-structured prompt of appropriate length", () => {
    const result = testPrinciple(
      "I need a summary of our Q2 performance. Specifically, the key metrics are revenue growth, customer acquisition, and churn rate. Focus on the most important trends and present them as numbered points.",
      "P10"
    );
    expect(result.principlesDetected).toContain("P10");
  });

  it("rejects a very short prompt", () => {
    const result = testPrinciple("Summarize this", "P10");
    expect(result.principlesMissing).toContain("P10");
  });
});

describe("Heuristic scorer — P11 (Know what AI can't do)", () => {
  it("detects 'knowledge cutoff' keyword", () => {
    const result = testPrinciple("What is your knowledge cutoff date for this topic?", "P11");
    expect(result.principlesDetected).toContain("P11");
  });

  it("detects 'your limitations' pattern", () => {
    const result = testPrinciple("Before you answer, tell me about your limitations on this subject", "P11");
    expect(result.principlesDetected).toContain("P11");
  });

  it("rejects prompt without limitation awareness", () => {
    const result = testPrinciple("What happened in the stock market today?", "P11");
    expect(result.principlesMissing).toContain("P11");
  });
});

describe("Heuristic scorer — P12 (Use AI responsibly)", () => {
  it("detects 'bias' or 'stereotype' keywords", () => {
    const result = testPrinciple("Check this job description for any bias or stereotypes in the language", "P12");
    expect(result.principlesDetected).toContain("P12");
  });

  it("detects 'different perspectives' pattern", () => {
    const result = testPrinciple("Consider different perspectives when reviewing this recommendation", "P12");
    expect(result.principlesDetected).toContain("P12");
  });

  it("rejects prompt without responsibility markers", () => {
    const result = testPrinciple("Write a job description for a manager position", "P12");
    expect(result.principlesMissing).toContain("P12");
  });
});

describe("Heuristic scorer — edge cases", () => {
  it("empty string returns empty results without crashing", () => {
    const result = scorePrompt("", { principles: ["P1", "P2", "P3"] });
    expect(result.score).toBe(0);
    expect(result.principlesDetected).toEqual([]);
    expect(result.principlesMissing).toEqual(["P1", "P2", "P3"]);
    expect(Array.isArray(result.suggestions)).toBe(true);
  });

  it("very long input (4000+ chars) completes without error", () => {
    const longPrompt = "I am a data scientist working on a project. ".repeat(100) +
      "I need to create 5 detailed reports with specific metrics and numbers like 42% improvement.";
    const result = scorePrompt(longPrompt, { principles: ["P1", "P2", "P3"] });
    expect(result).toHaveProperty("score");
    expect(typeof result.score).toBe("number");
  });

  it("no false positives on very short prompts like 'hello'", () => {
    const result = scorePrompt("hello", {
      principles: ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12"],
    });
    // P4 may pass (it checks for absence of binary starters, "hello" doesn't start with one)
    // All others should fail for a trivial prompt
    const unexpectedPasses = result.principlesDetected.filter((p) => p !== "P4");
    expect(unexpectedPasses).toEqual([]);
  });

  it("scenario with no principles returns score 0", () => {
    const result = scorePrompt("Write something", { principles: [] });
    expect(result.score).toBe(0);
    expect(result.principlesDetected).toEqual([]);
  });

  it("scenario with unknown principle ID is skipped gracefully", () => {
    const result = scorePrompt("Write something", { principles: ["P99"] });
    expect(result.score).toBe(0);
  });
});

describe("Feedback summary", () => {
  it("returns strong message for score >= 75", () => {
    const summary = getFeedbackSummary({ score: 80, principlesDetected: ["P1", "P2"], principlesMissing: [] });
    expect(summary).toContain("Strong prompt");
  });

  it("returns encouraging message for score 40-74", () => {
    const summary = getFeedbackSummary({ score: 50, principlesDetected: ["P1"], principlesMissing: ["P2"] });
    expect(summary).toContain("Good start");
  });

  it("returns practice message for score < 40", () => {
    const summary = getFeedbackSummary({ score: 0, principlesDetected: [], principlesMissing: ["P1", "P2"] });
    expect(summary).toContain("Keep practicing");
  });
});
