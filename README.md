# PromptBridge

**An interactive, open-source tool that teaches people how to communicate effectively with AI assistants.**

### **[Try it now — https://vegapdx.github.io/PromptBridge/](https://vegapdx.github.io/PromptBridge/)**

No signup. No API key. No backend. Just open and start learning.

---

PromptBridge teaches the universal communication skills that make AI conversations productive — being specific, providing context, verifying AI output, understanding AI limitations, and using AI responsibly. The skills you learn here work with any AI tool: ChatGPT, Claude, Gemini, Copilot, or any other conversational AI.

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

### 68 Practice Scenarios

53 guided scenarios across 5 categories plus 15 freeform "Write Your Own" scenarios covering personal, work, school, and coding contexts:

- **Vague vs. Specific** (10) — Learn why "help me with this" fails and specificity succeeds. Includes sycophancy awareness — spotting when AI agrees with your mistakes instead of correcting them.
- **Context & Framing** (14) — Practice giving the AI the background it needs. Covers training cutoffs, AI's lack of personal experience, and how AI can reflect demographic biases in its output.
- **Iterative Refinement** (12) — Build the skill of steering AI through follow-ups. Includes verifying AI accuracy, resetting long conversations, and auditing AI output for bias.
- **Smart Strategies** (17) — Advanced techniques like step-by-step reasoning, few-shot examples, structured prompts, interviewing AI about its own limitations, decoding AI refusals, and red-teaming AI output for errors and bias.
- **Full Conversation Loop** (15) — Open-ended freeform scenarios to combine all skills in realistic workflows.

### 2 Learning Modes

- **Guided Practice** — Compare 3 prompt approaches (weak, medium, effective) side by side. See the AI response each one produces. Learn why specific, context-rich prompts get dramatically better results. Then write your own version and get scored.
- **Write Your Own** — Write a prompt from scratch for any of 15 diverse scenarios. Get instant feedback on which communication skills you applied. Copy your prompt and try it in any real AI tool — ChatGPT, Claude, Gemini, or Copilot.

### Additional Features

- **Using AI Wisely** — Standalone guide covering 9 critical AI limitations: hallucination, sycophancy, bias, knowledge cutoffs, operational limits, evasiveness, and more. Accessible from the landing page ("Heads Up") and the header navigation.
- **Collapsible Scenario Categories** — Categories default to collapsed with completion counters, keeping the scenario page clean as the library grows.
- **Skill Assessment** — Pre/post assessment to measure improvement over time
- **Progression Recommendations** — The tool suggests what to try next based on which skills you haven't practiced yet
- **Personalization** — Optional "What do you use AI for?" question to surface the most relevant scenarios
- **Progress Tracking** — Tracks completed scenarios and practiced principles in your browser
- **Copy-to-Real-AI Workflow** — Every scenario includes copy buttons and links to ChatGPT, Claude, Gemini, and Copilot so you can immediately practice in real tools
- **Accessible** — ARIA labels, reduced motion support, color contrast compliant, semantic HTML
- **Mobile Friendly** — Responsive design that works on phones, tablets, and desktops

---

## Architecture

The public web app is a **fully static site** with no backend and no outbound network requests. All content is pre-generated at build time. No API keys are needed or accepted in the deployed app.

- **Frontend:** React 19, Vite 8, Tailwind CSS v4
- **Content:** 53 pre-generated JSON scenario files (generated once by a local script using Claude or Gemini APIs)
- **Scoring:** Client-side heuristic scorer using regex pattern matching against the 12 communication principles
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

All 68 scenarios work immediately — 53 guided scenarios with pre-generated content, and 15 write-your-own scenarios with heuristic scoring. No API key required.

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
├── PROJECT_OVERVIEW.md                # Project vision, goals, and research foundation
├── LICENSE                            # AGPL-3.0
├── docs/                              # Project documentation
│   ├── PROJECT_SPEC.md
│   ├── ARCHITECTURE.md
│   ├── SCENARIOS.md
│   ├── ROADMAP.md
│   ├── PROMPT_TEMPLATES.md
│   ├── RESEARCH_FINDINGS.md
│   ├── CONTRIBUTING_SCENARIOS.md
│   ├── USER_TESTING_PROTOCOL.md
│   ├── QA_CHECKLIST.csv
│   ├── Conversational maxims for AI...md  # Miehling et al. research mapping
│   └── Gricean pragmatics meets...md      # Gricean pragmatics evidence base
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
    ├── scripts/
    │   ├── generate-content.js        # Static content generation pipeline
    │   └── validate-scenario.js       # Scenario validation script
    └── src/
        ├── App.jsx                    # Main app — state management and routing
        ├── main.jsx                   # Entry point with frame-buster
        ├── index.css                  # Tailwind CSS + animations
        ├── data/
        │   ├── scenarios.js           # All 68 scenario definitions
        │   ├── principles.js          # 12 communication principles
        │   ├── categories.js          # Category labels and descriptions
        │   ├── prompts.js             # LLM prompt templates (used by generate-content.js)
        │   └── generated/             # 53 pre-generated JSON files (one per guided scenario)
        ├── pages/                     # 8 page components
        │   ├── LandingPage.jsx        # Home page with demo
        │   ├── ScenarioSelector.jsx   # Collapsible category browser with tabs
        │   ├── GuidedMode.jsx         # Guided practice with pre-generated content
        │   ├── FreeformMode.jsx       # Write-your-own with heuristic scoring
        │   ├── AssessmentMode.jsx     # Pre/post skill assessment
        │   ├── ProgressPage.jsx       # Progress tracking dashboard
        │   ├── HelpPage.jsx           # Help and getting started
        │   └── AiSafetyPage.jsx       # "Using AI Wisely" standalone guide
        ├── services/                  # Storage, heuristic scoring, guided data, recommendations
        └── components/                # Header, CopyButton, AiToolLinks, MarkdownText, etc.
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
