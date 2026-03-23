# PromptBridge Research Session — NeuroBridge Deep Dive

## Instructions for Claude Code

You are conducting a deep research session for the PromptBridge project. This has two parts:

### Part 1: Codebase & Plan Review

Review the current state of the PromptBridge local dev prototype:

**Documentation to read (all in this directory):**
- `PROJECT_SPEC.md` — what the tool is, core features, design principles
- `ARCHITECTURE.md` — two-phase dev strategy, artifact vs standalone
- `SCENARIOS.md` — full scenario library (30 guided + 3 freeform), 8 communication principles
- `PROMPT_TEMPLATES.md` — system prompts for LLM components

**Implementation plan:**
- `.claude/plans/idempotent-dazzling-matsumoto.md` — the approved hybrid architecture plan (Option D)

**Codebase to review (the Vite + React standalone app):**
- `app/src/` — all components, pages, data, and services
- `app/src/data/scenarios.js` — all 30 guided scenarios with principles mapping
- `app/src/data/principles.js` — the 8 communication principles
- `app/src/data/generated/` — pre-generated static content (30 JSON files)
- `app/src/pages/GuidedMode.jsx` — the core guided learning interaction
- `app/src/pages/FreeformMode.jsx` — the freeform practice mode with 3 access tiers
- `app/src/services/llm.js` — multi-provider LLM adapter
- `app/scripts/generate-content.js` — static content generation pipeline

**Original artifact for reference:**
- `artifact/PromptBridge.jsx` — the original single-file Claude.ai artifact

Understand the full architecture, the three access tiers (free static, free Gemini, BYOK), the "Copy & Try" workflow, and how the 8 principles map to the 30 scenarios.

### Part 2: NeuroBridge Research Deep Dive

NeuroBridge is a training tool from Tufts University that won Best Student Paper at ASSETS 2025. It trains neurotypical people to communicate more clearly with autistic individuals. PromptBridge is directly inspired by this — the core insight being that the communication skills NeuroBridge teaches (direct, literal, unambiguous, context-rich) are the same skills that make someone effective at communicating with AI.

**Research tasks:**

1. **Find and read the NeuroBridge papers.** Search for:
   - "NeuroBridge ASSETS 2025"
   - "NeuroBridge Tufts University"
   - "Haroon NeuroBridge" (lead author)
   - "NeuroBridge autism communication training"
   - Try ACM Digital Library, arXiv, Google Scholar
   - Look for the ASSETS 2025 paper specifically (ACM SIGACCESS Conference on Computers and Accessibility)
   - Also search for any preliminary/workshop papers, posters, or related publications from the same research group

2. **Analyze NeuroBridge's pedagogical approach:**
   - What learning theory or framework does NeuroBridge use?
   - What is the interaction model? (scenarios, feedback, progression)
   - How does it measure learning effectiveness?
   - What communication principles does it teach?
   - How does it structure scenarios and feedback?
   - What makes it effective as a training tool (per their evaluation)?
   - What were the key findings from their user study?

3. **Map NeuroBridge → PromptBridge alignment:**
   - Where does PromptBridge already match the spirit and methods of NeuroBridge?
   - Which NeuroBridge communication principles map directly to our 8 principles?
   - Does PromptBridge's guided mode (pick from 3 options → see comparison → get feedback) mirror NeuroBridge's interaction model?
   - Does the side-by-side comparison approach align with how NeuroBridge teaches?

4. **Identify gaps and opportunities:**
   - What pedagogical techniques does NeuroBridge use that PromptBridge currently lacks?
   - Does NeuroBridge have adaptive difficulty, spaced repetition, or scaffolded progression?
   - Does NeuroBridge provide pre/post assessment to measure skill growth?
   - Are there feedback mechanisms in NeuroBridge we should adopt?
   - Does NeuroBridge address multi-turn conversation skills? How?
   - What does NeuroBridge's evaluation reveal about what makes training effective vs. ineffective?

5. **Propose improvements to PromptBridge:**
   Based on the NeuroBridge research, what concrete improvements could make PromptBridge a more effective training tool? Consider:
   - Learning progression and scaffolding
   - Assessment and skill measurement
   - Feedback quality and timing
   - Scenario design principles
   - Retention and transfer of skills
   - Accessibility considerations
   - Multi-turn conversation training
   - Any insights from NeuroBridge's evaluation methodology

### Output

Write your findings to a new file: `RESEARCH_FINDINGS.md` in this project directory.

Structure it as:
1. **NeuroBridge Summary** — what it is, how it works, key findings
2. **Pedagogical Framework** — the learning theory and methods it uses
3. **Alignment Analysis** — where PromptBridge matches NeuroBridge
4. **Gap Analysis** — what's missing or could be stronger
5. **Improvement Recommendations** — concrete, prioritized suggestions
6. **References** — all papers and sources found

Be thorough. This research will inform the next phase of PromptBridge development.
