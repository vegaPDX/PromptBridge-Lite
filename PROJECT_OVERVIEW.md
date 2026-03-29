# PromptBridge Lite — Project Overview

## What PromptBridge Lite Is

PromptBridge Lite is a free, open-source learning tool that teaches anyone — regardless of technical background — how to communicate effectively with AI assistants. It's not a prompt library or a cheat sheet. It's a hands-on practice environment where people build real skills through real scenarios, then take those skills to any AI tool they already use.

**PromptBridge Lite** is a focused version of the full [PromptBridge](https://github.com/vegaPDX/PromptBridge) app, distilled down to the core teaching framework: 6 maxims, 13 sub-maxims, and 26 carefully selected guided scenarios (2 per sub-maxim). The full PromptBridge app offers nearly 3x as many scenarios across both guided and freeform modes. Lite is designed as a complete introduction that covers every principle without overwhelming new users.

The core belief behind PromptBridge is simple: **the biggest barrier to getting value from AI isn't access to the technology — it's knowing how to talk to it.** Millions of people now have access to powerful AI tools, but most have never been taught how to use them well. They type a few words, get a mediocre response, and walk away thinking AI isn't that useful. PromptBridge exists to close that gap.

---

## The Problem PromptBridge Solves

AI tools are available to almost everyone, but the skills to use them effectively are not evenly distributed. Most resources for learning to "prompt" AI are written for developers, power users, or people already deep in the AI space. They use jargon. They assume familiarity with concepts like "system prompts," "temperature," and "few-shot examples." They optimize for advanced users getting 10% better, not beginners getting started at all.

This leaves out the people who would benefit most: teachers preparing lessons, small business owners writing marketing copy, students researching papers, parents trying to help with homework, job seekers polishing resumes. These people don't need to learn prompt engineering. They need to learn how to have a clear conversation — and that's a skill anyone can build.

PromptBridge Lite meets people where they are. No accounts. No API keys. No jargon. You open the tool, pick a scenario that looks like something from your actual life, and start practicing.

---

## The Goal: Democratize AI Literacy

PromptBridge's mission is to make AI communication skills accessible to everyone, not just early adopters and technical users. This means:

**Beginner-first design.** Every decision is filtered through the question: "Would someone who has never used AI before understand this?" If the answer is no, it gets rewritten. Academic terminology never appears in the user interface. Concepts like "hallucination" are explained as "AI can sound confident and still be wrong." Concepts like "sycophancy" are explained as "AI is trained to agree with you." The tool teaches the ideas without requiring people to learn a vocabulary first.

**No setup, no barriers.** PromptBridge Lite is a static website. There is no signup, no login, no API key, no backend server. You open a URL and start learning. Progress is saved in your browser. This matters because the people most in need of AI literacy are often the least likely to navigate technical setup steps.

**Tool-agnostic skills.** PromptBridge doesn't teach you how to use ChatGPT, Claude, or Gemini specifically. It teaches communication skills that work with all of them. After practicing a scenario, you copy your prompt and try it in whichever AI tool you prefer. The skills transfer because they're fundamentally about clear communication, not about any particular product.

**Copy-paste as the primary workflow.** The main action in PromptBridge Lite is: learn a skill, write a prompt, copy it, paste it into a real AI tool, and see the result. This bridges the gap between learning and doing. Every scenario includes one-click copy buttons and direct links to ChatGPT, Claude, Gemini, and Copilot.

---

## How Lite Is Organized

PromptBridge Lite structures its teaching around **6 maxims** — broad communication principles drawn from Gricean pragmatics and extended by recent human-AI interaction research:

1. **Be Clear & Specific** — The difference between useful and useless AI output almost always comes down to clarity.
2. **Provide Context & Intent** — AI can't read your mind. Tell it who you are and why you need something.
3. **Guide the Output** — Don't just describe what you want — show it. Examples and boundaries are your most powerful tools.
4. **Iterate & Collaborate** — Great results rarely come from a single prompt. Learn to steer AI with feedback.
5. **Verify & Think Critically** — AI sounds confident whether it's right or wrong. Your job is to check.
6. **Use AI Responsibly** — AI can reflect biases, agree when it shouldn't, and refuse when it needn't. You are the human quality filter.

Each maxim breaks into **sub-maxims** (13 total), and each sub-maxim has **2 practice scenarios** — for **26 guided scenarios** that comprehensively cover all 12 communication principles. Maxim 6 receives extra emphasis with 3 sub-maxims and 6 scenarios, reflecting the project's commitment to responsible AI use.

Every scenario uses the same guided practice format: compare three prompt approaches (weak, getting there, effective) side by side, see the AI response each produces, and receive specific feedback explaining why the effective approach works. Then write your own version and get scored.

---

## Guided by Research

PromptBridge Lite's 12 communication skills and 26 practice scenarios aren't invented from intuition — they're guided by a body of academic research on how humans and AI systems communicate, where those conversations break down, and what makes them work.

### The NeuroBridge Foundation

The project began with a surprising connection. [NeuroBridge](https://dl.acm.org/doi/10.1145/3663547.3746337), a research tool from Tufts University (Haroon et al., ASSETS 2025, Best Student Paper), trains neurotypical people to communicate more clearly with autistic individuals. It teaches skills like being direct, avoiding indirect speech, providing explicit context, and not assuming shared knowledge.

These are the exact same skills that make someone effective at communicating with AI. AI assistants are literal interpreters. They don't infer what you meant from what you said. They don't share your life context. They don't know what you're trying to accomplish unless you tell them. The communication gap between a neurotypical person and an autistic person — where assumptions and implicit meaning create misunderstanding — is structurally similar to the communication gap between a human and an AI.

PromptBridge adapts NeuroBridge's pedagogical model: see the consequences of different communication approaches, compare them side by side, receive specific feedback about what worked and why. This isn't a lecture. It's learning by doing.

### Gricean Pragmatics: The Theoretical Foundation

Beneath both NeuroBridge and PromptBridge is a theory from the philosophy of language. In 1975, philosopher Paul Grice described four "maxims" that cooperative communicators naturally follow: be informative enough but not too much (Quantity), be truthful (Quality), be relevant (Relevance), and be clear (Manner). When these maxims are violated, communication breaks down.

Research over the past several years has shown that Gricean maxims apply directly to human-AI conversation — and that AI systems routinely violate them. AI can be too verbose or too brief (Quantity violations). AI can state false information confidently (Quality violations). AI can go off-topic or fail to address what you actually need (Relevance violations). AI can be disorganized or use overly technical language (Manner violations).

PromptBridge Lite's first 8 skills map to these four maxims: "Be specific" and "Include everything needed — but nothing extra" teach Quantity. "State your intent" and "Ask the AI to ask you questions" teach Relevance. "Avoid ambiguity" and "Show what good looks like" teach Manner. "Provide context" bridges Quantity and Relevance.

A synthesis of 11 core papers and 15+ supporting studies (2002–2025) — including work from CHI, EMNLP, ASSETS, and other top venues — validated this mapping and revealed where PromptBridge had gaps.

### Miehling et al.: Completing the Picture

In 2024, IBM researchers led by Erik Miehling published a paper at EMNLP that extended Grice's framework with two new maxims specifically needed for AI communication:

**Transparency** — AI should acknowledge what it doesn't know, can't do, and won't discuss. But in practice, AI systems are trained to sound confident even when they're wrong, trained to avoid expressing uncertainty, and trained to refuse topics without explaining why. Users need to understand these limitations and know how to surface them.

**Benevolence** — AI should avoid generating harmful content and refuse harmful requests. But AI can also subtly reflect biases from its training data, agree with users' mistakes rather than correcting them (sycophancy), and produce content that looks professional but encodes stereotypes. Users need to recognize that they are the human quality filter between AI output and the real world.

Miehling et al.'s paper also provided a complete taxonomy mapping every known AI failure mode to a specific maxim violation — transforming vague complaints like "AI makes stuff up" into precise, teachable categories. This taxonomy directly shaped PromptBridge's last four skills (P9–P12) and the "Using AI Wisely" guide.

PromptBridge Lite covers all six maxims: Quantity, Quality, Relevance, Manner, Transparency, and Benevolence.

### Research Informing Design, Not Dictating It

An important note: PromptBridge is guided by this research, not a mechanical implementation of it. Academic frameworks use terms like "Gricean maxims," "sub-maxim violations," "pragmatic competence," and "cooperative principle." None of these terms appear anywhere in PromptBridge Lite's user interface. The research provides the structure and identifies the gaps. PromptBridge translates that into plain language, everyday scenarios, and hands-on practice.

When Miehling et al. describe "Transparency₁ (Knowledge Boundaries)," PromptBridge Lite teaches it as: "AI has a training cutoff, can't browse the web, has no personal experience, and sometimes avoids topics without explaining why." When they describe "Quality₂ (Honesty) violations via sycophancy," PromptBridge Lite teaches it through a scenario called "When AI agrees too much" where users tell AI an incorrect fact and see whether it corrects them or goes along with it.

The goal is always the same: give people practical skills they can use immediately, grounded in the best available understanding of how human-AI communication works.

---

## Lite vs. Full PromptBridge

| | PromptBridge Lite | PromptBridge (Full) |
|---|---|---|
| **Scenarios** | 26 guided | 76 (61 guided + 15 freeform) |
| **Organization** | 6 maxims, 13 sub-maxims | 5 categories |
| **Modes** | Guided practice | Guided practice + Write Your Own |
| **Safety emphasis** | 6 scenarios (23%) in Maxim 6 | Safety woven throughout |
| **Assessment** | Planned | Pre/post skill assessment |
| **Best for** | Complete introduction, new users | Deep practice, all skill levels |

PromptBridge Lite covers every communication principle and every maxim — it's a complete learning experience, not a demo. The full app adds more scenarios per skill, freeform practice, and broader context coverage.

---

## The Spirit of the Project

PromptBridge is built on a few core beliefs:

**AI literacy is a public good.** The ability to communicate effectively with AI should not be a premium skill reserved for people in tech. It should be as accessible as the AI tools themselves. PromptBridge is open source (AGPL-3.0) because knowledge about how to use AI well should be freely available to everyone.

**Teaching is better than telling.** A list of tips doesn't change behavior. Seeing the direct consequences of your choices — side by side, in a scenario that looks like your real life — does. PromptBridge's pedagogy is designed around this principle: show, don't tell. Compare, don't lecture. Practice, don't memorize.

**Critical thinking is part of AI literacy.** Teaching people to write better prompts is only half the job. The other half is teaching people to think critically about what AI gives back. Can you spot when AI is making something up? Do you notice when it agrees with you just to be agreeable? Can you tell when its description of a "typical professional" is encoding a stereotype? These are the skills that turn an AI user into a responsible AI user.

**Start with empathy, not expertise.** PromptBridge's tone is encouraging, never condescending. When feedback explains why a weaker approach doesn't work, it starts with: "This is how most people would phrase it — it's completely natural." Then it explains the consequence and offers a better path. Nobody learns when they feel judged.

---

## Key References

- Haroon, R., Wigdor, K., Yang, K., Toumanios, N., Crehan, E.T., & Dogar, F. (2025). "NeuroBridge: Using Generative AI to Bridge Cross-neurotype Communication Differences through Neurotypical Perspective-taking." *ASSETS '25*. DOI: [10.1145/3663547.3746337](https://dl.acm.org/doi/10.1145/3663547.3746337)

- Miehling, E., Sattigeri, P., Daly, E., Richards, J.T., Nagireddy, M., & Piorkowski, D. (2024). "A Language Model-Guided Framework for Mining Time Series with Conversational Maxims for AI." *EMNLP 2024*. IBM Research.

- Kim, Y., Chin, B., Son, K., Kim, S., & Kim, J. (2025). "Applying the Gricean Maxims to a Human-LLM Interaction Cycle." *CHI EA '25*. DOI: [10.1145/3706599.3719759](https://doi.org/10.1145/3706599.3719759)

- Lo, L.S. (2023). "The CLEAR Path: A Framework for Enhancing Information Literacy through Prompt Engineering." *The Journal of Academic Librarianship*, 49(4). DOI: [10.1016/j.acalib.2023.102720](https://doi.org/10.1016/j.acalib.2023.102720)

- Saad, M., et al. (2025). Empirical validation of Gricean-informed prompting showing up to 27% accuracy improvement in LLM task performance.

- Grice, H.P. (1975). "Logic and Conversation." In *Syntax and Semantics*, Vol. 3: Speech Acts. Academic Press.

---

## License

**AGPL-3.0** — [GNU Affero General Public License v3.0](LICENSE)

PromptBridge is free software. If you use it, modify it, or build on it — including running it as a web service — you must share your source code under the same license.

This license was chosen to ensure that improvements to AI literacy tools remain freely available to everyone, in the spirit of the open research that made PromptBridge possible.
