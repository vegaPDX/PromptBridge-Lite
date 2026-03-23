# PromptBridge

**An open-source, interactive tool that teaches people how to communicate effectively with AI assistants.**

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

NeuroBridge uses a pick-from-options, see-consequences, receive-feedback interaction model. PromptBridge adapts this same pedagogical approach for AI communication training: users pick prompts (or write their own), see side-by-side AI responses, and get specific feedback tied to communication principles.

**Citation:**
> Haroon, R., Wigdor, K., Yang, K., Toumanios, N., Crehan, E.T., & Dogar, F. (2025). "NeuroBridge: Using Generative AI to Bridge Cross-neurotype Communication Differences through Neurotypical Perspective-taking." In *Proceedings of the 27th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS '25)*. ACM. DOI: [10.1145/3663547.3746337](https://dl.acm.org/doi/10.1145/3663547.3746337)

---

## What PromptBridge Does

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

### 33 Practice Scenarios

30 guided scenarios across 4 categories (Vague vs. Specific, Context & Framing, Iterative Refinement, Smart Strategies) plus 3 freeform scenarios for multi-skill practice.

### 4 Learning Modes

- **Guided Practice** — Pick from 3 prompt options, see side-by-side AI responses, get feedback. Try again with shuffled options. Then write your own version and get scored.
- **Write Your Own** — Write a prompt from scratch, get AI-powered analysis (with API key) or copy & try it in your own tool.
- **Write First** — Write your prompt, then evaluate 3 AI-generated variations of it. *(Requires API key)*
- **Practice Iterating** — Write an initial prompt, see a mediocre response, write a follow-up, see the improvement. *(Requires API key)*

### Three Access Tiers

| Tier | Setup | What works |
|------|-------|-----------|
| **Free (static)** | None | All 30 guided scenarios with pre-generated content, replay, heuristic scoring, assessment |
| **Free (Gemini)** | Free API key from [Google AI Studio](https://aistudio.google.com/apikey) | Everything above + AI-powered freeform analysis, Write First mode, Practice Iterating mode |
| **BYOK** | Your own Claude or OpenAI key | Same as above, using your preferred provider |

### Additional Features

- **Skill Assessment** — Pre/post assessment to measure improvement over time
- **Progression Recommendations** — The tool suggests what to try next based on which skills you haven't practiced yet
- **Personalization** — Optional "What do you use AI for?" question to surface the most relevant scenarios
- **AI Safety Guide** — Comprehensive risk awareness section sourced from official Anthropic, OpenAI, and Google guidance
- **Progress Tracking** — Tracks completed scenarios and practiced principles in your browser

---

## Current Development Status

**Phase: Local development prototype (pre-deployment)**

The app is a fully functional Vite + React standalone application. All features are implemented and building cleanly. The current state:

- 30 guided scenarios with pre-generated content (options, responses, feedback for all 3 user choices)
- 3 freeform scenarios with AI-powered or copy-and-try paths
- Multi-provider LLM adapter (Gemini, Claude, OpenAI) for real-time features
- All 4 learning modes (Guided, Write Your Own, Write First, Practice Iterating)
- Pre/post skill assessment with heuristic scoring
- Personalization, progression recommendations, and progress tracking
- Help page with comprehensive user guide and AI safety information
- Accessibility improvements (ARIA labels, reduced motion, color contrast, semantic HTML)
- Feedback tone audit (all 30 generated content files reviewed for non-defensive language)

**What has NOT been tested yet:**
- Full end-to-end user testing with real users (protocol written, not yet executed)
- Production deployment
- Performance under load
- Cross-browser compatibility beyond Chrome

---

## Local Development Setup

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

### Guided Mode (no setup needed)

All 30 guided scenarios work immediately with pre-generated content. No API key required.

### Freeform Mode + Advanced Features (optional API key)

To unlock AI-powered feedback, Write First mode, and Practice Iterating mode:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Open the app and go to Settings (gear icon)
3. Select "Gemini" as your provider
4. Paste your API key and click Save

Alternatively, you can set the key as an environment variable:

```bash
# Create .env file in the app/ directory
echo "VITE_GEMINI_API_KEY=your-key-here" > .env

# Restart the dev server
npm run dev
```

### Regenerating Content

If you want to regenerate the static content for guided scenarios (e.g., after editing prompts):

```bash
cd app

# Using Gemini (free)
GEMINI_API_KEY=your-key node scripts/generate-content.js --provider gemini

# Using Claude
ANTHROPIC_API_KEY=your-key node scripts/generate-content.js

# Single scenario
GEMINI_API_KEY=your-key node scripts/generate-content.js --provider gemini --scenario 1.1-snow-shoveling
```

This generates ~5 API calls per scenario (options, responses, 3x feedback variants). Existing files are skipped automatically.

### Validating Scenarios

```bash
cd app
node scripts/validate-scenario.js --all
```

### Building for Production

```bash
cd app
npm run build
```

Output goes to `app/dist/`.

---

## Project Structure

```
promptbridge/
├── README.md
├── PROJECT_SPEC.md              # Product specification
├── ARCHITECTURE.md              # Two-phase architecture (artifact → standalone)
├── SCENARIOS.md                 # Full scenario library documentation
├── PROMPT_TEMPLATES.md          # LLM prompt design documentation
├── RESEARCH_FINDINGS.md         # NeuroBridge deep dive and gap analysis
├── RESEARCH_SESSION.md          # Research session instructions
├── CONTRIBUTING_SCENARIOS.md    # Guide for contributing new scenarios
├── USER_TESTING_PROTOCOL.md     # Usability testing protocol
├── QA_CHECKLIST.csv             # 96-item QA test checklist
│
├── artifact/
│   └── PromptBridge.jsx         # Original single-file Claude.ai artifact
│
└── app/                         # Vite + React standalone app
    ├── package.json
    ├── vite.config.js
    ├── scripts/
    │   ├── generate-content.js  # Static content generation pipeline
    │   └── validate-scenario.js # Scenario validation script
    └── src/
        ├── App.jsx              # Main app — state management and routing
        ├── index.css            # Tailwind CSS + animations
        ├── data/
        │   ├── scenarios.js     # All 33 scenario definitions
        │   ├── principles.js    # 8 communication principles
        │   ├── prompts.js       # LLM system prompts and message builders
        │   ├── categories.js    # Scenario category definitions
        │   ├── demo.js          # Landing page demo content
        │   ├── assessment-scenarios.js
        │   ├── icon-map.js
        │   └── generated/       # 30 pre-generated JSON files (one per guided scenario)
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── ScenarioSelector.jsx
        │   ├── GuidedMode.jsx   # Core guided learning interaction
        │   ├── FreeformMode.jsx # Write-your-own practice
        │   ├── HybridMode.jsx   # Write-first guided mode
        │   ├── MultiTurnMode.jsx # Multi-turn practice
        │   ├── AssessmentMode.jsx
        │   ├── ProgressPage.jsx
        │   ├── SettingsPage.jsx
        │   └── HelpPage.jsx     # User guide + AI safety
        ├── services/
        │   ├── llm.js           # Multi-provider LLM adapter
        │   ├── storage.js       # localStorage persistence
        │   ├── guided-data.js   # Lazy JSON content loader
        │   ├── recommendations.js
        │   └── heuristic-scorer.js
        └── components/
            ├── Header.jsx
            ├── ResponseComparison.jsx
            ├── PrincipleBadge.jsx
            ├── CopyButton.jsx
            ├── MarkdownText.jsx
            ├── LoadingSpinner.jsx
            └── ErrorBanner.jsx
```

---

## Future Roadmap

### Near-term: Validation & Polish

- **User testing** — Conduct 5-10 informal usability sessions using the [testing protocol](USER_TESTING_PROTOCOL.md) to identify confusion points and feedback tone issues
- **QA pass** — Work through the [96-item QA checklist](QA_CHECKLIST.csv) to document what works and what needs fixes
- **Cross-browser testing** — Verify Firefox, Safari, Edge, and mobile browsers
- **Content quality review** — Review all 30 generated scenario files for response quality and feedback accuracy

### Mid-term: Public Deployment

- **Static hosting** — Deploy the app to Vercel, Netlify, or GitHub Pages (the static tier works with no backend)
- **Custom domain** — Set up a public URL
- **Analytics** — Add privacy-respecting analytics (e.g., Plausible) to understand usage patterns
- **SEO and sharing** — Open Graph tags, social previews, meta descriptions
- **PWA support** — Service worker for offline guided mode

### Long-term: Growth & Community

- **Community scenarios** — Open contributions following the [scenario contribution guide](CONTRIBUTING_SCENARIOS.md)
- **Translations / i18n** — Scenario and feedback localization
- **Classroom mode** — Features for educators using PromptBridge in workshops or courses
- **Backend API** — Optional FastAPI backend for server-side LLM calls, usage tracking, and shared progress
- **Evaluation framework** — Formal pre/post skill measurement aligned with NeuroBridge's evaluation methodology
- **Expanded scenario library** — Domain-specific scenarios (healthcare communication, legal research, software development, academic writing)

---

## Contributing

Contributions are welcome! The easiest way to contribute is by adding new scenarios. See [CONTRIBUTING_SCENARIOS.md](CONTRIBUTING_SCENARIOS.md) for the format and guidelines.

For code contributions, open an issue first to discuss the change.

---

## License

MIT

---

## Acknowledgments

- **NeuroBridge** (Haroon et al., Tufts University) — The research that inspired PromptBridge's pedagogical approach. [Read the paper](https://dl.acm.org/doi/10.1145/3663547.3746337)
- **Anthropic**, **OpenAI**, and **Google** — Prompting best practices documentation that informed the 8 communication principles and AI safety guidance
- Communication principles are sourced from and aligned with official documentation from all three providers, taught in an AI-agnostic, jargon-free way
