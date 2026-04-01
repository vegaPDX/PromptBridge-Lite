# PromptBridge

**An interactive, open-source tool that teaches people how to write effective prompts for AI tools.**

### **[Try it now — https://vegapdx.github.io/PromptBridge/](https://vegapdx.github.io/PromptBridge/)**

No signup. No API key. No backend. Just open and start learning.

---

PromptBridge teaches the universal prompting skills that make AI tools productive — being specific, providing context, verifying AI output, understanding AI limitations, and using AI responsibly. The skills you learn here work with any AI tool: ChatGPT, Claude, Gemini, Copilot, or any other AI assistant.

No technical background required. No AI experience required. The tool meets people where they are.

---

## Inspiration

PromptBridge was personally inspired by [NeuroBridge](https://dl.acm.org/doi/10.1145/3663547.3746337),
a training tool from Tufts University (ASSETS 2025 Best Student Paper). NeuroBridge's
comparison-based teaching approach — showing learners the consequences of different
choices side by side — shaped how PromptBridge teaches. The side-by-side practice
format used throughout PromptBridge is adapted from this pedagogical model.

---

## Features

### 2 Focus Areas, 12 Skills

PromptBridge organizes its teaching around 2 focus areas covering 12 skills. Each skill has multiple practice scenarios for 35 guided scenarios total.

| Focus Area | Skills | Scenarios |
|------------|--------|-----------|
| **A1: Effective Prompting** | S1–S8 (8 skills) | 22 |
| **A2: Responsible & Safe AI Use** | S9–S12 (4 skills) | 13 |

### 12 Skills

Every scenario teaches one or more of these skills, drawn from published best practices by Anthropic, OpenAI, and Google:

**Effective Prompting (A1):**
1. **S1 — Be clear and specific** — Ask for exactly what you want — include numbers, constraints, and details
2. **S2 — Provide full context** — Tell AI who you are, what you're working on, and what constraints exist
3. **S3 — Show what good looks like** — Give examples of the format, tone, or style you want
4. **S4 — Iterate with specific feedback** — Tell AI what's wrong AND how to fix it — specific corrections get specific improvements
5. **S5 — Ask for step-by-step reasoning** — Ask AI to think through problems step by step before giving a final answer
6. **S6 — Break down complex tasks** — Split big requests into smaller, focused steps — don't ask AI to do everything at once
7. **S7 — Ask AI to ask you questions** — Instead of guessing what AI needs, ask it to interview you
8. **S8 — Ask AI to write your prompts** — Once you know what you want, ask AI to write a reusable prompt

**Responsible & Safe AI Use (A2):**
9. **S9 — Verify before you trust** — AI sounds confident whether it's right or wrong — ask for sources and flag uncertainty
10. **S10 — Know what AI can't do** — AI has a training cutoff, can't browse the web, has no personal experience
11. **S11 — Use AI responsibly** — AI can reflect biases, agree when you're wrong, and produce harmful content
12. **S12 — Spot context drift** — In long conversations, AI can lose track of instructions or contradict itself

### 35 Guided Scenarios

All scenarios use a **guided practice** format: compare 3 prompt approaches (weak, getting there, effective) side by side, see the AI response each produces, and receive specific feedback tied to skills. Then write your own version and get scored.

Scenarios span personal, work, and school contexts — from writing emails and planning meals to catching AI hallucinations, decoding AI refusals, and auditing for bias.

### Additional Features

- **Welcome Banner** — First-visit banner highlighting 3 key facts most people don't know about AI: confident-sounding errors, sycophancy, and how better prompts fix most frustrations.
- **Pre-Scenario Reminders** — Dismissible reminder before each scenario that AI can sound confident and still be wrong.
- **Using AI Wisely** — Standalone guide covering critical AI limitations: hallucination, sycophancy, bias, knowledge cutoffs, operational limits, evasiveness, and more. Accessible from the landing page and header navigation.
- **Collapsible Skill Groups** — Scenarios organized by skill group, defaulting to collapsed with completion counters.
- **Progression Recommendations** — The tool suggests what to try next based on which skills you haven't practiced yet.
- **Personalization** — Optional "What do you use AI for?" question to surface the most relevant scenarios.
- **Progress Tracking** — Tracks completed scenarios and practiced skills in your browser.
- **Copy-to-Real-AI Workflow** — Every scenario includes copy buttons and links to ChatGPT, Claude, Gemini, and Copilot so you can immediately practice in real tools.
- **Accessible** — Skip-to-content link, ARIA labels, reduced motion support, color contrast compliant, semantic HTML.
- **Mobile Friendly** — Responsive design that works on phones, tablets, and desktops.

---

## Architecture

The public web app is a **fully static site** with no backend and no outbound network requests. All content is pre-generated at build time. No API keys are needed or accepted in the deployed app.

- **Frontend:** React 19, Vite 8, Tailwind CSS v4
- **Content:** 35 pre-generated JSON scenario files (generated once by a local script using Claude or Gemini APIs)
- **Scoring:** Client-side heuristic scorer using regex pattern matching against the 12 skills
- **Testing:** Vitest + React Testing Library
- **Storage:** Progress saved in browser `localStorage`
- **Deployment:** GitHub Pages (static files only)
- **Security:** Content Security Policy with `connect-src 'none'` (no outbound requests), frame-buster for clickjacking protection, HTML escaping on all rendered content

---

## Security

PromptBridge is designed as a zero-trust static site:

**Application security:**

- **No API keys in the public app** — The deployed web app makes no network requests. There are no API keys, no secrets, and nothing sensitive stored in the browser.
- **XSS prevention** — All pre-generated content is HTML-escaped before rendering via `dangerouslySetInnerHTML`. All other dynamic content uses React text nodes (auto-escaped).
- **Content Security Policy** — Strict `<meta>` CSP blocks inline scripts, explicitly disallows all outbound connections (`connect-src 'none'`), prevents plugin embedding (`object-src 'none'`), and restricts base URIs and form targets.
- **Clickjacking protection** — JavaScript frame-buster in `main.jsx` (CSP `frame-ancestors` doesn't work in `<meta>` tags, and GitHub Pages doesn't support custom HTTP headers).
- **Input length limits** — All user prompt textareas are capped at 4,000 characters.
- **No bundled secrets** — The `.env.example` only contains non-`VITE_` prefixed variables used by the local content generation script.

**GitHub & supply chain security:**

- **GitHub Actions pinned to commit SHAs** — All actions in the deploy workflow use immutable commit hashes, not mutable version tags, to prevent supply chain attacks.
- **Secret scanning & push protection** — GitHub secret scanning is enabled with push protection to block accidental commits containing API keys or tokens.
- **Dependabot security updates** — Automated vulnerability alerts and security PRs for dependencies.
- **Branch protection** — `main` requires code owner review, blocks force pushes and branch deletions, and enforces rules for admins.

If you find a security issue, please open an issue or contact the maintainer directly.

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- npm (comes with Node.js)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/vegaPDX/PromptBridge.git
cd PromptBridge/app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

All 35 guided scenarios work immediately with pre-generated content. No API key required.

### Regenerating Content

To regenerate the static content for guided scenarios (e.g., after editing prompts or adding scenarios):

```bash
cd app

# Using Gemini (free)
GEMINI_API_KEY=your-key node scripts/generate-content.js --provider gemini

# Using Claude
ANTHROPIC_API_KEY=your-key node scripts/generate-content.js

# Single scenario
GEMINI_API_KEY=your-key node scripts/generate-content.js --provider gemini --scenario 1.1-snow-shoveling

# Regenerate only feedback text (keeps options and responses intact)
ANTHROPIC_API_KEY=your-key node scripts/generate-content.js --feedback-only
```

### Building for Production

```bash
cd app
npm run build
```

Output goes to `app/dist/`. The GitHub Actions workflow handles production builds and deployment automatically on push to `main`.

### Project Structure

```
promptbridge/
├── README.md
├── PROJECT_OVERVIEW.md                # Project vision, goals, and design foundation
├── LICENSE                            # AGPL-3.0
├── docs/                              # Project documentation
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING_SCENARIOS.md
│   ├── PROJECT_SPEC.md
│   ├── PROMPT_TEMPLATES.md
│   ├── ROADMAP.md
│   ├── SCENARIOS.md
│   └── SECURITY_REVIEW_PROMPT.md
│
├── .github/
│   ├── workflows/deploy.yml           # GitHub Pages auto-deploy
│   └── CODEOWNERS                     # PR review requirements
│
└── app/                               # Vite + React standalone app
    ├── package.json
    ├── vite.config.js
    ├── vitest.config.js               # Test configuration
    ├── scripts/
    │   ├── generate-content.js        # Static content generation pipeline
    │   └── validate-scenario.js       # Scenario validation script
    └── src/
        ├── App.jsx                    # Main app — hash-based routing and state
        ├── main.jsx                   # Entry point with frame-buster
        ├── index.css                  # Tailwind CSS + animations
        ├── __tests__/                 # Vitest + React Testing Library tests
        ├── data/
        │   ├── scenarios.js           # 35 scenario definitions
        │   ├── skills.js              # 12 skills (S1–S12) with definitions and metadata
        │   ├── skill-areas.js         # 2 focus areas with 11 skill groups
        │   ├── maxims.js              # Legacy file (6 maxims) — kept for reference
        │   ├── principles.js          # Legacy file (12 principles) — kept for reference
        │   ├── categories.js          # Focus area display labels and colors
        │   ├── assessment-scenarios.js # Pre/post assessment scenario IDs
        │   ├── demo.js                # Landing page demo prompts and responses
        │   ├── icon-map.js            # Dynamic Lucide icon resolver
        │   ├── prompts.js             # LLM prompt templates (used by generate-content.js)
        │   └── generated/             # 35 pre-generated JSON files (one per scenario)
        ├── pages/
        │   ├── LandingPage.jsx        # Home page with demo
        │   ├── ScenarioSelector.jsx   # Skill-grouped scenario browser
        │   ├── GuidedMode.jsx         # Guided practice with pre-generated content
        │   ├── ProgressPage.jsx       # Progress tracking dashboard
        │   ├── HelpPage.jsx           # Help and getting started
        │   └── AiSafetyPage.jsx       # "Using AI Wisely" standalone guide
        ├── services/
        │   ├── guided-data.js         # Data loading for guided scenarios
        │   ├── heuristic-scorer.js    # Client-side prompt quality scoring (12 skills)
        │   ├── recommendations.js     # Next-scenario recommendations
        │   └── storage.js             # localStorage persistence
        └── components/
            ├── Header.jsx             # Navigation header
            ├── AiSafetyBanner.jsx     # First-visit safety awareness banner
            ├── AiToolLinks.jsx        # Links to ChatGPT, Claude, Gemini, Copilot
            ├── CopyButton.jsx         # One-click copy to clipboard
            ├── ErrorBanner.jsx        # Error display
            ├── LoadingSpinner.jsx     # Loading state
            ├── MarkdownText.jsx       # Safe markdown rendering
            ├── PreScenarioBanner.jsx   # Pre-scenario AI accuracy reminder
            └── PrincipleBadge.jsx     # Principle tag display
```

---

## License

**AGPL-3.0** — [GNU Affero General Public License v3.0](LICENSE)

Copyright (C) 2026 Chris Vega (vegaPDX)

You are free to use, modify, and redistribute this software. If you distribute a modified version — including running it as a web service — you must also make your source code available under the same AGPL-3.0 license.

This license was chosen to ensure that improvements to AI literacy tools remain freely available to everyone.

---

## Acknowledgments

- **NeuroBridge** (Haroon et al., Tufts University) — Inspired the comparison-based teaching format
- **Anthropic**, **OpenAI**, and **Google** — Prompting best practices documentation that informed
  the skills and AI safety guidance
