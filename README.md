# PromptBridge

**An interactive, open-source tool that teaches people how to communicate effectively with AI assistants.**

### **[Try it now — https://vegapdx.github.io/PromptBridge/](https://vegapdx.github.io/PromptBridge/)**

No signup. No API key. No backend. Just open and start learning.

---

PromptBridge teaches the universal communication skills that make AI conversations productive — being specific, providing context, avoiding ambiguity, iterating based on feedback, and knowing when and how to refine. The skills you learn here work with any AI tool: ChatGPT, Claude, Gemini, Copilot, or any other conversational AI.

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

NeuroBridge uses a see-consequences, compare-approaches, receive-feedback interaction model. PromptBridge adapts this same pedagogical approach for AI communication training: users compare weak, medium, and strong prompts side by side, see the dramatically different AI responses each produces, and get specific feedback tied to communication principles.

**Citation:**
> Haroon, R., Wigdor, K., Yang, K., Toumanios, N., Crehan, E.T., & Dogar, F. (2025). "NeuroBridge: Using Generative AI to Bridge Cross-neurotype Communication Differences through Neurotypical Perspective-taking." In *Proceedings of the 27th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS '25)*. ACM. DOI: [10.1145/3663547.3746337](https://dl.acm.org/doi/10.1145/3663547.3746337)

---

## Features

### 8 Communication Skills

Every scenario teaches one or more of these principles:

1. **Be specific, not vague** — Ask for exactly what you want
2. **Provide context** — Share who you are, what you're working on, what constraints exist
3. **State your intent** — Explain what you'll use the result for
4. **Avoid ambiguity** — Don't use yes/no questions when you want information
5. **Show what "good" looks like** — Give examples of format, tone, or style
6. **Give specific feedback** — Say what's wrong and how to fix it, not just "try again"
7. **Ask the AI to ask you questions** — Let it interview you instead of guessing
8. **Ask the AI to write prompts for you** — Let it crystallize your request

### 45 Practice Scenarios

30 guided scenarios across 4 categories plus 15 freeform "Write Your Own" scenarios covering personal, work, school, and coding contexts:

- **Vague vs. Specific** — Learn why "help me with this" fails and specificity succeeds
- **Context & Framing** — Practice giving the AI the background it needs
- **Iterative Refinement** — Build the skill of steering AI through follow-ups
- **Smart Strategies** — Advanced techniques like few-shot examples, role-switching, and structured prompts
- **Write Your Own** — Open-ended scenarios to practice without guardrails

### 2 Learning Modes

- **Guided Practice** — Compare 3 prompt approaches (weak, medium, effective) side by side. See the AI response each one produces. Learn why specific, context-rich prompts get dramatically better results. Then write your own version and get scored.
- **Write Your Own** — Write a prompt from scratch for any of 15 diverse scenarios. Get instant feedback on which communication skills you applied. Copy your prompt and try it in any real AI tool — ChatGPT, Claude, Gemini, or Copilot.

### Additional Features

- **Skill Assessment** — Pre/post assessment to measure improvement over time
- **Progression Recommendations** — The tool suggests what to try next based on which skills you haven't practiced yet
- **Personalization** — Optional "What do you use AI for?" question to surface the most relevant scenarios
- **AI Safety Guide** — Comprehensive risk awareness section sourced from official Anthropic, OpenAI, and Google guidance
- **Progress Tracking** — Tracks completed scenarios and practiced principles in your browser
- **Copy-to-Real-AI Workflow** — Every scenario includes copy buttons and links to ChatGPT, Claude, Gemini, and Copilot so you can immediately practice in real tools
- **Accessible** — ARIA labels, reduced motion support, color contrast compliant, semantic HTML
- **Mobile Friendly** — Responsive design that works on phones, tablets, and desktops

---

## Architecture

The public web app is a **fully static site** with no backend and no outbound network requests. All content is pre-generated at build time. No API keys are needed or accepted in the deployed app.

- **Frontend:** React 19, Vite 8, Tailwind CSS v4
- **Content:** 30 pre-generated JSON scenario files (generated once by a local script)
- **Scoring:** Client-side heuristic scorer using regex pattern matching against the 8 communication principles
- **Storage:** Progress saved in browser `localStorage`
- **Deployment:** GitHub Pages (static files only)
- **Security:** Content Security Policy with no `connect-src` (no outbound requests), frame-buster for clickjacking protection, HTML escaping on all rendered content

---

## Security

PromptBridge is designed as a zero-trust static site:

- **No API keys in the public app** — The deployed web app makes no network requests. There are no API keys, no secrets, and nothing sensitive stored in the browser.
- **XSS prevention** — All pre-generated content is HTML-escaped before rendering via `dangerouslySetInnerHTML`. All other dynamic content uses React text nodes (auto-escaped).
- **Content Security Policy** — Strict `<meta>` CSP blocks inline scripts, disallows all outbound connections (`connect-src` omitted), prevents plugin embedding (`object-src 'none'`), and restricts base URIs and form targets.
- **Clickjacking protection** — JavaScript frame-buster in `main.jsx` (CSP `frame-ancestors` doesn't work in `<meta>` tags, and GitHub Pages doesn't support custom HTTP headers).
- **Input length limits** — All user prompt textareas are capped at 4,000 characters.
- **No bundled secrets** — The `.env.example` only contains non-`VITE_` prefixed variables used by the local content generation script.

If you find a security issue, please open an issue or contact the maintainer directly.

---

## Contributing

Contributions are welcome! The easiest way to contribute is by adding new scenarios. See [docs/CONTRIBUTING_SCENARIOS.md](docs/CONTRIBUTING_SCENARIOS.md) for the format and guidelines.

For code contributions, open an issue first to discuss the change.

---

## Roadmap

### Near-term: Validation & Polish

- **User testing** — Conduct informal usability sessions using the [testing protocol](docs/USER_TESTING_PROTOCOL.md) to identify confusion points and feedback tone issues
- **QA pass** — Work through the [96-item QA checklist](docs/QA_CHECKLIST.csv)
- **Cross-browser testing** — Verify Firefox, Safari, Edge, and mobile browsers

### Future

- **Community scenarios** — Open contributions following the [scenario contribution guide](docs/CONTRIBUTING_SCENARIOS.md)
- **Translations / i18n** — Scenario and feedback localization
- **Classroom mode** — Features for educators using PromptBridge in workshops or courses
- **Analytics** — Privacy-respecting analytics (e.g., Plausible) to understand usage patterns
- **PWA support** — Service worker for offline guided mode
- **Expanded scenario library** — Domain-specific scenarios (healthcare, legal, software development, academic writing)

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

All 45 scenarios work immediately — 30 guided scenarios with pre-generated content, and 15 write-your-own scenarios with heuristic scoring. No API key required.

### Power Users: API-Powered Features (Local Only)

For developers and power users who want richer AI-powered analysis, the codebase supports additional modes that require an API key and a local development server. These features are **not available in the public web app** by design — running locally keeps your API key secure (never exposed to the internet).

To enable API-powered features locally:

1. **Get an API key:**
   - **Free:** [Google AI Studio](https://aistudio.google.com/apikey) (Gemini, free tier)
   - **Paid:** [Anthropic Console](https://console.anthropic.com) (Claude) or [OpenAI Platform](https://platform.openai.com) (GPT-4o-mini)

2. **Clone and run locally:**
   ```bash
   git clone https://github.com/vegaPDX/PromptBridge.git
   cd PromptBridge/app
   npm install
   npm run dev
   ```

3. **Check out the `api-features` branch** (or the historical code before the static-only pivot) to access the API-powered modes:
   - **Write First** — Write your prompt, then evaluate 3 AI-generated variations
   - **Practice Iterating** — Multi-turn conversation practice with AI feedback
   - **AI-Powered Analysis** — Detailed analysis of your prompts with improved version suggestions and side-by-side response comparison

> **Why local only?** API keys entered into a public website are inherently at risk — they can appear in browser history, network logs, or be exposed via XSS. Running locally eliminates these risks entirely. Your key never leaves your machine.

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
├── LICENSE                         # AGPL-3.0
├── docs/                           # Project documentation
│   ├── PROJECT_SPEC.md             # Product specification
│   ├── ARCHITECTURE.md             # Architecture documentation
│   ├── SCENARIOS.md                # Full scenario library documentation
│   ├── PROMPT_TEMPLATES.md         # LLM prompt design documentation
│   ├── RESEARCH_FINDINGS.md        # NeuroBridge deep dive and gap analysis
│   ├── CONTRIBUTING_SCENARIOS.md   # Guide for contributing new scenarios
│   ├── USER_TESTING_PROTOCOL.md    # Usability testing protocol
│   └── QA_CHECKLIST.csv            # 96-item QA test checklist
│
├── artifact/
│   └── PromptBridge.jsx            # Original single-file Claude.ai artifact
│
├── .github/
│   ├── workflows/deploy.yml        # GitHub Pages auto-deploy
│   └── CODEOWNERS                  # PR review requirements
│
└── app/                            # Vite + React standalone app
    ├── package.json
    ├── vite.config.js
    ├── scripts/
    │   ├── generate-content.js     # Static content generation pipeline
    │   └── validate-scenario.js    # Scenario validation script
    └── src/
        ├── App.jsx                 # Main app — state management and routing
        ├── main.jsx                # Entry point with frame-buster
        ├── index.css               # Tailwind CSS + animations
        ├── data/
        │   ├── scenarios.js        # All 45 scenario definitions
        │   ├── principles.js       # 8 communication principles
        │   ├── prompts.js          # LLM prompt templates (used by generate-content.js)
        │   └── generated/          # 30 pre-generated JSON files (one per guided scenario)
        ├── pages/                  # 7 page components
        │   ├── LandingPage.jsx     # Home page
        │   ├── ScenarioSelector.jsx # Scenario browser with tabs
        │   ├── GuidedMode.jsx      # Guided practice with pre-generated content
        │   ├── FreeformMode.jsx    # Write-your-own with heuristic scoring
        │   ├── AssessmentMode.jsx  # Pre/post skill assessment
        │   ├── ProgressPage.jsx    # Progress tracking dashboard
        │   └── HelpPage.jsx        # Help and AI safety guide
        ├── services/               # Storage, heuristic scoring, recommendations
        └── components/             # Shared UI components
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
- **Anthropic**, **OpenAI**, and **Google** — Prompting best practices documentation that informed the 8 communication principles and AI safety guidance
- Communication principles are sourced from and aligned with official documentation from all three providers, taught in an AI-agnostic, jargon-free way
