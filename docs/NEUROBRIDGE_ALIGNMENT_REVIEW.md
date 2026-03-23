# NeuroBridge Alignment Review — Architectural Gap Analysis & Recommendations

*Research conducted: 2026-03-23*

---

## Executive Summary

This document maps every significant NeuroBridge design decision to its PromptBridge equivalent, identifies gaps, and proposes prioritized improvements. The analysis is based on the full NeuroBridge paper (Haroon et al., ASSETS 2025, Best Student Paper), supplementary coverage, and a complete read of the PromptBridge codebase.

**Key finding:** PromptBridge already exceeds NeuroBridge in several dimensions — broader scenario coverage, pre/post assessment, and a copy-to-real-AI workflow. The most impactful remaining gaps center on **how the learning loop closes** — specifically, how feedback connects user choices to consequences, and how users practice applying what they just learned.

> **Note (2026-03-23):** After this analysis was written, the architecture was pivoted to fully static — all API-powered features (Write First/Hybrid, Multi-Turn, API-powered analysis) were removed from the public web app. These features are available only when running the repo locally. References to HybridMode, MultiTurnMode, and API-powered features below reflect the architecture at the time of analysis. The recommendations about Guided Mode improvements (R1-R4, R6-R8) remain fully applicable.

---

## 1. NeuroBridge Architecture (Summary for Comparison)

### Per-Scenario Interaction Flow

```
Registration → Personalization
         ↓
   User composes free-form message
         ↓
   Message Options Generator → 3 "semantically similar, pragmatically different" variants
         ↓
   User selects one option
         ↓
   Response Generator → AI character responds authentically
   (If ambiguous: character asks clarifying questions)
         ↓
   Feedback Generator → Immediate structured feedback panel
   (If suboptimal: suggests empathic follow-up message)
         ↓
   User can send follow-up → loop repeats
```

**Key:** Users complete 2 rounds × 4 scenarios = 8 total interactions (~60 min).

### The Four LLM Components

| Component | Function |
|-----------|----------|
| Scenario Generator | Personalizes scenarios using user-provided name, pronouns, topic of interest |
| Message Options Generator | Transforms user's raw message into 3 quality-varied rephrases |
| Response Generator | Produces AI character's reply based on selected option |
| Feedback Generator | Delivers structured constructive or positive feedback |

### Technical Stack

React + shadcn/ui frontend, FastAPI backend, GPT-4o primary LLM (Claude 3.5 Sonnet for emoji scenarios), MongoDB Atlas, Cloudflare Pages + Google Cloud Run.

---

## 2. Architectural Comparison Table

### 2.1 Per-Scenario Interaction Flow

| NeuroBridge Feature | How NeuroBridge Does It | How PromptBridge Does It | Gap / Opportunity |
|---|---|---|---|
| **User composes first** | User writes a free-form message as Step 1 of every scenario | **Guided:** User sees pre-generated options — no composition step. **Freeform:** User composes first. **Hybrid (Write First):** User composes first, then sees AI-generated variations. | **Guided mode skips composition.** This is the most-used mode but the one with the weakest self-reflective element. Hybrid mode exactly mirrors NeuroBridge's pattern but requires an API key. |
| **Options from user input** | LLM transforms the user's own message into 3 pragmatically different variants | **Guided:** Options are pre-generated from scenario, not from user input. **Hybrid:** LLM generates weak/medium/strong variations of the user's actual prompt. | **Hybrid mode already implements this.** The gap is that Guided (the primary mode) uses static options unrelated to the user's thinking. |
| **User selects one option** | User picks which of 3 to send; quality labels hidden; order unlabeled | **Guided:** User explores all 3 tiers via accordion (quality labels visible: "Weak / Getting There / Effective"). No selection required. **Hybrid:** User picks from 3 shuffled, unlabeled options. | **Guided reveals quality labels upfront**, removing the judgment/discovery moment. Hybrid mode is closer — options are shuffled and unlabeled. NeuroBridge's approach forces a genuine prediction ("which will work best?") that Guided's labeled accordion does not. |
| **Character responds authentically** | AI character processes the selected message and responds in-character (direct, literal style). If ambiguous, character asks clarifying questions. | **Guided:** Pre-generated responses shown for all 3 tiers. No character — just simulated "AI responses." **Freeform/Hybrid:** LLM generates simulated weak/strong responses. | **No persistent character.** NeuroBridge's character creates emotional investment and narrative continuity. PromptBridge's responses are functional but impersonal — "What the AI gives back" vs. a character who reacts. The clarification-question pattern (NeuroBridge's advisory board recommendation) has no equivalent. |
| **Structured feedback** | Immediate panel: interpretation gap + best option + reasoning + suggested follow-up | **Guided:** "What happened here" panel with `what_happened` + `principle_name` + `principle` + `tip`. **Freeform:** `strengths` + `improvements` + `improved_prompt` + `tip`. | **Similar structure, different framing.** NeuroBridge's feedback explicitly names the interpretation gap ("you meant X, the character heard Y"). PromptBridge's feedback explains the principle but doesn't dramatize the gap as vividly. See Section 2.4. |
| **Second round** | User replays each scenario a second time, applying lessons from round 1 | **Guided:** One-shot. "Next Scenario" advances to a new scenario. "Try Again" in Try It Yourself resets the writing area. **Multi-Turn:** Iterates within a conversation (different purpose). | **No structured second attempt.** The "Now Write Your Own" step partially addresses this by letting users practice after seeing the comparison, but it's optional and disconnected from the original scenario interaction. |
| **Session continuity** | 2 rounds × 4 scenarios in a single ~60-min session | Users self-direct through a scenario selector with no session structure | **No session structure.** Users can bounce between scenarios without completing a coherent learning arc. This is a deliberate design choice (flexibility), but NeuroBridge found that the structured progression drove engagement. |

### 2.2 How User Input Is Used vs. Pre-Generated Content

| NeuroBridge Feature | How NeuroBridge Does It | How PromptBridge Does It | Gap / Opportunity |
|---|---|---|---|
| **User-composed input as foundation** | Every scenario starts from the user's own words. The options are transformations of their message. | **Guided:** 100% pre-generated. User input only enters at the optional "Try It Yourself" step. **Freeform:** 100% user-composed. **Hybrid:** User writes first, then sees AI-generated variations. | **Guided mode is the primary entry point but has zero user input in the core learning loop.** The "Try It Yourself" step is a good addition but comes after the learning moment, not during it. |
| **Personalization from registration** | Name, pronouns, topic of interest → scenarios reference user's stated interests | ScenarioSelector has a "What do you use AI for?" onboarding banner with 5 context pills. Selection sorts scenarios by relevance tags and is passed to freeform analysis prompts. | **PromptBridge has the infrastructure** (userContext, relevance tags, sorted scenarios) but personalization is shallow — it reorders a list rather than customizing scenario content. NeuroBridge weaves the user's actual topic into the scenario narrative. |
| **Self-reflective discovery** | User sees their own words refracted into variants → "I said that, but it could be read as this" | **Guided:** User evaluates someone else's prompts. **Hybrid:** User sees their own prompt refracted into variants (directly mirrors NeuroBridge). | **Hybrid mode achieves this.** But it's gated behind an API key, limiting the primary audience (beginners without keys). |

### 2.3 Option/Variation Generation and Presentation

| NeuroBridge Feature | How NeuroBridge Does It | How PromptBridge Does It | Gap / Opportunity |
|---|---|---|---|
| **3 options from user input** | Message Options Generator uses few-shot prompting to create 3 "semantically similar but pragmatically different" variants. Dimensions vary by scenario (directness, figurativeness, emoji context, bluntness). | **Guided:** `OPTION_GENERATOR_SYSTEM` prompt creates weak/medium/strong variations. Options are scenario-specific, pre-generated, and stored as JSON. **Hybrid:** `VARIATION_GENERATOR_SYSTEM` transforms the user's prompt into weak/medium/strong versions. | PromptBridge's options vary on a **quality spectrum** (vague→specific). NeuroBridge's options vary on **pragmatic dimensions** (direct→indirect, literal→figurative). These are different pedagogical strategies — PromptBridge teaches "better prompting," NeuroBridge teaches "different interpretations of the same intent." |
| **Quality labels hidden** | Options presented as A/B/C with no quality indicators. User must judge quality themselves. | **Guided:** Quality labels visible ("Weak / Getting There / Effective") with color coding (rose/amber/emerald). **Hybrid:** Options labeled A/B/C, shuffled, no quality indicators. | **Guided mode reveals the answer before the user judges.** This makes it a compare-and-learn tool rather than a predict-and-discover tool. The pedagogical trade-off: lower friction (no wrong answers) but weaker cognitive engagement (no prediction error). |
| **"2 of 3 genuinely cause misunderstanding"** | Advisory board validated that exactly 2 options would lead to miscommunication. The "correct" answer is the one that avoids misunderstanding. | **Guided:** The strong option is "correct" in the sense that it produces the best AI response. Weak/medium options produce demonstrably worse results. | **Functionally equivalent.** Both systems have a clear best answer. The difference is framing: NeuroBridge frames options as "which will be understood correctly?" while PromptBridge frames them as "which will get the best result?" |
| **Prompt engineering approach** | Few-shot learning with hand-crafted examples for each scenario type. Autism never referenced in prompts. Examples implicitly guide behavior. | Few-shot not explicitly used in prompts. Prompts use detailed instruction sets. `feedbackNotes` field per scenario provides guidance to the LLM. | NeuroBridge's few-shot approach produced more consistent outputs per their testing. PromptBridge's instruction-based approach is more flexible but potentially less reliable for nuanced scenarios. |

### 2.4 How AI Responses Demonstrate Consequences

| NeuroBridge Feature | How NeuroBridge Does It | How PromptBridge Does It | Gap / Opportunity |
|---|---|---|---|
| **Authentic character response** | AI character responds to the selected option in-character. If the message is ambiguous, the character asks "Do you mean X or Y?" rather than assuming. This creates the "aha moment." | **Guided:** Pre-generated responses for all 3 tiers shown simultaneously in accordion. **Freeform:** LLM generates responses to the user's prompt and its improved version. **Multi-Turn:** LLM generates mediocre initial response, then improved response after follow-up. | **No single "moment of truth."** NeuroBridge shows one response to one choice — creating a focused cause-and-effect. PromptBridge shows all responses at once, which is informationally richer but emotionally flatter. The accordion design somewhat addresses this (expand one at a time). |
| **Clarification-question pattern** | When the selected message is ambiguous, the character says "Do you mean X or Y?" instead of guessing. This was recommended by the autistic advisory board. | **No equivalent.** AI responses are always direct answers — they don't model the "pause and clarify" behavior that would make the interpretation gap visible. | **High-impact gap.** A simulated AI that says "I'm not sure what you mean — are you asking about X or Y?" would powerfully demonstrate why vague prompts fail. This would require generated (not static) responses, or pre-generated clarification responses for each weak option. |
| **Emotional resonance of consequences** | Participants felt the character's response was "the closest to real interaction with an autistic person." The character's confusion/literal interpretation creates cognitive dissonance. | Simulated responses are functional demonstrations — they show what kind of answer each prompt produces. No character, no emotional register. | **Lower emotional engagement.** PromptBridge's approach is more efficient (see all options fast) but less memorable. NeuroBridge's qualitative data showed that the character's authentic response was the primary driver of insight. |

### 2.5 Feedback Structure, Tone, and Connection to Principles

| NeuroBridge Feature | How NeuroBridge Does It | How PromptBridge Does It | Gap / Opportunity |
|---|---|---|---|
| **Interpretation gap** | Feedback explicitly names the gap: "You meant X, but the character heard Y because of Z." | **Guided:** `what_happened` field explains the cause-and-effect but doesn't personalize it as "you meant / they heard." **Freeform:** `strengths` + `improvements` framing. | **Gap naming is less vivid.** PromptBridge's feedback explains what happened generically; NeuroBridge's feedback dramatizes the specific misalignment between intent and interpretation. |
| **Constructive vs. positive feedback** | Two modes: constructive (when user chose suboptimally — gap + best option + why + follow-up) and positive (when user chose optimally — reinforcement + explains why others fail). | **Guided:** Single feedback structure regardless of user behavior (since user doesn't "choose" in the accordion model). **Freeform/Hybrid:** Feedback adapts to the user's actual prompt quality. | **Guided mode can't differentiate** because there's no selection event. The feedback is always the same regardless of which tier the user expanded. Freeform and Hybrid modes do adapt. |
| **Even-when-right learning** | When user picks the best option, feedback still explains why the other two would fail. | **Guided:** Feedback always shown; accordion lets users explore all tiers. **Freeform:** Always shows improvements even for good prompts. | **Equivalent.** Both systems ensure learning happens regardless of performance level. |
| **Defensiveness mitigation** | System prompts include specific anti-defensiveness language. NeuroBridge still saw defensiveness in the bluntness scenario. | `FEEDBACK_GENERATOR_SYSTEM` includes detailed anti-defensiveness instructions: normalize first ("This is how most people would phrase it"), never say "your prompt was too vague," use collaborative language. | **PromptBridge's defensiveness mitigation is more thorough in the prompt design.** The system prompt has detailed instructions that NeuroBridge lacked. However, the static guided feedback hasn't been systematically audited for defensiveness. |
| **Suggested follow-up** | When constructive feedback is given, the system provides a suggested empathic follow-up the user can send. | **Freeform:** Provides an `improved_prompt` the user can copy and try. **Guided:** `tip` field provides advice but no ready-to-use improved prompt. | **Guided mode's tip is abstract** ("Before asking for help, spend 10 seconds listing the key facts"). NeuroBridge's suggested follow-up is a concrete, ready-to-send message. Freeform mode's `improved_prompt` is closer. |

### 2.6 Assessment Methodology

| NeuroBridge Feature | How NeuroBridge Does It | How PromptBridge Does It | Gap / Opportunity |
|---|---|---|---|
| **Post-study survey** | 11-item Likert scale (7-point) measuring attitudinal shifts. No pre-test baseline. | **Pre/post assessment mode:** 3 scenarios each (different scenarios pre vs. post), heuristic scoring against principles, aggregate score, per-scenario breakdown, before/after comparison. | **PromptBridge surpasses NeuroBridge here.** The pre/post assessment with different scenario sets to prevent memorization, heuristic principle-detection scoring, and before/after visualization is more rigorous than NeuroBridge's post-only Likert survey. |
| **Qualitative interviews** | Semi-structured interviews + think-aloud protocol during interaction. Screen/audio recorded. | No qualitative research component (expected — PromptBridge is a product, not a study). | N/A — different contexts. |
| **Behavioral measurement** | No objective behavioral measurement (acknowledged as limitation). | Heuristic scorer checks for principle markers (word count, context markers, intent markers, etc.). Limited to regex-level detection. | Both tools lack robust behavioral measurement. PromptBridge's heuristic scorer is a lightweight proxy. |

### 2.7 Progression and Scaffolding

| NeuroBridge Feature | How NeuroBridge Does It | How PromptBridge Does It | Gap / Opportunity |
|---|---|---|---|
| **Scenario sequencing** | 4 scenarios × 2 rounds, presented sequentially in a structured session. All scenarios are the same difficulty (acknowledged limitation). | 45 scenarios across 5 categories with implicit progression (Category 1: basic → Category 5: full conversation). Recommendation engine suggests next scenarios based on unpracticed principles. | **PromptBridge has significantly better scaffolding.** The category structure, principle coverage tracking, and recommendation engine provide progressive difficulty that NeuroBridge explicitly lacked. |
| **Principle coverage tracking** | None — scenarios are organized by communication challenge type, not by skills learned. | `practicedPrinciples` array tracks which of 8 principles have been encountered. Progress page shows practiced vs. unpracticed. Recommendations prioritize scenarios teaching unpracticed principles. | **PromptBridge advantage.** NeuroBridge has no equivalent skill tracking. |
| **Recommended next steps** | None. | `getRecommendedScenarios()` recommends the next scenario based on unpracticed principles. Shown inline after completing a scenario and in the scenario selector. | **PromptBridge advantage.** |

### 2.8 The Role of User Reflection in the Learning Loop

| NeuroBridge Feature | How NeuroBridge Does It | How PromptBridge Does It | Gap / Opportunity |
|---|---|---|---|
| **Forced prediction** | User must select one option before seeing any response. This forces a prediction: "I think this one will work best." The response then confirms or challenges that prediction. | **Guided:** No prediction required — user explores all options via accordion. **Hybrid:** User selects one option (matches NeuroBridge). | **Guided mode skips the prediction step.** Prediction errors are one of the strongest drivers of learning (prediction error theory). When users can see all answers without committing, engagement is lower. |
| **Cognitive dissonance** | The gap between "what I intended" and "how it was interpreted" creates the "aha moment." Participants said interpretations were "obvious in hindsight, but never occurred to them." | **Guided:** Side-by-side comparison shows what different prompts produce, but the user's own intent isn't in the loop. **Freeform/Hybrid:** User's own prompt is compared to an improved version + responses, creating a personal gap. | **Guided mode creates dissonance about prompts in general, not about the user's own communication.** The learning is more abstract ("look how different these are") vs. personal ("I said X and it came out as Y"). |
| **Second-round application** | Round 2 of each scenario lets users apply what they learned. The act of choosing differently demonstrates internalized learning. | **"Now Write Your Own" step** lets users practice after guided comparison. **Multi-Turn:** Follow-up step lets users refine their approach. | **Partial coverage.** The "Now Write Your Own" step is the right idea but is optional and positioned after the main learning interaction rather than as a required follow-through. |
| **Active vs. passive learning** | NeuroBridge rated 6.92/7 for interactive format. Users described it as more valuable than blogs/videos. | PromptBridge's Guided mode is more passive (explore accordion) than NeuroBridge's select-and-see loop. Freeform and Hybrid modes are fully active. | **Guided mode is the most passive of PromptBridge's modes** but also the most accessible (no API key needed). There's a tension between accessibility and pedagogical depth. |

---

## 3. What PromptBridge Does That NeuroBridge Doesn't

For completeness, several dimensions where PromptBridge already exceeds NeuroBridge:

| Feature | PromptBridge | NeuroBridge |
|---|---|---|
| **Scenario breadth** | 45 scenarios across 5 categories | 4 scenarios across 4 types |
| **Multi-turn practice** | Dedicated MultiTurnMode with structured write → review → refine → feedback flow | Single-turn with optional follow-up |
| **Pre/post assessment** | Formal assessment with different pre/post scenarios, heuristic scoring, before/after comparison | Post-only Likert survey |
| **Three-tier architecture** | Static content (no API), free Gemini tier, BYOK (Claude/OpenAI/Gemini) | Requires API access for all features |
| **Heuristic fallback** | Client-side regex scoring when no API key is available | No offline/fallback mode |
| **Principle tracking** | 8 named principles with per-scenario tagging, progress tracking, recommendations | Implicit learning goals, no tracking |
| **User context personalization** | Context pills ("What do you use AI for?"), relevance tags, scenario sorting | Registration-based personalization |
| **Multiple learning modes** | Guided, Freeform, Hybrid (Write First), Multi-Turn, Assessment | Single mode |
| **Copy-and-try workflow** | Users can copy prompts and test them in real AI tools | Closed system |
| **Multi-provider LLM support** | Gemini, Claude, OpenAI via provider router | GPT-4o + Claude 3.5 Sonnet |

---

## 4. Prioritized Recommendations

### Priority 1: High Impact, Low-Medium Effort — Ship Before Friday 2026-03-27

#### R1. Add a Prediction Step to Guided Mode
**Change:** Before showing the accordion with all three tiers, show the three prompt texts (unlabeled, shuffled) and ask: "Which of these do you think would get the best result?" After the user picks, expand all tiers with the selected one highlighted.

**NeuroBridge finding:** Forced prediction is the core pedagogical mechanism. Users "repeatedly re-read message options and carefully reasoned through them." The prediction error when their choice doesn't match the best option drives learning.

**Implementation complexity:** Small. The data already exists (options in JSON with quality labels). Add a `predict` step before `explore` that shows shuffled options as clickable cards. Store the prediction, then show the accordion with a "You picked: [Weak/Strong]" badge. No API calls needed.

**Requires API:** No — works with static content.

---

#### R2. Make "Now Write Your Own" More Prominent and Structured
**Change:** After the guided comparison, instead of buttons at the bottom, show a clear call-to-action panel: "You've seen the difference. Now try writing a prompt for this scenario yourself." Include the scenario's target principles as checklist items. After submission, show the heuristic score (no API) or full analysis (with API).

**NeuroBridge finding:** The second round in each scenario was critical for consolidation. "One exposure teaches recognition; repetition builds habit."

**Implementation complexity:** Small. The "Try It Yourself" step already exists in GuidedMode (lines 224-284). The change is UX emphasis: make it feel like the expected next step rather than an optional tangent. Move the "Next Scenario" button to after the Try It Yourself results, not before.

**Requires API:** No — heuristic scorer works without API.

---

#### R3. Add Clarification-Question Responses to Weak Prompts
**Change:** For the weakest prompt tier in guided scenarios, add a `clarification_response` field to the pre-generated JSON that shows the AI asking "I'm not sure what you mean — are you asking about X or Y?" This models the interpretation gap more vividly than a generic response.

**NeuroBridge finding:** The clarification-question pattern was the #1 recommendation from the autistic advisory board. It made the interpretation gap visible without the character simply giving a bad answer.

**Implementation complexity:** Small-Medium. Requires updating the 30 pre-generated JSON files to include a `clarification_response` for the weak option, and a minor UI change to show it. Can be done incrementally — start with the first 5 scenarios and expand.

**Requires API:** No — static content update.

---

#### R4. Reframe Guided Feedback to Name the Gap Explicitly
**Change:** Update the `what_happened` text in each guided scenario's JSON to use the NeuroBridge pattern: explicitly state what the user would have intended vs. what the AI interpreted. Change from "Notice how the three responses escalate dramatically" to "The weak prompt asks 'Do you know about snow shoveling?' — you meant 'teach me efficient techniques,' but the AI heard a yes/no question and answered literally."

**NeuroBridge finding:** Feedback that explicitly names the intent-vs-interpretation gap was described as "constructive, logical, and non-judgmental." The logical chain from word choice → interpretation built trust.

**Implementation complexity:** Small. Text-only update to 30 JSON files. No code changes.

**Requires API:** No — static content update.

---

### Priority 2: High Impact, Medium Effort

#### R5. Promote Hybrid Mode as the Primary API-Powered Experience
**Change:** When a user has an API key, make Hybrid ("Write First") mode the default tab in ScenarioSelector rather than Guided. Hybrid mode already mirrors NeuroBridge's compose → reframe → select → compare flow. It's the strongest pedagogical mode but currently hidden behind a third tab.

**NeuroBridge finding:** The compose-first, reframe-into-options pattern was the core innovation. User input as foundation > pre-generated content for learning.

**Implementation complexity:** Small. Change the default `activeTab` in ScenarioSelector from `"guided"` to `hasApiKey() ? "hybrid" : "guided"`.

**Requires API:** N/A — it's a routing change that respects API availability.

---

#### R6. Add a "What the AI Heard" Panel to Guided Mode
**Change:** For each prompt tier, add a brief "What the AI heard" interpretation below the prompt text (before the response). For the weak prompt: "The AI interpreted this as: a yes/no question about whether it has knowledge of snow shoveling." For the strong prompt: "The AI interpreted this as: a request for a time-boxed action plan with injury prevention."

**NeuroBridge finding:** The interpretation gap — seeing how the same intent gets read differently — was the primary driver of insight. Participants said the interpretations were "obvious in hindsight, but never occurred to them."

**Implementation complexity:** Medium. Requires adding an `interpretation` field to each option in the 30 JSON files and a small UI addition in GuidedMode's accordion.

**Requires API:** No — static content.

---

#### R7. Add a Lightweight Guided Session Flow
**Change:** Add an optional "Learning Path" mode: a curated sequence of 4-6 scenarios that covers all principle categories, with brief transitions between them ("You've practiced being specific. Next, let's see what happens when you add context..."). Similar to NeuroBridge's structured 8-interaction session.

**NeuroBridge finding:** The structured session drove engagement. Participants completed all 8 interactions in a single sitting because the flow was linear and progressive.

**Implementation complexity:** Medium. Requires a new component that sequences through a curated scenario list, wrapping the existing GuidedMode/HybridMode. No new learning mechanics needed.

**Requires API:** No — can use guided scenarios.

---

#### R8. Add "Explain Why the Others Fail" to Positive Feedback
**Change:** When showing the guided comparison, after the strong option's response, add a brief note explaining *why* the weak and medium prompts produced worse results — even for users who naturally gravitated to the strong option.

**NeuroBridge finding:** Positive feedback (when the user chose correctly) still explained why the other two options would cause misunderstanding. This ensured learning even when the user "got it right."

**Implementation complexity:** Small-Medium. Add a `why_others_fail` field to the feedback section of each JSON file. Show it in a collapsible panel below the existing feedback.

**Requires API:** No — static content.

---

### Priority 3: Medium Impact, Medium-High Effort

#### R9. Add an AI Character / Persona to Responses
**Change:** Instead of generic "What the AI gives back" framing, give the AI respondent a lightweight persona (e.g., "Alex, a helpful AI assistant") that responds consistently across scenarios. For weak prompts, have Alex ask clarifying questions or express confusion. For strong prompts, have Alex respond enthusiastically and specifically.

**NeuroBridge finding:** The AI character created emotional investment and narrative continuity. Users rated character responses as "natural/realistic" (5.50/7) and described the experience as "closest to real interaction."

**Implementation complexity:** Medium-High. Requires updating all pre-generated responses (30 JSON files) and the response simulator prompt to maintain character voice. Also requires ensuring character consistency across API-powered modes.

**Requires API:** No for static content; yes for dynamic modes.

**Risk:** NeuroBridge's single character was criticized for potentially representing all autistic people stereotypically. An AI assistant character doesn't carry this risk.

---

#### R10. Add Per-Scenario Difficulty Progression
**Change:** Within each category, tag scenarios with difficulty (intro/intermediate/advanced) and recommend an order. Show "Start here" for the first scenario in each category.

**NeuroBridge finding:** NeuroBridge lacked difficulty progression (acknowledged limitation). Users completed scenarios in a fixed order. PromptBridge can do better.

**Implementation complexity:** Medium. Requires adding `difficulty` to scenario data, updating the recommendation engine, and adjusting ScenarioSelector UI.

**Requires API:** No.

---

#### R11. Structured Multi-Turn in Guided Mode (No API)
**Change:** Create pre-generated multi-turn scenarios for the 7 `multiTurnEligible` guided scenarios. Each would include: an initial prompt (user-provided context), a pre-generated mediocre response, hints about what's missing, a pre-generated follow-up prompt, and a pre-generated improved response. This brings multi-turn practice to the static tier.

**NeuroBridge finding:** NeuroBridge's conversation flow included follow-up turns. PromptBridge's MultiTurnMode is excellent but requires an API key.

**Implementation complexity:** Medium-High. Requires generating and curating static multi-turn content for 7 scenarios and a new UI flow. Significant content effort.

**Requires API:** No — the whole point is enabling multi-turn without an API.

---

### Priority 4: Aspirational / Future Phases

#### R12. Full NeuroBridge Mirror Mode (API-Powered)
**Change:** New mode that exactly replicates NeuroBridge's flow: user writes → system generates 3 pragmatically varied options from their input → user picks one → system shows how a simulated AI would respond to that specific option → system provides structured feedback on the choice.

**How it differs from Hybrid:** Hybrid shows all responses after selection. Mirror mode would show only the response to the selected option, creating a focused cause-and-effect moment.

**Implementation complexity:** Large. Requires new prompts (pragmatic variation rather than quality variation), a new response-per-selection model, and a new feedback generator.

**Requires API:** Yes.

---

#### R13. Community-Contributed Scenarios with Validation
**Change:** Build a pipeline for community-contributed scenarios. NeuroBridge was limited to 4 researcher-designed scenarios; PromptBridge already has 45 but could grow with domain-specific contributions (healthcare, legal, education).

**Implementation complexity:** Large. Requires a contribution format, validation process, and potentially a backend.

---

#### R14. Longitudinal Learning Tracking
**Change:** Track learning over time — not just scenarios completed, but how prompt quality improves across sessions. Show trends, not snapshots.

**NeuroBridge finding:** No longitudinal data was collected (acknowledged as their biggest limitation). PromptBridge's localStorage-based progress tracking could evolve into genuine longitudinal measurement.

**Implementation complexity:** Large. Requires persistent storage beyond localStorage and analytics infrastructure.

---

## 5. Quick-Win Summary: Before Friday 2026-03-27

| # | Change | Effort | API Required | Impact |
|---|--------|--------|--------------|--------|
| R1 | Prediction step in Guided mode | Small | No | High — activates prediction-error learning |
| R2 | Make "Now Write Your Own" the expected next step | Small | No | High — closes the practice loop |
| R4 | Reframe feedback to name the intent/interpretation gap | Small | No | Medium — makes feedback more vivid |
| R5 | Default to Hybrid mode when API key exists | Small | N/A | Medium — promotes strongest learning mode |

These four changes require no new API calls, minimal code changes, and address the biggest pedagogical gaps identified in this analysis.

---

## 6. Design Principles Derived from NeuroBridge

For reference when implementing any of the above, these are the core design principles validated by NeuroBridge's research:

1. **Compose before comparing.** Learning is deepest when users evaluate transformations of their own input, not pre-written options.
2. **Force predictions.** Making users commit to a choice before seeing consequences activates prediction-error learning.
3. **Name the gap, don't lecture.** "You meant X, the AI heard Y" is more powerful than "the principle is Z."
4. **Clarification > bad answer.** An AI that says "I'm not sure what you mean" teaches more than an AI that gives a generic answer.
5. **Second rounds build habits.** One exposure teaches recognition; a second attempt with feedback builds skill.
6. **Normalize, then explain.** "Most people would phrase it this way — and here's what happens" avoids defensiveness.
7. **Personalization drives engagement.** Users value scenarios connected to their own interests (6.58/7).
8. **Show, don't tell.** Active practice over passive consumption (6.92/7).

---

## Appendix A: NeuroBridge Study Details

- **Participants:** N=12 neurotypical adults (ages 18-34), Tufts University recruitment
- **Protocol:** 2 familiarization messages + 2 rounds × 4 scenarios = 8 interactions, ~60 minutes
- **Models:** GPT-4o (gpt-4o-2024-0513) primary; Claude 3.5 Sonnet for emoji scenario
- **Advisory board:** 3 autistic graduate/undergraduate students, 3 one-hour meetings
- **Key survey results:**
  - Interactive format valued: 6.92/7
  - Personalization valued: 6.58/7
  - Preference over blogs/videos: 5.92/7
  - Character responses felt natural: 5.50/7
  - Autism = social difference: 6.42/7
  - Confusion during simulation: 3.42/7 (some confusion present)
- **Limitations noted by researchers:** Small sample, university-only recruitment, no longitudinal follow-up, LLM struggles with bluntness modeling, single character risks stereotyping, uncritical AI trust

## Appendix B: PromptBridge Architecture Reference (Updated 2026-03-23)

- **Modes (public app):** Guided Practice (static pre-generated content + heuristic write-your-own), Write Your Own (heuristic scoring + copy-to-real-AI), Assessment (heuristic)
- **Modes (local dev only):** Write First/Hybrid, Multi-Turn, API-powered analysis — available when running the repo locally with an API key
- **Scenarios:** 30 guided + 15 freeform across 5 categories
- **Principles:** 8 (P1-P8), tracked per-user in localStorage
- **Architecture:** Fully static site, no outbound network requests, no API keys in the public app
- **Heuristic scorer:** Client-side regex matching for principle detection — the only scoring method in the public app
- **Pre-generated content:** 30 JSON files in `app/src/data/generated/` with options, responses, and feedback
- **Recommendation engine:** Prioritizes scenarios teaching unpracticed principles
- **Assessment:** Pre/post with different scenario sets, heuristic scoring, before/after comparison
- **Copy-to-real-AI workflow:** Every scenario includes copy buttons and links to ChatGPT, Claude, Gemini, Copilot

---

*This document is a research deliverable. No code changes were made.*
