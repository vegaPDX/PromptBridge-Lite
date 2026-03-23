# PromptBridge — Architecture Document (Updated)

## Two-phase development strategy

PromptBridge uses a two-phase architecture that lets you build and test the entire tool using your Claude Max subscription, then transition to standard API billing when you're ready to deploy publicly.

### Phase A: Build and test as a Claude.ai artifact (uses Max plan)

**What this means:** The entire PromptBridge app is built as a single-file React component (a `.jsx` artifact) that runs inside Claude.ai's sandbox. When the artifact needs to call Claude's API (to generate options, simulate responses, or produce feedback), it uses the built-in artifact proxy — no API key needed, no per-token charges. Usage counts against your Max plan allocation.

**What you can do in this phase:**
- Build and iterate on the full UI (landing page, guided mode, free-form mode, side-by-side comparison)
- Test all 4 LLM-powered components with real Claude responses
- Share the artifact with others (they use their own Claude subscription)
- Refine prompt templates based on actual output quality
- Get the entire user experience working before spending any money on API

**Limitations of this phase:**
- Everything must fit in a single React file (no separate backend, no separate CSS/JS files)
- No server-side database — use React state and localStorage for session/progress tracking
- No external network calls except to `api.anthropic.com` (the sandbox blocks other domains)
- The app only runs inside Claude.ai — it can't be deployed to your own server yet
- Shared artifacts require viewers to have their own Claude subscription

### Phase B: Deploy as a standalone web app (uses API billing)

**What this means:** You extract the React frontend from the artifact, pair it with a FastAPI backend that handles LLM calls through the swappable adapter pattern, and deploy to your own infrastructure. This is the version that becomes the public, open-source tool.

**What changes:**
- LLM calls move from client-side `fetch()` to server-side adapter layer
- SQLite/PostgreSQL replaces localStorage for progress tracking
- You get a real backend with proper error handling, rate limiting, etc.
- Any LLM can be plugged in (Claude API, OpenAI, Ollama for local models)
- The app runs on its own domain, no Claude.ai login required for users

**What stays the same:**
- All React components, UI layout, and interaction flow
- All prompt templates (they're model-agnostic by design)
- All scenario definitions (stored as JSON data)
- The communication principles framework

---

## Phase A architecture: Claude.ai artifact

### How artifact API calls work

Inside Claude.ai artifacts, the `fetch()` function is patched to intercept calls to the Anthropic API. When your React code calls `fetch("https://api.anthropic.com/v1/messages", ...)`, the request is transparently routed through Claude's proxy. No API key is needed — you don't include an `x-api-key` header. Usage counts against your Max plan's message limits.

```javascript
// This works inside a Claude.ai artifact — no API key needed
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      { role: "user", content: "Your prompt here" }
    ]
  })
});
const data = await response.json();
const text = data.content[0].text;
```

### Single-file React structure

The artifact is a single `.jsx` file, but you can organize it cleanly using components defined within the same file. Here's the recommended internal structure:

```
PromptBridge.jsx (single artifact file)
│
├── Constants & Data
│   ├── SCENARIOS (JSON scenario definitions, embedded)
│   ├── PRINCIPLES (the 8 communication principles)
│   └── PROMPT_TEMPLATES (system prompts for each LLM component)
│
├── LLM Service Functions
│   ├── callClaude(systemPrompt, userMessage, options)
│   ├── generateOptions(scenario)
│   ├── simulateResponses(weakPrompt, strongPrompt, context)
│   ├── generateFeedback(scenario, userChoice, options, responses)
│   └── analyzeFreeform(scenario, userPrompt)
│
├── Utility Components
│   ├── LoadingSpinner
│   ├── ErrorBanner
│   └── PrincipleBadge
│
├── Page Components
│   ├── LandingPage (with snow shoveling demo)
│   ├── ScenarioSelector
│   ├── GuidedModePage
│   ├── FreeformModePage
│   └── ProgressPage
│
├── Core Interaction Components
│   ├── OptionPicker (3-option selection)
│   ├── FreeformInput (text area + submit)
│   ├── ResponseComparison (side-by-side panel)
│   ├── FeedbackPanel
│   └── PrincipleTracker
│
└── App (main component with routing via state)
```

### Data storage in Phase A

Since artifacts can't use `localStorage` (it's blocked in the sandbox), use **React state** for in-session tracking:

```javascript
const [completedScenarios, setCompletedScenarios] = useState([]);
const [practicedPrinciples, setPracticedPrinciples] = useState([]);
const [currentPage, setCurrentPage] = useState('landing');
```

Progress resets when the artifact reloads. This is acceptable for a dev/testing phase — persistent tracking comes in Phase B with a real database.

**UPDATE — Persistent Storage API:** Claude artifacts now have access to a persistent key-value storage API via `window.storage`. This means progress CAN persist across sessions during Phase A:

```javascript
// Save progress
await window.storage.set('progress', JSON.stringify({
  completedScenarios: [...],
  practicedPrinciples: [...]
}));

// Load progress on startup
try {
  const result = await window.storage.get('progress');
  const progress = JSON.parse(result.value);
} catch (e) {
  // First visit or no saved data
}
```

This is personal (not shared) storage, with a 5MB per key limit. Use it for the principle tracker and completed scenario history.

### Parsing LLM responses in the artifact

All prompt templates request JSON output. Parse it safely:

```javascript
async function callClaude(systemPrompt, userMessage, { temperature = 0.7, maxTokens = 1024 } = {}) {
  try {
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

    if (!data.content || !data.content[0]) {
      throw new Error("Empty response from API");
    }

    const text = data.content[0].text;

    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Claude API call failed:", error);
    return null;
  }
}
```

### Available libraries in artifact sandbox

These are pre-loaded and importable inside Claude.ai artifacts — no npm install needed:

- **React** (with hooks): `import { useState, useEffect } from "react"`
- **Tailwind CSS**: Use utility classes directly (core classes only, no compiler)
- **lucide-react**: `import { Check, X, ChevronRight, MessageSquare } from "lucide-react"`
- **shadcn/ui**: `import { Alert, AlertDescription } from '@/components/ui/alert'`
- **recharts**: For any data visualization needs
- **lodash**: `import _ from 'lodash'`

These are the exact libraries the project needs — React + Tailwind + lucide for icons + shadcn for base components.

---

## Phase B architecture: Standalone web app

When you're ready to deploy publicly, the transition involves:

### Step 1: Extract the React frontend

- Pull all component code out of the single artifact file into separate `.tsx` files
- Move scenario data from embedded constants to JSON files in `backend/data/scenarios/`
- Move prompt templates from embedded constants to `backend/prompts/`
- Replace `callClaude()` with API client functions that hit your own backend
- Replace `window.storage` with API calls for progress tracking

### Step 2: Build the FastAPI backend

This is the backend described in the original architecture — it becomes the middleman between the frontend and whichever LLM provider you choose:

```
Frontend (React) → Your Backend (FastAPI) → LLM Provider (Claude API / OpenAI / Ollama)
```

### Step 3: Implement the LLM adapter layer

```python
# llm/base.py — same abstract interface from the original architecture
class LLMAdapter(ABC):
    @abstractmethod
    async def generate(self, messages, temperature=0.7, max_tokens=1024):
        pass

# llm/claude.py — Claude API adapter (production)
class ClaudeAdapter(LLMAdapter):
    def __init__(self, api_key, model="claude-sonnet-4-20250514"):
        self.client = anthropic.AsyncAnthropic(api_key=api_key)
        self.model = model
    # ... (see PROMPT_TEMPLATES.md for full implementation)

# llm/openai.py — OpenAI adapter (alternative)
class OpenAIAdapter(LLMAdapter):
    # Same interface, OpenAI implementation

# llm/ollama.py — Local models (free, offline)
class OllamaAdapter(LLMAdapter):
    # Same interface, hits local Ollama server
```

### Step 4: Deploy

- **Frontend:** Vercel, Netlify, or any static hosting
- **Backend:** Railway, Render, Fly.io, or any Python hosting
- **Database:** PostgreSQL (Railway/Render include free tiers)
- **LLM:** Anthropic API with pay-per-token billing

---

## What to build when — revised phased plan

### Phase A.1 — Core artifact (use Max plan, no API costs)

Build a Claude.ai artifact with:
1. Landing page with hardcoded snow shoveling demo (no API calls needed)
2. Scenario selector showing all categories
3. Guided mode: option picker → API call for simulated responses → side-by-side comparison → API call for feedback
4. Embedded scenario data (at least 8-10 guided scenarios)
5. Basic styling with Tailwind

**Claude Code session goal:** Ask Claude Code to help you write the single-file `.jsx` artifact. You can iterate on it in Claude.ai directly — paste the code, test it, refine it.

### Phase A.2 — Expand the artifact

Add:
1. Free-form mode with the analysis + improvement flow
2. Principle tracker using `window.storage` for persistence
3. All remaining scenarios
4. Polished UI and responsive design
5. Error handling and loading states

**At this point you have a fully working tool** that anyone with a Claude subscription can use via shared artifact link.

### Phase B.1 — Extract and deploy (API costs begin)

1. Extract React code into a proper Vite project with separate component files
2. Build the FastAPI backend with scenario loading and LLM adapter layer
3. Implement Claude API adapter with real API key
4. Wire frontend to backend
5. Test locally

### Phase B.2 — Production and open source

1. Add OpenAI and Ollama adapter stubs
2. Set up deployment (Vercel + Railway or similar)
3. Write README with setup instructions
4. Publish to GitHub
5. Add contributor guidelines for scenario submissions

---

## Cost comparison

| Phase | LLM Costs | What you're paying |
|-------|-----------|-------------------|
| A.1-A.2 (artifact) | $0 additional | Your existing Max plan ($100-200/mo) |
| B.1 (local API testing) | ~$5-15 | Anthropic API pay-per-token |
| B.2 (production) | Variable | Depends on traffic — each scenario round ~$0.01-0.03 |

Phase A lets you build and refine the entire product — UI, prompts, scenarios, user flow — without spending a cent beyond your existing subscription. By the time you reach Phase B, you'll have a polished product and proven prompt templates, so API spend during testing is minimal.

---

## File structure — what exists when

### During Phase A (artifact development)

```
promptbridge/
├── docs/
│   ├── PROJECT_SPEC.md
│   ├── ARCHITECTURE.md          ← this file
│   ├── SCENARIOS.md
│   ├── PROMPT_TEMPLATES.md
│   └── CLAUDE_CODE_SESSION.md
│
├── artifact/
│   └── PromptBridge.jsx         ← the single-file artifact
│
└── data/
    └── scenarios/               ← source JSON files (embedded into artifact during dev)
        ├── vague_vs_specific.json
        ├── context_and_framing.json
        ├── iterative_refinement.json
        └── full_conversation_loop.json
```

### During Phase B (standalone app)

```
promptbridge/
├── docs/                        ← same as above
├── artifact/
│   └── PromptBridge.jsx         ← kept as reference / shareable demo
│
├── backend/                     ← new: FastAPI backend
│   ├── main.py
│   ├── config.py
│   ├── requirements.txt
│   ├── api/
│   ├── llm/
│   ├── services/
│   ├── prompts/
│   ├── data/scenarios/
│   └── db/
│
└── frontend/                    ← new: extracted React app
    ├── package.json
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── types/
    └── public/
```
