# PromptBridge — Project Specification

## Working name: PromptBridge

---

## What is this?

PromptBridge is an open-source, interactive web tool that teaches people how to communicate effectively with AI assistants. It's not specific to any one AI tool or company — it teaches the universal communication skills that make AI conversations productive: being specific, providing context, avoiding ambiguity, iterating based on feedback, and knowing when and how to refine.

The tool is inspired by NeuroBridge (Tufts University, ASSETS 2025 Best Student Paper), which trains neurotypical people to communicate more clearly with autistic individuals. NeuroBridge's key insight: the communication skills it teaches (direct, literal, unambiguous, context-rich) are the same skills that make someone effective at AI prompting. PromptBridge takes that insight and builds a dedicated AI prompting trainer around it.

---

## Who is this for?

- **Anyone new to AI tools** who types short keyword queries and gets generic results
- **Workplace teams** being introduced to AI assistants for the first time
- **Students and educators** learning to use AI tools effectively
- **Anyone who wants to improve** but doesn't know where to start

No technical background required. No AI experience required. The tool meets people where they are.

---

## Core design principles

1. **AI-agnostic.** The tool teaches communication skills, not tool-specific tricks. Skills learned here work with Claude, ChatGPT, Gemini, Slackbot, Copilot — any conversational AI.

2. **Learn by doing, not by reading.** The tool is interactive. Users practice writing prompts, see what works and what doesn't, and get specific feedback — not lectures.

3. **Show, don't just tell.** The tool shows simulated AI responses side-by-side: what a poorly-phrased prompt produces vs. what a well-phrased prompt produces. Seeing the difference is more powerful than being told about it.

4. **Two learning modes.** Guided Practice (compare 3 prompt tiers, then write your own) for structured learning. Write Your Own (compose from scratch, get skill feedback, copy to a real AI tool) for open practice.

5. **Copy-to-real-AI workflow.** PromptBridge is a training tool, not a replacement for real AI tools. Every scenario includes copy buttons and direct links to ChatGPT, Claude, Gemini, and Copilot. The goal is to build skills that users take elsewhere.

6. **Open source and free.** No subscriptions, no paywalls, no API keys required. The tool should be accessible to anyone who wants to learn.

7. **No jargon.** The tool never uses terms like "prompt engineering," "tokens," "context window," or "system prompt" in user-facing content. It uses plain language: "how to talk to AI tools," "giving context," "being specific."

8. **Zero-trust static architecture.** The public web app makes no outbound network requests, stores no secrets, and requires no backend. This simplifies security and ensures the tool works anywhere.

---

## Core features

### Feature 1: Scenario-based learning (Guided Practice)

The user is presented with a real-world scenario (e.g., "You need help planning a team meeting agenda"). The tool shows three pre-generated prompt approaches — weak, getting there, and effective — with the simulated AI response each one produces. The user sees the side-by-side comparison and gets feedback explaining WHY the effective prompt works, tied to a specific communication principle. Then the user writes their own prompt for the scenario and gets scored on which skills they applied.

**Scenario categories:**
1. Vague vs. specific requests (binary questions, keyword-style queries, missing context)
2. Context-setting and role framing (who you are, what you need, what "good" looks like)
3. Iterative refinement and follow-up (reviewing output, giving specific feedback, steering)
4. Smart strategies (few-shot examples, structured prompts, role-switching)

### Feature 2: Write Your Own (Freeform practice)

The user picks a scenario and writes their own prompt from scratch. A client-side heuristic scorer detects which communication principles are present and which are missing, providing instant feedback. The user can then copy their prompt and try it in any real AI tool.

### Feature 3: Communication principle tracker

Each scenario maps to one or more of 8 communication principles:

- **Be specific, not vague** — Ask for exactly what you want
- **Provide context** — Who you are, what you're working on, what constraints exist
- **State your intent** — What you'll use the result for
- **Avoid ambiguity** — Don't use questions that can be answered with yes/no when you want information
- **Show what "good" looks like** — Give examples of the format or style you want
- **Iterate with specific feedback** — Tell the AI what's wrong, not just that it's wrong
- **Ask the AI to ask you questions** — Let it interview you instead of guessing what it needs
- **Ask the AI to write prompts for you** — Once direction is established, let it crystallize the prompt

The tool tracks which principles the user has practiced and recommends what to try next.

### Feature 4: Copy-to-real-AI workflow

Every scenario includes:
- A **Copy** button for the user's prompt
- Direct links to **ChatGPT**, **Claude**, **Gemini**, and **Copilot**

Users practice the skill in PromptBridge, then immediately test it in a real AI tool.

### Feature 5: Skill Assessment

Pre/post assessments with different scenario sets let users measure improvement over time. Heuristic scoring provides objective before-and-after comparison.

---

## What this is NOT

- Not a prompt library or template repository
- Not a chatbot — users don't have open-ended conversations with an AI
- Not specific to any one AI provider
- Not a Chrome extension or browser plugin (it's a standalone web app)
- Not a replacement for actually using AI tools — it's training wheels that build skills users take elsewhere

---

## Success criteria

1. A first-time user can complete one guided scenario in under 3 minutes
2. The side-by-side response comparison makes the user say "oh, I see the difference"
3. The feedback is specific enough that the user knows exactly what to change
4. The tool works entirely in a browser with no signup, no API key, and no setup
5. Users copy prompts from the tool and use them in real AI tools

---

## Open source details

- **License:** AGPL-3.0 (ensures derivative works remain open)
- **Repository:** GitHub (public)
- **Contributions:** Welcome — especially scenario contributions and translations
- **Attribution:** Credit NeuroBridge (Haroon et al., ASSETS 2025) as the inspiration
