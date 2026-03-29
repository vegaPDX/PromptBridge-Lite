# PromptBridge Lite

**An interactive, open-source tool that teaches people how to communicate effectively with AI assistants.**

### **[Try it now — https://vegapdx.github.io/PromptBridge-Lite/](https://vegapdx.github.io/PromptBridge-Lite/)**

No signup. No API key. No backend. Just open and start learning.

---

> **Lite version** — PromptBridge Lite is a focused introduction to AI communication, organized around 6 core maxims with 26 guided scenarios. The full [PromptBridge](https://github.com/vegaPDX/PromptBridge) app offers nearly 3x as many scenarios across guided and freeform modes.

---

PromptBridge Lite teaches the universal communication skills that make AI conversations productive — being specific, providing context, verifying AI output, understanding AI limitations, and using AI responsibly. The skills you learn here work with any AI tool: ChatGPT, Claude, Gemini, Copilot, or any other conversational AI.

No technical background required. No AI experience required. The tool meets people where they are.

---

## Inspiration: NeuroBridge

PromptBridge is directly inspired by [**NeuroBridge**](https://dl.acm.org/doi/10.1145/3663547.3746337), a training tool from Tufts University that won **Best Student Paper** at [ASSETS 2025](https://assets25.sigaccess.org/) (the ACM SIGACCESS Conference on Computers and Accessibility).

NeuroBridge trains neurotypical people to communicate more clearly with autistic individuals. Its core insight — and the foundation of PromptBridge — is that the communication skills NeuroBridge teaches are the same skills that make someone effective at communicating with AI:

| NeuroBridge teaches | PromptBridge applies it to AI |
|---|---|
| Be direct and literal | Be specific, not vague |
| Avoid indirect speech acts | Don't use yes/no questions when you want information |
| Provide explicit context | Tell the AI who you are and what you need |
| Don't assume shared knowledge | State your intent and constraints |

NeuroBridge uses a see-consequences, compare-approaches, receive-feedback interaction model. PromptBridge Lite adapts this same pedagogical approach for AI communication training: users compare weak, medium, and strong prompts side by side, see the dramatically different AI responses each produces, and get specific feedback tied to communication principles.

**Citation:**
> Haroon, R., Wigdor, K., Yang, K., Toumanios, N., Crehan, E.T., & Dogar, F. (2025). "NeuroBridge: Using Generative AI to Bridge Cross-neurotype Communication Differences through Neurotypical Perspective-taking." In *Proceedings of the 27th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS '25)*. ACM. DOI: [10.1145/3663547.3746337](https://dl.acm.org/doi/10.1145/3663547.3746337)

---

## Features

### 6 Maxims, 13 Sub-maxims

PromptBridge Lite organizes its teaching around 6 core maxims — broad communication principles drawn from Gricean pragmatics and human-AI interaction research. Each maxim contains 2–3 sub-maxims with 2 practice scenarios each, for 26 guided scenarios total. Maxim 6 (Use AI Responsibly) receives extra emphasis with 3 sub-maxims and 6 scenarios.

| Maxim | Sub-maxims | Scenarios |
|-------|------------|-----------|
| **M1: Be Clear & Specific** | Be specific, not vague / Avoid ambiguity | 4 |
| **M2: Provide Context & Intent** | Provide relevant context / State your intent | 4 |
| **M3: Guide the Output** | Show what "good" looks like / Include everything needed, nothing extra | 4 |
| **M4: Iterate & Collaborate** | Give specific feedback / Collaborate with AI | 4 |
| **M5: Verify & Think Critically** | Verify before you trust / Know what AI can't do | 4 |
| **M6: Use AI Responsibly** | Recognize and challenge bias / Maintain human oversight / Understand safety boundaries | 6 |

See [SCENARIO-MAP.md](SCENARIO-MAP.md) for the full mapping of all 26 scenarios to maxims, sub-maxims, and principles.

### 12 Communication Skills

Every scenario teaches one or more of these principles, guided by research in Gricean pragmatics and human-AI communication:

**Communication fundamentals:**
1. **Be specific, not vague** — Ask for exactly what you want
2. **Provide context** — Share who you are, what you're working on, what constraints exist
3. **State your intent** — Explain what you'll use the result for
4. **Avoid ambiguity** — Don't use yes/no questions when you want information
5. **Show what "good" looks like** — Give examples of format, tone, or style
6. **Give specific feedback** — Say what's wrong and how to fix it, not just "try again"
7. **Ask the AI to ask you questions** — Let it interview you instead of guessing
8. **Ask the AI to write prompts for you** — Let it crystallize your request

**Verification and critical thinking:**
9. **Verify before you trust** — Don't take AI answers at face value — ask it to show its work and flag what it's unsure about
10. **Include everything needed — but nothing extra** — Give the AI all the important details, but cut anything that doesn't help

**AI awareness and responsibility:**
11. **Know what AI can't do** — AI has a training cutoff, can't browse the web, has no personal experience, and sometimes avoids topics without explaining why
12. **Use AI responsibly** — AI can reflect biases, agree when it shouldn't, and produce harmful content — you're the human quality filter

### 26 Guided Scenarios

All scenarios use a **guided practice** format: compare 3 prompt approaches (weak, getting there, effective) side by side, see the AI response each produces, and receive specific feedback tied to communication principles. Then write your own version and get scored.

Scenarios span personal, work, and school contexts — from writing emails and planning meals to catching AI hallucinations, decoding AI refusals, and auditing for bias.

### Additional Features

- **Welcome Banner** — First-visit banner highlighting 3 key facts most people don't know about AI: confident-sounding errors, sycophancy, and how communication skills fix most frustrations.
- **Pre-Scenario Reminders** — Dismissible reminder before each scenario that AI can sound confident and still be wrong.
- **Using AI Wisely** — Standalone guide covering critical AI limitations: hallucination, sycophancy, bias, knowledge cutoffs, operational limits, evasiveness, and more. Accessible from the landing page and header navigation.
- **Collapsible Maxim Groups** — Scenarios organized by maxim, defaulting to collapsed with completion counters.
- **Progression Recommendations** — The tool suggests what to try next based on which skills you haven't practiced yet.
- **Personalization** — Optional "What do you use AI for?" question to surface the most relevant scenarios.
- **Progress Tracking** — Tracks completed scenarios and practiced principles in your browser.
- **Copy-to-Real-AI Workflow** — Every scenario includes copy buttons and links to ChatGPT, Claude, Gemini, and Copilot so you can immediately practice in real tools.
- **Accessible** — Skip-to-content link, ARIA labels, reduced motion support, color contrast compliant, semantic HTML.
- **Mobile Friendly** — Responsive design that works on phones, tablets, and desktops.

---

## Architecture

The public web app is a **fully static site** with no backend and no outbound network requests. All content is pre-generated at build time. No API keys are needed or accepted in the deployed app.

- **Frontend:** React 19, Vite 8, Tailwind CSS v4
- **Content:** 26 pre-generated JSON scenario files (generated once by a local script using Claude or Gemini APIs)
- **Scoring:** Client-side heuristic scorer using regex pattern matching against the 12 communication principles
- **Testing:** Vitest + React Testing Library
- **Storage:** Progress saved in browser `localStorage`
- **Deployment:** GitHub Pages (static files only)
- **Security:** Content Security Policy with `connect-src 'none'` (no outbound requests), frame-buster for clickjacking protection, HTML escaping on all rendered content

---

## Security

PromptBridge Lite is designed as a zero-trust static site:

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
git clone https://github.com/vegaPDX/PromptBridge-Lite.git
cd PromptBridge-Lite/app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

All 26 guided scenarios work immediately with pre-generated content. No API key required.

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
promptbridge_lite/
├── README.md
├── PROJECT_OVERVIEW.md                # Project vision, goals, and research foundation
├── SCENARIO-MAP.md                    # Full mapping of 26 scenarios to maxims and principles
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
├── artifact/
│   └── PromptBridge.jsx               # Original single-file Claude.ai artifact
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
        │   ├── scenarios.js           # 26 scenario definitions
        │   ├── maxims.js              # 6 maxims with 13 sub-maxims
        │   ├── principles.js          # 12 communication principles
        │   ├── categories.js          # Maxim display labels and colors
        │   ├── assessment-scenarios.js # Pre/post assessment scenario IDs
        │   ├── demo.js                # Landing page demo prompts and responses
        │   ├── icon-map.js            # Dynamic Lucide icon resolver
        │   ├── prompts.js             # LLM prompt templates (used by generate-content.js)
        │   └── generated/             # 26 pre-generated JSON files (one per scenario)
        ├── pages/
        │   ├── LandingPage.jsx        # Home page with demo
        │   ├── ScenarioSelector.jsx   # Maxim-grouped scenario browser
        │   ├── GuidedMode.jsx         # Guided practice with pre-generated content
        │   ├── ProgressPage.jsx       # Progress tracking dashboard
        │   ├── HelpPage.jsx           # Help and getting started
        │   └── AiSafetyPage.jsx       # "Using AI Wisely" standalone guide
        ├── services/
        │   ├── guided-data.js         # Data loading for guided scenarios
        │   ├── heuristic-scorer.js    # Client-side prompt quality scoring
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

This license was chosen to honor the spirit of the NeuroBridge research that inspired PromptBridge: knowledge should be shared freely to advance understanding, not locked away for profit.

---

## Acknowledgments

- **NeuroBridge** (Haroon et al., Tufts University) — The research that inspired PromptBridge's pedagogical approach. [Read the paper](https://dl.acm.org/doi/10.1145/3663547.3746337)
- **Miehling et al.** (IBM Research, EMNLP 2024) — Extended Gricean maxims with Transparency and Benevolence for human-AI communication, providing the framework for principles 9–12 and the AI safety guide
- **Anthropic**, **OpenAI**, and **Google** — Prompting best practices documentation that informed the communication principles and AI safety guidance
- Communication principles are guided by research in Gricean pragmatics and human-AI interaction, taught in an AI-agnostic, jargon-free way
