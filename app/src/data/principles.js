export const PRINCIPLES = [
  {
    id: "P1", name: "Be specific, not vague",
    description: "Ask for exactly what you want — not a topic, not a keyword",
    icon: "Target",
    learnMoreUrl: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices#be-clear-and-direct",
    learnMoreLabel: "Anthropic: Be clear and direct",
  },
  {
    id: "P2", name: "Provide context",
    description: "Tell the AI who you are, what you're working on, what constraints exist",
    icon: "Users",
    learnMoreUrl: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices#add-context-to-improve-performance",
    learnMoreLabel: "Anthropic: Add context to improve performance",
  },
  {
    id: "P3", name: "State your intent",
    description: "Explain what you'll use the result for",
    icon: "Lightbulb",
    learnMoreUrl: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices#add-context-to-improve-performance",
    learnMoreLabel: "Anthropic: Why context and intent matter",
  },
  {
    id: "P4", name: "Avoid ambiguity",
    description: "Don't use yes/no questions when you want information",
    icon: "AlertCircle",
    learnMoreUrl: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices#structure-prompts-with-xml-tags",
    learnMoreLabel: "Anthropic: Structure prompts to reduce ambiguity",
  },
  {
    id: "P5", name: "Show what 'good' looks like",
    description: "Provide examples of the format, tone, or style you want",
    icon: "Eye",
    learnMoreUrl: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices#use-examples-effectively",
    learnMoreLabel: "Anthropic: Use examples effectively",
  },
  {
    id: "P6", name: "Give specific feedback",
    description: "Tell the AI what's wrong and how to fix it, not just 'try again'",
    icon: "PenTool",
    learnMoreUrl: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompting-tools#prompt-improver",
    learnMoreLabel: "Anthropic: Iterating with the prompt improver",
  },
  {
    id: "P7", name: "Ask the AI to ask you questions",
    description: "Let it interview you instead of guessing what it needs",
    icon: "HelpCircle",
    learnMoreUrl: "https://code.claude.com/docs/en/best-practices#let-claude-interview-you",
    learnMoreLabel: "Claude Code: Let Claude interview you",
  },
  {
    id: "P8", name: "Ask the AI to write prompts for you",
    description: "Once direction is established, let it crystallize the prompt",
    icon: "Sparkles",
    learnMoreUrl: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompting-tools#prompt-generator",
    learnMoreLabel: "Anthropic: Prompt generator",
  },
];

export const PRINCIPLE_MAP = Object.fromEntries(PRINCIPLES.map(p => [p.id, p]));
