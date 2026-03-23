# PromptBridge — Project Specification

## Working name: PromptBridge (open to change)

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

4. **Two learning modes.** Guided mode (pick from 3 options) for beginners who need scaffolding. Free-form mode (write your own, get feedback) for practice and skill-building.

5. **Open source and free.** No subscriptions, no paywalls. The tool should be accessible to anyone who wants to learn.

6. **No jargon.** The tool never uses terms like "prompt engineering," "tokens," "context window," or "system prompt" in user-facing content. It uses plain language: "how to talk to AI tools," "giving context," "being specific."

---

## Core features (v1)

### Feature 1: Scenario-based learning (Guided Mode)

The user is presented with a real-world scenario (e.g., "You need help planning a team meeting agenda"). The tool generates three prompt options — ranging from vague/ineffective to clear/effective. The user picks the one they think will get the best result. The tool then shows:

- A **simulated AI response** to the WORST option (vague, unhelpful, generic)
- A **simulated AI response** to the BEST option (specific, tailored, useful)
- **Feedback** explaining WHY one worked and the other didn't, tied to a specific communication principle

**Scenario categories:**
1. Vague vs. specific requests (binary questions, keyword-style queries, missing context)
2. Context-setting and role framing (who you are, what you need, what "good" looks like)
3. Iterative refinement and follow-up (reviewing output, giving specific feedback, steering)
4. The full conversation loop (combining all skills in a multi-turn flow)

### Feature 2: Free-form practice mode

The user picks a scenario category and writes their own prompt from scratch. The tool:

1. Shows a simulated AI response to their prompt (as-written)
2. Analyzes the prompt and identifies what's strong and what could be improved
3. Suggests a refined version
4. Shows a simulated AI response to the refined version — side by side with the original

This mode is for users who've completed some guided scenarios and want to practice on their own.

### Feature 3: Communication principle tracker

Each scenario and feedback message maps to one or more communication principles:

- **Be specific, not vague** — Ask for exactly what you want
- **Provide context** — Who you are, what you're working on, what constraints exist
- **State your intent** — What you'll use the result for
- **Avoid ambiguity** — Don't use questions that can be answered with yes/no when you want information
- **Show what "good" looks like** — Give examples of the format or style you want
- **Iterate with specific feedback** — Tell the AI what's wrong, not just that it's wrong
- **Ask the AI to ask you questions** — Let it interview you instead of guessing what it needs
- **Ask the AI to write prompts for you** — Once direction is established, let it crystallize the prompt

The tool tracks which principles the user has practiced and which they haven't. This isn't gamification — it's a way for the user to see their coverage and know what to try next.

### Feature 4: The "snow shoveling" demo

A prominent, instantly accessible demo on the landing page that shows the core concept without requiring signup or any interaction:

**Bad prompt:** "Do you know how to shovel snow faster?"
**AI response:** "Yes."

**Good prompt:** "Tell me 5 ways I can speed up shoveling snow in the morning."
**AI response:** [5 specific, actionable suggestions]

This demo should make the concept click in under 5 seconds. It's the hook that gets people to try the tool.

---

## What this is NOT

- Not a prompt library or template repository
- Not a chatbot — users don't have open-ended conversations with an AI
- Not specific to any one AI provider
- Not a Chrome extension or browser plugin (it's a standalone web app)
- Not a replacement for actually using AI tools — it's training wheels that build skills users take elsewhere

---

## Success criteria for v1

A working prototype is successful if:

1. A first-time user can complete one guided scenario in under 3 minutes
2. The side-by-side response comparison makes the user say "oh, I see the difference"
3. The feedback is specific enough that the user knows exactly what to change
4. The tool works entirely in a browser with no signup required (for local/demo use)
5. The LLM integration is clean enough that swapping Claude for another API is straightforward

---

## Open source details

- **License:** MIT (permissive, allows anyone to use, modify, distribute)
- **Repository:** GitHub (public)
- **Contributions:** Welcome — especially scenario contributions and translations
- **Attribution:** Credit NeuroBridge (Haroon et al., ASSETS 2025) as the inspiration in the README and about page
