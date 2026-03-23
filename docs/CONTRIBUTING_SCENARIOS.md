# Contributing Scenarios to PromptBridge

Thank you for helping make PromptBridge better! Scenarios are the core of the learning experience — each one teaches users how to communicate more effectively with AI tools through hands-on practice.

## What makes a good scenario?

A good scenario is:
- **Relatable** — Based on a situation most people would actually encounter
- **Specific** — Has enough detail for meaningful prompt variations (weak/medium/strong)
- **Principled** — Maps clearly to 1-3 of the 8 communication principles
- **AI-agnostic** — Works with any AI assistant, not specific to one tool

## The 8 communication principles

Every scenario must map to at least one:

| ID | Principle | What it teaches |
|----|-----------|----------------|
| P1 | Be specific, not vague | Ask for exactly what you want |
| P2 | Provide context | Share who you are, constraints, situation |
| P3 | State your intent | Explain what the result is for |
| P4 | Avoid ambiguity | Don't use yes/no questions when you want info |
| P5 | Show what "good" looks like | Give examples of format, tone, style |
| P6 | Give specific feedback | Say what's wrong AND what to change |
| P7 | Ask the AI to ask you questions | Let it interview you |
| P8 | Ask the AI to write prompts for you | Let it crystallize the prompt |

## Scenario format

Each scenario is a JavaScript object in `app/src/data/scenarios.js`:

```javascript
{
  id: "category.number-short-name",     // e.g., "1.9-budget-tracker"
  category: "vague_vs_specific",         // one of the 5 categories below
  title: "The budget tracker",           // short, memorable title
  situation: "You want to create a monthly budget...", // 1-3 sentences describing the situation
  mode: "guided",                        // "guided" or "freeform"
  principles: ["P1", "P2"],             // 1-3 principle IDs
  feedbackNotes: "Show how...",          // guidance for content generation
  relevance: ["personal", "work"],       // context tags for personalization
}
```

### Categories

| Key | Label | When to use |
|-----|-------|-------------|
| `vague_vs_specific` | Vague vs. Specific | Teaches specificity and clear requests |
| `context_and_framing` | Context & Framing | Teaches context-setting and audience awareness |
| `iterative_refinement` | Iterative Refinement | Teaches feedback and iteration |
| `smart_strategies` | Smart Strategies | Teaches advanced techniques |
| `full_conversation_loop` | Full Conversation Loop | Multi-skill freeform scenarios |

### Relevance tags

Add one or more: `"work"`, `"coding"`, `"school"`, `"personal"`, `"other"`

## How to contribute

### Option 1: Scenario definition only (easiest)

1. Fork the repo
2. Add your scenario to `app/src/data/scenarios.js`
3. Submit a PR with:
   - The scenario object
   - A brief explanation of what it teaches and why

We'll generate the static content (options, responses, feedback) for you.

### Option 2: Full scenario with generated content

1. Fork the repo
2. Add your scenario to `app/src/data/scenarios.js`
3. Run the content generator:
   ```bash
   cd app
   # Using Gemini (free)
   GEMINI_API_KEY=your-key node scripts/generate-content.js --provider gemini --scenario your-scenario-id
   # Using Claude
   ANTHROPIC_API_KEY=your-key node scripts/generate-content.js --scenario your-scenario-id
   ```
4. Review the generated JSON in `app/src/data/generated/your-scenario-id.json`
5. Submit a PR with both files

### Validating your scenario

Run the validation script to check your scenario format:
```bash
node app/scripts/validate-scenario.js your-scenario-id
```

## Quality checklist

Before submitting:

- [ ] Situation is realistic — would a real person encounter this?
- [ ] Title is short and memorable (under 40 characters)
- [ ] Principles are correctly mapped (the scenario actually teaches those skills)
- [ ] FeedbackNotes explain what the comparison should highlight
- [ ] Relevance tags match the scenario context
- [ ] ID follows the `category.number-short-name` format
- [ ] No jargon — no "prompt engineering," "tokens," "context window"

## Examples

**Good scenario idea:** "You need to write a LinkedIn recommendation for a coworker, but you're not sure how to make it sound genuine rather than generic."
- Teaches: P2 (context about the person), P5 (tone/style examples)
- Relatable, specific, clear principle mapping

**Bad scenario idea:** "Use AI to do something at work."
- Too vague, no specific situation, unclear what principles it teaches
