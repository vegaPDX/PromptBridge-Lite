# PromptBridge Research Findings — NeuroBridge Deep Dive

*Research conducted: 2026-03-22*

---

## 1. NeuroBridge Summary

### What It Is

NeuroBridge is an AI-based interactive learning platform developed at Tufts University that trains **neurotypical people** to communicate more clearly with autistic individuals. It won **Best Student Paper** at ASSETS 2025 (the ACM SIGACCESS Conference on Computers and Accessibility).

The tool flips the traditional intervention paradigm: rather than requiring autistic people to learn neurotypical communication norms (the default approach in most existing tools), NeuroBridge trains the other direction — teaching neurotypical users to recognize, understand, and accommodate autistic communication preferences.

### How It Works

NeuroBridge uses GPT-4o (with Claude 3.5 Sonnet for emoji scenarios) to simulate an AI character that communicates in a direct, literal style common among many autistic individuals. Users interact with this character across four communication scenarios, each highlighting a different source of cross-neurotype miscommunication.

**Per-scenario interaction flow:**
1. User composes a message to the AI character
2. A **Message Options Generator** transforms the user's message into 3 semantically similar but pragmatically different variations (varying in directness, clarity, or phrasing)
3. User selects one option to send
4. The AI character responds authentically — if the message is ambiguous, the character asks clarifying questions rather than assuming
5. A **Feedback Generator** delivers structured feedback: identifies the interpretation gap, highlights the best option, explains reasoning, and suggests alternative phrasing

Users complete 2 rounds of each of 4 scenarios (8 total interactions, ~60 minutes).

### The Four Scenarios

| Scenario | Communication Challenge | Example |
|----------|------------------------|---------|
| **Indirect Speech Acts** | Implicit requests vs. literal questions | "Can you open the window?" interpreted as an ability question rather than a request |
| **Figurative Expression** | Idioms and metaphors vs. literal meanings | "She has a chip on her shoulder" misunderstood as a physical object |
| **Emoji Variable Interpretation** | Context-dependent emoji meaning | Fire emoji interpreted as either praise or a literal warning |
| **Misperceived Bluntness** | Direct honesty perceived as rudeness | "I don't like your idea" seen as harsh criticism rather than a neutral opinion |

### Key Findings (User Study, N=12)

- **9 of 12** participants reported improved understanding of how autistic people interpret language differently
- **All 12** described autism afterward as "a social difference that needs understanding by others" (6.42/7 agreement)
- **8 of 12** valued hands-on practice over passive learning formats (blogs, videos)
- **7 of 12** said personalized feedback on their own messages was more impactful than generic examples
- Participants found feedback "constructive," "logical," and "non-judgmental"
- Many users "were surprised to find the interpretations were obvious in hindsight, but never occurred to them"
- Preference for interactive simulation over passive formats: **5.92/7**

**Challenges identified:**
- A few participants felt defensive when feedback critiqued their bluntness scenario messages
- ~40% found emoji scenario additions "random" or "out of place"
- Some participants assumed literal interpretation indicated lower comprehension rather than different processing (incomplete paradigm shift)
- Users tended to accept AI disability representations uncritically

---

## 2. Pedagogical Framework

### Theoretical Foundations

NeuroBridge builds on three frameworks:

1. **Double Empathy Problem (Milton, 2012):** Communication breakdowns between autistic and neurotypical people are bidirectional — both parties share responsibility. This rejects the "deficit model" where autistic people are assumed to lack skills.

2. **Social Model of Disability:** Disability arises from environmental mismatch, not individual impairment. The tool explicitly positions autism as a social difference requiring mutual accommodation.

3. **Gricean Maxims (H. Paul Grice):** The four conversational principles that NeuroBridge implicitly teaches users to adopt:
   - **Quality** (truthfulness) — autistic directness aligns with this
   - **Manner** (clarity) — literal interpretation ensures clarity
   - **Relevance** — avoiding phatic exchanges maintains focus
   - **Quantity** (conciseness) — direct style avoids unnecessary elaboration

### Learning Methods

- **Active/experiential learning:** Users discover principles through practice rather than instruction. The system demonstrates consequences rather than lecturing.
- **Personalization:** Scenarios are customized using user-provided information (name, pronouns, topic of interest).
- **Immediate cause-and-effect visibility:** The AI character's response makes the relationship between phrasing choices and interpretations immediately visible.
- **Safe practice environment:** The simulation provides "guardrails" for exploration without real-world consequences.
- **Multiple practice rounds:** 2 rounds per scenario allow consolidation.
- **Non-judgmental feedback framing:** Supportive language avoids "right/wrong" framing.

### What NeuroBridge Does NOT Have

Notably, NeuroBridge's pedagogical approach is relatively simple — it does **not** include:
- Adaptive difficulty
- Spaced repetition
- Scaffolded progression (all scenarios are the same difficulty)
- Pre/post assessment (they acknowledge this as a limitation)
- Longitudinal follow-up
- Objective measurement of real-world behavioral changes

The effectiveness comes primarily from the **interaction model itself** (write → choose → see consequences → receive feedback), personalization, and the quality of feedback — not from sophisticated learning science infrastructure.

---

## 3. Alignment Analysis — Where PromptBridge Matches NeuroBridge

### Core Insight: Shared Communication Problem

The foundational connection is strong and well-articulated in PromptBridge's design docs. NeuroBridge's four communication scenarios map directly to prompting anti-patterns:

| NeuroBridge Scenario | PromptBridge Equivalent | Mapping |
|---------------------|-------------------------|---------|
| **Indirect Speech Acts** — "Can you open the window?" taken literally | **P4: Avoid ambiguity** — "Do you know how to shovel snow faster?" answered literally | Direct match. Same pattern: indirect/binary questions producing literal/yes-no answers. Scenario 1.1 is essentially the same communication problem. |
| **Figurative Expression** — Idioms/metaphors interpreted literally | **P1: Be specific** — Keyword-style or vague queries producing surface-level results | Parallel structure. AI doesn't "misunderstand" metaphors the same way, but vague/keyword prompts produce analogously unhelpful results because the AI has no context to work with. |
| **Misperceived Bluntness** — Direct honesty seen as rude | **P6: Give specific feedback** — "Try again" vs. specific, direct feedback | Inverse of the same principle. NeuroBridge teaches appreciation of directness; PromptBridge teaches users to BE more direct. |
| **Emoji Variable Interpretation** — Context-dependent meaning | **P2: Provide context** — Same input, different interpretation without context | Weaker parallel but still present. Both highlight that meaning is context-dependent. |

### Interaction Model Alignment

The interaction models are remarkably similar:

| Element | NeuroBridge | PromptBridge Guided Mode |
|---------|-------------|--------------------------|
| **Scenario presentation** | User reads a scenario/situation | User reads a scenario/situation |
| **User choice** | 3 message options (varying quality) | 3 prompt options (weak/medium/strong) |
| **Consequence visibility** | AI character responds to selected option | Side-by-side comparison: weak vs. strong response |
| **Structured feedback** | Three-part: interpretation gap + best option + reasoning | Three-part: what happened + the principle + the tip |
| **Coaching tone** | "Constructive, logical, non-judgmental" | "Coach, not a grader" — specific, encouraging, never condescending |
| **Feedback length constraint** | Concise, focused | Under 200 words |

This is the strongest alignment point. Both tools use a **pick-from-options → see-consequences → receive-feedback** loop as their core learning interaction. PromptBridge did not just borrow the inspiration — it independently arrived at a very similar interaction model.

### Additional Shared Design Values

1. **Show, don't tell.** Both tools demonstrate consequences rather than lecturing. NeuroBridge's evaluation found this was the most valued aspect (8/12 preferred it over passive content). PromptBridge's core design principle #3 says the same: "Seeing the difference is more powerful than being told about it."

2. **Non-judgmental feedback.** NeuroBridge uses supportive language with encouraging tone. PromptBridge's feedback prompt explicitly says "You are a coach, not a grader" and instructs "If the user picked a WEAK option: Do NOT make them feel bad."

3. **Personalized, not generic.** NeuroBridge personalizes scenarios with user-provided information. PromptBridge generates feedback tied to the specific options and responses, not canned explanations.

4. **Safe practice environment.** Both provide consequence-free spaces to practice communication skills before real-world application.

5. **Realism of options.** NeuroBridge's options are "semantically similar but pragmatically different." PromptBridge's option generator is told: "All three options must be plausible things a real person would type. The weak option should NOT be exaggerated."

---

## 4. Gap Analysis — What's Missing or Could Be Stronger

### Gap 1: No Personalization of Scenarios

**NeuroBridge:** Users provide name, pronouns, and a topic of interest during registration. Scenarios are then personalized — the AI character references the user's topic, making interactions feel relevant and authentic.

**PromptBridge:** All 30 scenarios are fixed. Every user sees the same situations ("snow shoveling," "meal plan," "error message"). There's no mechanism to adapt scenarios to a user's role, industry, or interests.

**Impact:** NeuroBridge's evaluation found that personalization was a key driver of engagement. 7 of 12 participants specifically highlighted that personalized feedback on their own messages was more impactful than generic examples.

**Priority: Medium.** The fixed scenarios work well as a learning tool, but personalization would significantly increase relevance and engagement, especially for workplace training use cases.

### Gap 2: No Repeated Practice on the Same Scenario

**NeuroBridge:** Users complete **2 rounds** of each scenario. The second round lets them apply what they learned from the first round's feedback, creating a within-scenario learning arc.

**PromptBridge:** Each guided scenario is one-shot. The user picks an option, sees results, gets feedback, and moves on. There's no mechanism to try the same scenario again with different approach informed by the feedback.

**Impact:** The second-round consolidation in NeuroBridge is pedagogically important. It's the difference between hearing advice and practicing it. PromptBridge's current flow is more like a quiz than a practice session.

**Priority: High.** This is probably the highest-impact gap. Adding a "try again" option or a second round where users apply the feedback would transform guided mode from assessment into genuine practice.

### Gap 3: No User-Composed Input in Guided Mode

**NeuroBridge:** Even though users choose from 3 options, those options are generated **from the user's own initial message**. Users first write their own message, then the system transforms it into 3 variations. This means users are evaluating versions of their own communication style, not picking from pre-written options.

**PromptBridge (Guided):** The 3 options are pre-generated (or LLM-generated from the scenario description). Users evaluate someone else's prompts, not their own.

**Impact:** NeuroBridge's approach means the user is always reflecting on their own communication patterns. PromptBridge's guided mode is more like a multiple-choice test — users can identify good prompts without necessarily being able to write them.

**Priority: Medium-High.** This is a fundamental interaction model difference. The freeform mode partially addresses this (users write their own prompts), but the guided mode — where most users will start — lacks this self-reflective element. Consider a hybrid: user writes first, then sees 3 variations of their own prompt.

### Gap 4: No Pre/Post Assessment

**NeuroBridge:** Acknowledged as a limitation in their own paper. They used post-study Likert surveys and qualitative interviews but had no pre-test baseline.

**PromptBridge:** Also lacks any assessment mechanism. The principle tracker shows which principles the user has encountered, but doesn't measure whether the user's actual prompting skill has improved.

**Impact:** Without assessment, neither tool can demonstrate learning outcomes. For PromptBridge's target audience (workplace teams, educators), the ability to show measurable improvement could be a significant adoption driver.

**Priority: Medium.** Not critical for v1, but important for the tool's credibility and for understanding what works. Consider a lightweight pre/post: show users a scenario and have them write a prompt before and after completing a learning path, then compare.

### Gap 5: Limited Multi-Turn Conversation Training

**NeuroBridge:** Each interaction is inherently conversational — user writes, character responds, creating a natural back-and-forth that models real communication.

**PromptBridge:** Guided mode is single-turn. Freeform mode allows iteration but doesn't structure multi-turn practice. The Category 5 freeform scenarios are designed for multi-turn practice but are the weakest implementation (no scaffolding, just open-ended "write your own").

**Impact:** Real AI use is predominantly multi-turn. The iterative refinement scenarios (Category 3) teach the concept but don't provide structured practice in actual multi-turn conversation.

**Priority: Medium.** The freeform mode is the right vehicle for this, but it needs more structure — perhaps a guided multi-turn flow where users write → see response → write follow-up → see improved response → get feedback on the entire conversation arc.

### Gap 6: No Participatory Design with Target Users

**NeuroBridge:** Included a 3-person autistic advisory board that reviewed prototypes at elementary, intermediate, and final development stages. Their feedback shaped critical design decisions.

**PromptBridge:** No formal user testing or advisory process has been conducted (based on the codebase and documentation).

**Impact:** NeuroBridge's advisory board directly improved the tool (e.g., the decision to have the character ask clarifying questions rather than assume). Without user feedback, PromptBridge is designing based on assumptions about what beginners find helpful.

**Priority: High for next phase.** Before the next major feature push, conducting even informal user testing with 5-10 people from the target audience (AI beginners) would surface issues that aren't visible from inside the development process.

### Gap 7: No Difficulty Progression

**NeuroBridge:** All scenarios are the same difficulty level (acknowledged limitation).

**PromptBridge:** The four categories create an implicit progression (Category 1: basic specificity → Category 4: advanced strategies), but within each category, scenarios are interchangeable and the tool doesn't enforce or recommend an order.

**Impact:** PromptBridge actually has a slight advantage here — the category structure provides a natural learning path. But it's underutilized because the tool doesn't guide users through it.

**Priority: Low-Medium.** The category structure is good. What's needed is light recommendation ("You've completed 4 scenarios in 'Vague vs. Specific' — ready to try 'Context & Framing'?") rather than a difficulty engine.

### Gap 8: Feedback Can Trigger Defensiveness

**NeuroBridge finding:** A few participants felt defensive when feedback critiqued their communication choices, especially in the bluntness scenario. They described feedback as "instructional" or "attacking how you talk."

**PromptBridge risk:** The guided mode somewhat mitigates this (users pick from pre-written options, so they're not defending their own writing). But freeform mode directly analyzes the user's own prompt, which could trigger the same defensiveness — especially the "improvements" section.

**Impact:** If feedback makes users defensive, they disengage rather than learn. This is a known pedagogical challenge.

**Priority: Medium.** The current freeform feedback prompt already handles this well ("Start with what's GOOD about their prompt"). But the guided mode feedback should also be reviewed: when users pick the weak option, the "what happened" section needs to be especially careful not to sound like "you chose wrong."

---

## 5. Improvement Recommendations

### Tier 1: High Impact, Moderate Effort

#### 1.1 — Add a "Try It Yourself" Step to Guided Mode

After seeing the comparison and feedback, add an optional step where the user **writes their own prompt** for the same scenario, informed by what they just learned. This combines NeuroBridge's "practice what you learned" second round with the self-composition element.

**Implementation sketch:**
- After the feedback panel, add a "Now try writing your own" button
- Opens a freeform-style text area for the same scenario
- Provide lightweight feedback (principle checklist: did they include X, Y, Z?) — this can use the existing freeform analysis infrastructure or a simpler pattern-matching approach for the static tier

**Why this matters:** Transforms guided mode from "identify the right answer" into "practice the right approach." This is the single highest-impact pedagogical improvement based on NeuroBridge's evaluation data.

#### 1.2 — Add a Second Round for Each Guided Scenario

Allow users to replay a scenario after seeing feedback. On the second attempt, the user should recognize the strong option more easily — but more importantly, they'll process the feedback actively rather than passively.

**Implementation sketch:**
- After results, add "Try this scenario again" alongside "Next Scenario"
- On round 2, optionally generate new option text (different wording, same quality levels) to prevent memorization
- Track whether the user improved their selection on round 2

**Why this matters:** NeuroBridge's two-round structure was not accidental — it's standard practice in skill-based training. One exposure teaches recognition; repetition builds habit.

#### 1.3 — Conduct Informal User Testing

Recruit 5-10 people from the target audience (AI beginners, workplace team members, students) and have them complete 3-5 scenarios while thinking aloud. Record observations.

**What to look for:**
- Where do users hesitate or get confused?
- Is the feedback clear and motivating, or does it feel like grading?
- Do users understand the side-by-side comparison immediately?
- Do they try the "Copy & Try" workflow? Does it work for them?
- What do they wish the tool did differently?

**Why this matters:** NeuroBridge's participatory design directly shaped its most effective features. Even a small round of testing will reveal issues invisible to the developers.

### Tier 2: Medium Impact, Lower Effort

#### 2.1 — Add Lightweight Pre/Post Assessment

At the start of a learning session, show the user 2-3 scenarios and have them write a prompt (no feedback). At the end, show 2-3 different scenarios and have them write again. Compare the prompts (word count, specificity markers, principle coverage) to demonstrate growth.

**Implementation sketch:**
- "Assessment mode" — shows scenario, user writes prompt, app scores it against principle checklist
- Before: no feedback shown. After: show comparison of before/after scores
- Can be done entirely client-side with heuristic scoring (no LLM needed)

**Why this matters:** NeuroBridge acknowledged the lack of pre/post assessment as their biggest measurement limitation. PromptBridge could leapfrog by including even a simple version.

#### 2.2 — Add Guided Progression Recommendations

After completing a scenario, suggest what to do next based on which principles the user has and hasn't practiced. This isn't gamification — it's wayfinding.

**Implementation sketch:**
- Use the existing principle tracker data
- After scenario completion: "You've practiced 'Be specific' and 'Provide context' — try 'The vague rejection' next to practice 'Give specific feedback'"
- On the scenario selector, highlight recommended next scenarios

**Why this matters:** The category/principle structure already exists but is underutilized. Users currently face a wall of 30 scenarios with no guidance on what to try next.

#### 2.3 — Personalize Scenarios with User Context (Freeform Mode)

In freeform mode, ask users a brief setup question: "What do you use AI tools for?" (work emails, coding, school, personal tasks). Use this to surface the most relevant scenarios first and to personalize the feedback.

**Implementation sketch:**
- Add an optional "What brings you here?" prompt on first visit
- Store preference in localStorage
- Filter/sort scenario selector to show most relevant scenarios first
- Pass user context to the freeform analysis prompt for more relevant feedback

**Why this matters:** NeuroBridge's personalization was one of its most valued features. Even minimal personalization ("I see you're writing for work — here's how to apply this principle to professional emails") increases relevance.

#### 2.4 — Review Feedback for Defensiveness Risk

Audit all 30 generated feedback files (the JSON in `app/src/data/generated/`) with specific attention to the "user picks weak" feedback variants. Ensure they consistently:
- Lead with acknowledgment ("lots of people ask it this way")
- Frame the comparison as "here's what happens when..." not "here's what you did wrong"
- Use collaborative language ("next time, try..." not "you should have...")

**Why this matters:** NeuroBridge specifically found that even well-intentioned feedback triggered defensiveness in some participants. PromptBridge's static feedback should be bulletproof on this.

### Tier 3: Aspirational / Future Phases

#### 3.1 — Hybrid Guided Mode (User Writes First, Then Evaluates)

Redesign guided mode to mirror NeuroBridge's interaction model more closely:
1. User reads scenario and **writes their own prompt first**
2. System generates 3 variations of the user's prompt (weak/medium/strong rewrites)
3. User evaluates which version is strongest
4. Side-by-side comparison of their original vs. the strongest version
5. Feedback explaining the differences

This is more complex than the current approach (requires real-time LLM calls, can't use pre-generated content) but would be significantly more effective as a learning tool. It could be gated behind the API-key tiers.

#### 3.2 — Structured Multi-Turn Practice Mode

Build a guided multi-turn interaction flow:
1. User writes initial prompt → sees simulated response
2. System identifies what's weak about the response (too generic? wrong format? missing details?)
3. User writes a follow-up to improve the response
4. System shows improved response
5. Feedback covers the entire conversation arc: initial prompt quality, follow-up quality, and the principle of iterative refinement

This addresses the gap in Category 3 (Iterative Refinement) and Category 5 (Full Conversation Loop) scenarios.

#### 3.3 — Collaborative Scenario Contribution Pipeline

Build a system for community-contributed scenarios. NeuroBridge was limited to 4 scenarios designed by the research team. PromptBridge already has 33 but could grow significantly with community contributions, especially from specific domains (healthcare prompting, legal prompting, education prompting, etc.).

#### 3.4 — Accessibility Audit

NeuroBridge was presented at ASSETS, an accessibility conference. PromptBridge should be held to high accessibility standards:
- Screen reader compatibility
- Keyboard navigation for all interactions
- Color contrast compliance
- Reduced motion support
- Clear focus indicators

---

## 6. References

### Primary NeuroBridge Paper
Haroon, R., Wigdor, K., Yang, K., Toumanios, N., Crehan, E.T., & Dogar, F. (2025). "NeuroBridge: Using Generative AI to Bridge Cross-neurotype Communication Differences through Neurotypical Perspective-taking." In *Proceedings of the 27th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS '25)*, Denver, Colorado. ACM. DOI: 10.1145/3663547.3746337. **Best Student Paper Award.**
- ACM: https://dl.acm.org/doi/10.1145/3663547.3746337
- arXiv: https://arxiv.org/abs/2509.23434

### Related Prior Work (Same Research Group)
Haroon, R. & Dogar, F. (2024). "TwIPS: A Large Language Model Powered Texting Application to Simplify Conversational Nuances for Autistic Users." In *Proceedings of the 26th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS '24)*, St. John's, Canada. ACM. DOI: 10.1145/3663548.3675633.
- arXiv: https://arxiv.org/abs/2407.17760

### Upcoming Work
Haroon, R., Haroon, H., Kritzer, W., & Dogar, F. (under submission, 2026). "Investigating Normative Bias in AI-mediated Cross-neurotype Communication."

### Press Coverage
- Tufts Now: "Showing Neurotypicals How Autistic Communication Works" (2025-12-05)
  https://now.tufts.edu/2025/12/05/helping-neurotypicals-understand-autistic-communication
- Futurity: "AI tool helps neurotypicals better communicate with people with autism"
  https://www.futurity.org/autism-communication-ai-tool-3317932/
- News-Medical.net: "New AI learning tool bridges communication gaps" (2026-01-20)
  https://www.news-medical.net/news/20260120/New-AI-learning-tool-bridges-communication-gaps-between-autistic-and-neurotypical-people.aspx

### Theoretical Foundations Referenced
- Milton, D. (2012). "On the ontological status of autism: the 'double empathy problem'." *Disability & Society*, 27(6), 883-887.
- Grice, H.P. (1975). "Logic and Conversation." In *Syntax and Semantics*, Vol. 3, Speech Acts, pp. 41-58.

### Author Information
- Rukhshan Haroon — PhD candidate, Computer Science, Tufts University: https://rukhshan23.github.io/
- Fahad Dogar — Associate Professor, Computer Science and Tisch College, Tufts University (senior author/advisor)

---

## Appendix: Technical Notes on NeuroBridge's Architecture

For reference, NeuroBridge's technical stack:
- **Frontend:** React with shadcn/ui
- **Backend:** FastAPI with REST/WebSockets
- **Primary LLM:** GPT-4o (Azure deployment)
- **Alternative LLM:** Claude 3.5 Sonnet (used for emoji scenarios)
- **Storage:** MongoDB Atlas
- **Deployment:** Cloudflare Pages (frontend), Google Cloud Run (backend)
- **Prompting strategy:** Few-shot examples rather than "act autistic" instructions, to avoid perpetuating LLM biases. All prompts publicly available.

Interestingly, NeuroBridge uses the same frontend framework (React) and UI library (shadcn/ui) that PromptBridge's artifact phase used, and the same backend framework (FastAPI) planned for PromptBridge's Phase B.
