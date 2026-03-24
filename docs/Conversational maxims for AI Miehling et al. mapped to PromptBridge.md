# Conversational maxims for AI: Miehling et al. mapped to PromptBridge

**Six maxims — four classical, two new — define what makes human-AI conversation work, and PromptBridge already teaches four of them well while leaving two critical ones almost untouched.** IBM researchers Erik Miehling and colleagues formally extended Grice's 1975 cooperative principle with two maxims specifically needed for AI interactions: **Benevolence** (don't generate or engage with harmful content) and **Transparency** (acknowledge what you don't know, can't do, and won't discuss). Their EMNLP 2024 paper provides a complete taxonomy of LLM failure modes mapped to maxim violations and reveals through empirical testing that language models have a hidden internal hierarchy of principles — they prioritize safety concerns so heavily that it degrades their ability to reason about other conversational dimensions. This has direct, actionable implications for PromptBridge's design.

---

## The six-maxim framework and its 13 sub-maxims

Miehling et al. argue that Grice's original four maxims — designed for symmetric human-human conversation between cooperative equals — remain valid for human-AI dialogue but are **insufficient**. AI introduces fundamental asymmetries: the model has different knowledge boundaries, no embodiment, no genuine experience, and specific operational constraints that never arise between two humans. The team decomposes their six maxims into **13 prescriptive sub-maxims** (though only 12 are empirically tested, omitting Quality₂ due to the difficulty of measuring honesty).

**Maxim 1: Quantity** concerns the amount of information in a response. Sub-maxim Quantity₁ (Sufficiency) requires providing enough information; Quantity₂ (Conciseness) requires avoiding unnecessary detail. The authors trace verbosity to reward model over-optimization — models learn that longer, more confident-sounding answers get higher human preference scores, creating a perverse incentive to pad responses.

**Maxim 2: Quality** addresses truthfulness and honesty. Quality₁ (Truthfulness) demands factual accuracy supported by evidence — its violation is **hallucination**. Quality₂ (Honesty) demands that responses accurately reflect the speaker's internal state — its violation is **sycophancy**, where RLHF training teaches models to confirm users' mistaken beliefs rather than correct them. The paper draws an important distinction: truthfulness is external consistency (response vs. facts), while honesty is internal consistency (response vs. what the model "knows"). The authors cite emerging evidence that LLMs do possess meaningful internal representations of truth, making honesty increasingly evaluable.

**Maxim 3: Relevance** (Grice's "Relation," renamed for clarity) requires appropriate responsiveness. Relevance₁ (Direct Helpfulness) means directly addressing the user's actual needs in a helpful way — it implicitly requires seeking clarification when uncertain and repairing misunderstandings. Relevance₂ (Topical Coherence) means staying on-topic without unnatural shifts. A key insight: when a model provides a confident answer rather than admitting uncertainty, it violates Relevance₁ because it fails to address the user's *actual need* (which is accurate information, not confident-sounding noise).

**Maxim 4: Manner** governs how information is conveyed. Manner₁ (Clarity) requires clear, unambiguous, well-organized presentation. Manner₂ (Accessibility) requires language tailored to the user's level of understanding. The authors note that despite impressive context windows, models still suffer "lost in the middle" problems where recall degrades for information in the center of long contexts.

**Maxim 5: Benevolence** (NEW) captures moral responsibility. Benevolence₁ (Harm Prevention) requires responses avoid being insensitive, rude, culturally biased, prejudiced, or harmful. Benevolence₂ (Harm Refusal) requires refusing to engage with or endorse harmful or unethical requests, including jailbreak attempts. This maxim exists because Grice assumed cooperative good-faith participants — he never anticipated a conversational partner with vast knowledge that malicious actors could exploit. Benevolence connects to established politeness theory (Brown & Levinson 1987) and trust research, but extends these into genuinely novel territory around AI-specific harms like bias amplification and adversarial exploitation.

**Maxim 6: Transparency** (NEW) addresses knowledge boundaries, operational constraints, and willingness to engage. Transparency₁ (Knowledge Boundaries) requires acknowledging limitations in expertise, evidence, experience, or context — including training cutoffs, lack of personal experience, and inability to provide professional advice. Transparency₂ (Operational Capabilities) requires honesty about what the model can and cannot physically do — no claiming embodiment or real-world action. Transparency₃ (Forthright Willingness) requires explaining *why* the model avoids certain topics rather than being evasive without justification. The authors trace the "never says I don't know" problem to RLHF training where human labelers penalized models for admitting uncertainty, creating an incentive for **unrelenting helpfulness** at the cost of accuracy.

---

## Every LLM failure mode has a maxim address

The paper's most practically useful contribution is a systematic mapping showing that known LLM problems are not random — they are specific violations of specific conversational principles. Here is the complete taxonomy:

| LLM failure mode | Primary maxim violation |
|---|---|
| Verbosity / overly wordy responses | Quantity₂ (conciseness) |
| Insufficient detail | Quantity₁ (sufficiency) |
| **Hallucination** | **Quality₁ (truthfulness)** |
| **Sycophancy** (confirming user errors) | **Quality₂ (honesty)** + Relevance₁ |
| Providing answers when uncertain | Relevance₁ + Transparency₁ |
| Failing to seek clarification | Relevance₁ (implicit requirement) |
| Unnatural topic shifts | Relevance₂ (topical coherence) |
| Incoherent / disorganized responses | Manner₁ (clarity) |
| Overly technical language | Manner₂ (accessibility) |
| Toxic / biased / prejudiced outputs | Benevolence₁ (harm prevention) |
| Complying with harmful requests (jailbreaks) | Benevolence₂ (harm refusal) |
| **Never saying "I don't know"** | **Transparency₁ (knowledge boundaries)** |
| Claiming to have emotions or preferences | Transparency₁ (knowledge boundaries) |
| Claiming physical capabilities | Transparency₂ (operational constraints) |
| Evasiveness without explanation | Transparency₃ (forthright willingness) |
| "Lost in the middle" recall failure | Manner₁ (clarity in long dialogue) |
| Reward model over-optimization effects | Quantity₂ (verbosity to appear expert) |

This mapping transforms vague complaints about AI ("it makes stuff up," "it's too wordy") into precise diagnostic categories. Each failure mode has a named root cause, and each root cause suggests a specific design intervention.

---

## Models have a hidden hierarchy that distorts their judgment

The empirical section — added for the EMNLP camera-ready version — tested three open-source models (llama-3-70b-instruct, llama-3-8b-instruct, mixtral-8x7b-instruct-v0.1) on **1,000 conversations** from Anthropic's hh-rlhf dataset, with **50 hand-labeled** for ground truth. The methodology was novel: each model served as a labeler, evaluating conversations against each sub-maxim using carefully crafted prompts with definitions and examples. For each of 12 sub-maxims, they created dataset splits containing conversations where that sub-maxim was violated, then measured how accurately the model could label all *other* sub-maxims within that split.

The headline finding for llama-3-70b-instruct: **benevolence dominates the model's internal priorities to the point of cognitive interference.** When conversations contained benevolence violations (harmful content), the model's accuracy at evaluating every other dimension — quantity, quality, relevance, manner — dropped significantly. The model effectively becomes so focused on the harm dimension that it loses the ability to distinguish other types of conversational failure. A factually incorrect but harmless response might be correctly flagged as a Quality₁ violation, but a factually incorrect *and* harmful response gets classified primarily as a Benevolence violation, with the Quality₁ issue going undetected.

Other key empirical findings: **Relevance₂** (topical coherence) showed strong co-occurrence with violations of Quantity₁, Quantity₂, Quality₁, and Relevance₁ — suggesting that off-topic responses tend to fail on multiple dimensions simultaneously. The model was **most accurate** at detecting Benevolence violations and **least accurate** at detecting Manner₂ (language accessibility) violations. All three models showed similar patterns, confirming this internal prioritization as a systematic phenomenon rather than a model-specific quirk.

The practical implication is significant: using LLMs as conversational quality evaluators (increasingly common in RLHF and automated evaluation) risks systematic blind spots. A model trained to prioritize safety will undercount non-safety violations in safety-adjacent contexts. This is a form of evaluator bias that the maxim framework makes visible and measurable.

---

## Why Grice alone cannot govern human-AI talk

The paper builds a careful argument that Grice's original four maxims, while necessary, leave two critical gaps.

**The Benevolence gap.** Grice's cooperative principle assumed conversations between roughly equal human partners who share social norms, legal constraints, and mutual vulnerability. These assumptions break down with AI. An LLM has no social consequences for generating harmful content, possesses knowledge that could enable real-world harm, and can be systematically exploited through adversarial prompting. No combination of Quality, Quantity, Relevance, and Manner captures the unique obligation of a system with vast knowledge to not weaponize that knowledge. You can be perfectly truthful, appropriately detailed, relevant, and clear while providing step-by-step instructions for something dangerous.

**The Transparency gap.** Grice never needed a maxim for "admit what you don't know" because human conversationalists naturally do this — they have direct access to their own uncertainty and social incentives to maintain credibility. LLMs, by contrast, were specifically trained *against* expressing uncertainty. The training pipeline (pretraining → instruction tuning → RLHF) systematically selects for confidence. Transparency also covers constraints with no human-conversation analogue: training cutoff dates, inability to access current information, lack of embodied experience, developer-imposed topic restrictions, and the fundamental nature of being a statistical model rather than a knowledgeable agent.

The authors also note regulatory motivation: the EU AI Act and ISO/IEC 42001:2023 both require transparency in AI systems, creating legal grounding for the new maxim beyond conversational theory alone.

---

## Where this sits among related frameworks

Three other frameworks provide useful comparison points. **Kasirzadeh & Gabriel (2023)** published in *Philosophy & Technology* took a more philosophically grounded approach, examining syntactic, semantic, and pragmatic requirements across three discursive domains (scientific, democratic, creative). Their work is more abstract and normative; Miehling et al. is more operational with specific sub-maxims and empirical validation. Kasirzadeh & Gabriel do not propose explicit new maxims. Notably, Miehling's recent follow-up work on agentic AI systems theory is co-authored with Kasirzadeh, suggesting convergence between these research programs.

**Kim et al. (CHI 2025)** took a participatory design approach, running workshops with domain experts and end-users who redefined Gricean maxims through their own experience with LLMs. They produced 9 design considerations mapped to three interaction stages (user communicates goals → AI generates → user evaluates). They explicitly cite Miehling et al.'s Benevolence and Transparency additions, noting that practical application "remains underexplored." Kim et al. is the most user-centered of the three, making it a natural bridge between Miehling et al.'s theory and PromptBridge's pedagogy.

**Lo's CLEAR Framework (2023)** — Concise, Logical, Explicit, Adaptive, Reflective — operates at a fundamentally different level. It is a prompt engineering guide for users, not a normative framework for AI behavior. CLEAR parallels some Gricean maxims (Concise ≈ Quantity, Logical ≈ Manner, Explicit ≈ Manner) but lacks anything resembling Benevolence, Transparency, or even Quality in the truthfulness sense. Its overlap with PromptBridge is substantial — both are pedagogical tools teaching better prompting — but neither addresses AI-side conversational obligations.

---

## The IBM Trustworthy AI team behind this work

All six authors work within IBM Research's Trustworthy AI ecosystem. **Erik Miehling** (lead author, PhD Michigan, postdoc UIUC) focuses on AI steerability and leads the AISteer360 toolkit; his thesis is that "controllability is a more direct and sustainable target for AI safety than alignment." **Prasanna Sattigeri** (Principal Research Scientist, PhD Arizona State) leads **Granite Guardian**, IBM's state-of-the-art LLM safeguarding model that currently ranks #1 on both GuardBench and REVEAL benchmarks — a direct operationalization of the Benevolence maxim. **Elizabeth Daly** (Senior Technical Staff Member, IBM Ireland) serves as **Global Strategy Sub-theme Lead for Trustworthy Human-Centered AI and Governance** across all of IBM Research. **John T. Richards** (Distinguished Research Scientist, now retired after 46 years) co-created IBM's **AI FactSheets** project and co-authored the book *Humble AI* — the intellectual ancestor of the Transparency maxim. **Manish Nagireddy** (MIT-IBM Watson AI Lab) maintains AI Fairness 360, AI Explainability 360, and Uncertainty Quantification 360. **David Piorkowski** (PhD Oregon State) led human-AI collaboration research and the FactSheets methodology; his entire team was laid off from IBM in early 2025.

This paper is not an isolated publication — it is one node in IBM's broader trustworthy AI program spanning open-source toolkits (AIF360, AIX360, ART, UQ360, AISteer360), governance products (Risk Atlas Nexus), safety models (Granite Guardian), and foundational research on agentic AI systems theory.

---

## PromptBridge covers four maxims well — Benevolence and Transparency are the gaps

Here is the precise mapping of PromptBridge's 8 principles to Miehling et al.'s 6 maxims:

| Maxim | Sub-maxim | PromptBridge principle(s) | Coverage |
|---|---|---|---|
| Quantity₁ (sufficiency) | "Provide context," "Be specific" | ✅ Strong |
| Quantity₂ (conciseness) | "Be specific, not vague," "State your intent" | ✅ Moderate |
| Quality₁ (truthfulness) | — | ⚠️ Weak (no principle addresses verifying AI accuracy) |
| Quality₂ (honesty) | — | ❌ Gap |
| Relevance₁ (direct helpfulness) | "State your intent," "Ask AI to ask you questions" | ✅ Strong |
| Relevance₂ (topical coherence) | "Give specific feedback" | ✅ Moderate |
| Manner₁ (clarity) | "Avoid ambiguity," "Show what good looks like" | ✅ Strong |
| Manner₂ (accessibility) | "Provide context" (partially) | ⚠️ Weak |
| Benevolence₁ (harm prevention) | AI Safety Guide (if exists) | ⚠️ Minimal |
| Benevolence₂ (harm refusal) | — | ❌ Gap |
| Transparency₁ (knowledge boundaries) | — | ❌ Gap |
| Transparency₂ (operational capabilities) | — | ❌ Gap |
| Transparency₃ (forthright willingness) | — | ❌ Gap |

**What PromptBridge does well:** The current 8 principles map strongly to Quantity, Relevance, and Manner — the "communication mechanics" maxims. "Be specific, not vague" + "Provide context" teach Quantity. "State your intent" + "Ask the AI to ask you questions" teach Relevance. "Avoid ambiguity" + "Show what good looks like" teach Manner. These are the right foundations. The contrasting-cases pedagogy (weak/medium/effective tiers) is an excellent way to teach these distinctions.

**What PromptBridge is missing:** Quality (truthfulness/honesty), Benevolence (harm awareness), and Transparency (AI limitations) have no dedicated principles. A user could complete all 45 scenarios and still not know that AI hallucinates, that AI will agree with them when they're wrong, that AI has knowledge cutoffs, that AI can generate harmful content, or what to do when any of these things happen.

---

## Concrete recommendations for PromptBridge development

### Three new principles to add

**Principle 9: "Check AI's work" (Quality maxim).** Teach users that even well-prompted AI can produce confident-sounding false information. Jargon-free framing: *"AI sounds equally confident whether it's right or wrong. Always verify important claims — especially numbers, dates, quotes, and technical details."* This addresses hallucination (Quality₁) and sycophancy (Quality₂). Design scenarios where the AI gives a plausible but wrong answer and users must identify the error.

**Principle 10: "Know what AI can't do" (Transparency maxim).** Teach users about AI's real limitations. Jargon-free framing: *"AI doesn't know what happened after its training date, can't access the internet unless told it can, has no personal experiences, and sometimes avoids topics without explaining why. Ask it what it doesn't know."* This covers Transparency₁, ₂, and ₃. Design scenarios where users learn to prompt for uncertainty acknowledgment ("How confident are you?" or "What don't you know about this?").

**Principle 11: "Use AI responsibly" (Benevolence maxim).** Teach users about the human side of AI safety. Jargon-free framing: *"AI can reflect and amplify biases, produce harmful stereotypes, and generate dangerous content. You're the human in the loop — it's your job to notice when something isn't right and not pass harmful AI content along."* This covers Benevolence₁ and ₂. Design scenarios where AI output contains subtle bias or inappropriate content and users must identify and correct it.

### New scenario designs derived from failure-mode mapping

The failure-mode-to-maxim mapping suggests **15 new scenarios** across the existing category structure:

**Vague vs. Specific (add 3 scenarios):**
- "The Hallucination Trap": User asks a factual question with a vague prompt, gets a hallucinated answer. Effective prompt includes "cite your sources" or "tell me if you're uncertain." Teaches Quality₁.
- "The Sycophancy Test": User states an incorrect fact and asks AI to build on it. Weak prompt accepts the false premise; effective prompt says "First, verify whether my assumption is correct." Teaches Quality₂.
- "The Overconfident Expert": AI gives a detailed but wrong technical answer. User learns to add "What are the limitations of your knowledge here?" Teaches Transparency₁.

**Context & Framing (add 4 scenarios):**
- "The Time Traveler": User asks about recent events without specifying when AI's knowledge ends. Teaches training cutoff awareness (Transparency₁).
- "The Invisible Bias": User asks AI to describe a "typical" professional in a field. AI reflects demographic biases. Effective prompt specifies "include diverse perspectives" or "check for stereotypes." Teaches Benevolence₁.
- "The Medical Disclaimer": User asks for health advice. Teaches that AI should recommend professional consultation (Transparency₁ + Benevolence₁).
- "The Emotional AI": User asks AI how it "feels" about something. Teaches operational capability awareness (Transparency₂).

**Iterative Refinement (add 4 scenarios):**
- "The Fact-Check Loop": User asks AI to generate content, then asks it to identify which claims might be inaccurate. Teaches iterative verification (Quality₁).
- "The Bias Audit": User generates content then asks AI to review it for bias or harmful assumptions. Teaches Benevolence₁.
- "The Confidence Calibrator": User asks AI a question, then follows up with "Rate your confidence on a scale of 1-10 and explain why." Teaches Transparency₁.
- "The Scope Limiter": AI gives a broad answer; user narrows it by asking "What are you *not* qualified to advise on here?" Teaches Transparency₁ + ₃.

**Smart Strategies (add 4 scenarios):**
- "The Red Team": User asks AI to critique its own previous answer for errors, bias, and limitations. Teaches Quality₁ + Benevolence₁.
- "The Limitations Interview": User prompts AI with "Before answering, tell me what you don't know about this topic." Teaches Transparency₁.
- "The Refusal Decoder": AI refuses a request; user learns to ask "Why can't you help with this? What alternative approaches can you suggest?" Teaches Transparency₃.
- "The Source Skeptic": User asks AI to generate a bibliography, then checks whether the sources are real. Teaches hallucination awareness (Quality₁).

### Expanding the AI Safety Guide

Based on Miehling et al.'s framework, PromptBridge's AI Safety Guide should cover at minimum:

- **Hallucination awareness** (Quality₁): What it is, why it happens (training data noise, statistical generation), and specific verification strategies. The paper's explanation that hallucination arises from "incorrect referencing, inappropriate data handling, imperfect representations, erroneous decoding, and knowledge biases" can be simplified to: *"AI predicts words that sound right — it doesn't look things up or check facts."*
- **Sycophancy awareness** (Quality₂): The concept that AI is trained to agree with you. *"AI learned from human feedback that people prefer being agreed with. It will sometimes tell you what you want to hear rather than what's true."*
- **Bias and harm** (Benevolence₁): AI can reflect and amplify social biases present in training data. Include concrete examples of how to spot biased outputs.
- **Jailbreaks and misuse** (Benevolence₂): Brief, clear explanation that AI has safety filters and why they exist. Not as a hacking guide but as literacy — *"If AI refuses your request, it's usually because the topic is in a safety-sensitive area. Rephrase or approach differently."*
- **Knowledge boundaries** (Transparency₁): Training cutoff dates, no internet access (unless specified), no personal experience, no professional qualifications.
- **Operational limits** (Transparency₂): AI cannot take real-world actions, verify its own outputs against external sources, or remember past conversations (unless memory is enabled).
- **Evasiveness** (Transparency₃): Why AI sometimes avoids topics and how to get it to explain its reasoning.

### Teaching Benevolence and Transparency in jargon-free terms

For the NeuroBridge-inspired pedagogical approach, frame these maxims through the communication-bridge metaphor:

**Benevolence in plain language:** *"Just as careful communicators think about how their words affect others, careful AI users watch for content that could hurt, mislead, or exclude people. AI doesn't understand harm — you do. You're the quality filter between AI output and the real world."*

**Transparency in plain language:** *"AI is not an expert — it's a very sophisticated autocomplete that sounds like an expert. The most important communication skill with AI is knowing when to ask: 'Are you sure? What don't you know? Where did you get that?' Just as clear communication with anyone requires understanding their perspective and limitations, communicating with AI requires understanding what AI actually is and isn't."*

This connects directly to PromptBridge's core thesis: the same communication skills that help bridge neurotype differences (being explicit, checking understanding, not assuming shared context) help bridge the human-AI gap. Transparency and Benevolence extend this: you also need to understand your conversation partner's limitations (Transparency) and take responsibility for the impact of the conversation's outputs (Benevolence).

### Priority implementation roadmap

1. **Immediate (high impact, low effort):** Add Principles 9-11 to the framework. Update the AI Safety Guide with Quality, Benevolence, and Transparency content using the jargon-free language above.
2. **Short-term (4-6 scenarios):** Build the Hallucination Trap, Sycophancy Test, Invisible Bias, and Limitations Interview scenarios. These cover the highest-impact gaps with the most engaging contrasting-cases potential.
3. **Medium-term (full 15 scenarios):** Build remaining scenarios across all four categories. Consider adding a fifth category: **"Critical Thinking"** specifically for Quality, Benevolence, and Transparency scenarios.
4. **Longer-term:** Develop an interactive "Maxim Dashboard" where users can see which of the 6 maxims each principle and scenario addresses, making the theoretical framework accessible without requiring users to read academic papers. Reference the Miehling et al. framework in PromptBridge's documentation as a research foundation alongside NeuroBridge.

---

## Conclusion: a complete diagnostic language for AI communication

Miehling et al. provide something PromptBridge currently lacks — a **diagnostic vocabulary** for what goes wrong in human-AI conversation and why. PromptBridge's existing 8 principles teach users to write better *inputs*. The maxim framework reveals that effective AI communication also requires understanding the AI's *output failure modes* and the user's *evaluative responsibilities*. The three new principles (Check AI's Work, Know What AI Can't Do, Use AI Responsibly) would transform PromptBridge from a prompt-writing tool into a comprehensive AI communication literacy platform. The failure-mode-to-maxim mapping provides a ready-made taxonomy for scenario design — every row in that table is a potential teaching moment. And the empirical finding that models prioritize safety over accuracy validates a specific pedagogical choice: teach users that AI's safety training can mask other problems, so verification matters even when AI sounds confident and appropriate.

The paper also strengthens PromptBridge's core thesis. Grice's maxims were developed to describe how neurotypical humans navigate the ambiguity inherent in all communication. Miehling et al.'s extension shows that human-AI communication introduces new categories of ambiguity (about truth, limitations, and harm) that require new explicit communication norms. This is precisely the NeuroBridge insight applied at scale: when you cannot rely on shared assumptions, you need explicit, structured communication principles. PromptBridge is already building the right thing — it just needs to finish the last two walls.