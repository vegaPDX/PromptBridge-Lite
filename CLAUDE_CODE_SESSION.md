# PromptBridge — Claude Code Session Prompt (Updated for Artifact-First Development)

## Development strategy overview

PromptBridge is being built in two phases:

**Phase A (current):** Build the entire app as a single-file React artifact (`.jsx`) that runs inside Claude.ai. LLM calls use the built-in artifact API proxy — no API key needed, usage counts against the Max subscription. This lets you build, test, and refine the complete product at zero additional cost.

**Phase B (later):** Extract the React code into a standalone app with a FastAPI backend and swappable LLM adapters for public deployment.

This session focuses on Phase A.

---

## Pre-session checklist

Make sure your project directory contains:

```
promptbridge/
├── PROJECT_SPEC.md
├── ARCHITECTURE.md              ← the updated version with artifact-first approach
├── SCENARIOS.md
├── PROMPT_TEMPLATES.md
└── CLAUDE_CODE_SESSION.md       ← this file
```

---

## Session prompt — paste this into Claude Code

```
I'm building PromptBridge — an open-source interactive tool that teaches people how to communicate effectively with AI assistants.

IMPORTANT: Read ALL documentation files in this directory first:
- PROJECT_SPEC.md — what the tool is, features, design principles
- ARCHITECTURE.md — the two-phase development strategy (artifact-first, then standalone)
- SCENARIOS.md — scenario library, communication principles, JSON schema, all examples
- PROMPT_TEMPLATES.md — system prompts for each LLM component, temperature/token settings

CRITICAL CONTEXT: I'm building Phase A — a single-file React artifact (.jsx) that runs inside Claude.ai. This means:

1. EVERYTHING goes in one .jsx file — components, data, prompts, styles, logic
2. LLM calls use fetch("https://api.anthropic.com/v1/messages") with NO API key — the artifact sandbox proxies these automatically against my Max plan
3. Available libraries (pre-loaded, no npm install): React, Tailwind CSS utility classes, lucide-react for icons, shadcn/ui components, recharts, lodash
4. For persistent data: use window.storage API (await window.storage.set/get/delete/list)
5. NO localStorage or sessionStorage (blocked in artifact sandbox)
6. NO external network calls except to api.anthropic.com
7. NO <form> tags — use onClick/onChange handlers
8. Use a default export for the main component

THE ARTIFACT MUST:
- Be a self-contained React component with a default export
- Use only Tailwind's core utility classes (no custom Tailwind config)
- Handle all state via React hooks (useState, useEffect, useReducer)
- Include all scenario data as embedded constants
- Include all prompt templates as embedded constants
- Parse all LLM responses as JSON with error handling

WHAT TO BUILD (in order):

Step 1 — App shell and navigation
- Main App component with state-based page routing (landing, scenario-select, guided, freeform, progress)
- Clean header with app name and navigation
- Landing page with the "snow shoveling" demo (hardcoded, no API call needed)
  - Show the bad prompt: "Do you know how to shovel snow faster?"
  - Show the AI response: "Yes."
  - Show the good prompt: "Tell me 5 ways I can speed up shoveling snow..."
  - Show a rich, helpful AI response
  - This demo should make the concept click in under 5 seconds
- "Try it" CTA that goes to scenario selector

Step 2 — Scenario data and selector
- Embed scenario data as a constant (at least 8-10 guided scenarios from SCENARIOS.md)
- Scenario selector page grouped by category with cards
- Each card shows: title, category label, which principles it covers (as small badges)

Step 3 — Guided Mode (the core interaction)
- Display scenario situation text
- Call Claude API to generate 3 prompt options (use the Option Generator prompt from PROMPT_TEMPLATES.md)
- Display options in shuffled order as selectable cards
- On selection:
  - Call Claude API to simulate responses for the weakest and strongest options (Response Simulator prompt)
  - Show side-by-side comparison panel: red-toned card for weak response, green-toned card for strong response
  - Call Claude API to generate feedback (Feedback Generator prompt)
  - Show feedback panel with the principle name, explanation, and actionable tip
- "Next scenario" button

Step 4 — Free-form Mode
- Display scenario situation
- Large text input for user to write their own prompt
- On submit:
  - Call Claude API with the Free-form Analysis prompt
  - Display analysis (strengths + improvements)
  - Display the improved prompt
  - Call Claude API to simulate responses for both the original and improved prompts
  - Show side-by-side comparison
  - Show the principle badges and tip

Step 5 — Principle Tracker
- Use window.storage to persist which principles the user has practiced
- Simple progress view showing all 8 principles with completion status
- Update after each scenario completion

Step 6 — Polish
- Loading spinners during API calls (use lucide-react Loader2 with animate-spin)
- Error handling with retry buttons if API calls fail
- Responsive design (works on mobile)
- Smooth transitions between pages
- Consistent color scheme: warm cream background, green for "good" examples, red/warm for "bad" examples, amber for tips/feedback

DESIGN DIRECTION:
- Clean, warm, approachable — similar aesthetic to the "From Prompts to Agents" HTML guide
- The side-by-side comparison is the hero interaction — make it visually striking
- Use color consistently: green = effective prompts/responses, red/warm = ineffective, amber = feedback/tips
- Cards with subtle shadows, rounded corners, comfortable spacing
- Typography: use a serif font for headings (from Google Fonts if available, or fallback to Georgia), sans-serif for body text

API CALL PATTERN (use this for all LLM calls):
```javascript
async function callClaude(systemPrompt, userMessage, { temperature = 0.7, maxTokens = 1024 } = {}) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });
  const data = await response.json();
  const text = data.content[0].text;
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}
```

KEY CONSTRAINTS:
- NEVER use "prompt engineering" in user-facing text — say "how to talk to AI" or "how you phrase your request"
- NEVER use AI jargon (tokens, context window, system prompt, temperature) in the UI
- All user-facing language should be plain, friendly, and accessible
- The tool is AI-agnostic in messaging — skills learned here work with any AI assistant

Start with Step 1. Read all docs first, then build the artifact.
```

---

## How to test the artifact

After Claude Code generates the `.jsx` file:

1. Open a new conversation in Claude.ai (on your Max plan)
2. Ask Claude to create a React artifact
3. Paste the generated code into the artifact
4. The artifact renders in the preview panel — test each feature
5. If something needs fixing, iterate with Claude Code or directly in Claude.ai

Alternatively, you can ask Claude.ai directly to build the artifact by pasting the session prompt above — Claude.ai can create and iterate on artifacts natively.

---

## End-of-session save prompt

```
Before we wrap up, I need two things:

1. Create a file called SESSION_CONTEXT.md that summarizes:
   - What was built in this session
   - Current state of each step (not started / in progress / complete)
   - Any decisions made that differ from the original docs
   - Known issues or bugs
   - What to build next

2. Write me an effective prompt I can paste into a fresh Claude Code session (or directly into Claude.ai) to continue where we left off. Reference SESSION_CONTEXT.md and the original blueprint docs.

3. Save the current artifact code as PromptBridge.jsx so I have a snapshot.
```

---

## Notes on Max plan usage

Each guided scenario round makes approximately 3 API calls through the artifact proxy:
- Option generation (~800 tokens)
- Response simulation (~1500 tokens)
- Feedback generation (~600 tokens)

On Max 5x ($100/mo), this translates to roughly 225+ messages per 5-hour window. Each scenario "costs" about 3 messages worth of that allocation. You can comfortably run 50-75 scenario test rounds per 5-hour window, which is more than enough for development and testing.

Free-form mode makes 2 calls per round (analysis + simulation), so it's slightly cheaper per interaction.

---

## Transitioning to Phase B (when ready)

When the artifact version is working well and you want to deploy publicly, the transition checklist is:

1. Extract all React components from the single file into separate `.tsx` files
2. Extract embedded scenario data into JSON files
3. Extract prompt templates into Python files for the backend
4. Replace direct `fetch()` API calls with calls to your own backend endpoints
5. Build the FastAPI backend (routes, services, LLM adapter layer)
6. Replace `window.storage` with backend API calls for progress tracking
7. Test locally with a real Anthropic API key
8. Deploy

The ARCHITECTURE.md doc has full details on the Phase B file structure and backend design. The prompt templates and scenarios carry over unchanged — they're the same regardless of whether the LLM call happens client-side (artifact) or server-side (backend).
