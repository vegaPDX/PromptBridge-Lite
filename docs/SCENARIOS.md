# PromptBridge — Scenario Library

This document defines the scenario categories and specific scenarios for v1. Each scenario is a self-contained learning unit that teaches one or more communication principles through interactive practice.

Techniques are sourced from prompting best practices documented by Anthropic, OpenAI, and Google — but taught in an AI-agnostic, jargon-free way.

---

## Communication principles (the skills we teach)

Every scenario maps to one or more of these principles:

| ID | Principle | One-line description |
|----|-----------|---------------------|
| P1 | Be specific, not vague | Ask for exactly what you want — not a topic, not a keyword |
| P2 | Provide context | Tell the AI who you are, what you're working on, what constraints exist |
| P3 | State your intent | Explain what you'll use the result for |
| P4 | Avoid ambiguity | Don't use yes/no questions when you want information |
| P5 | Show what "good" looks like | Provide examples of the format, tone, or style you want |
| P6 | Give specific feedback | Tell the AI what's wrong and how to fix it, not just "try again" |
| P7 | Ask the AI to ask you questions | Let it interview you instead of guessing what it needs |
| P8 | Ask the AI to write prompts for you | Once a plan is worked out, let the AI crystallize it |

---

## Category 1: Vague vs. Specific Requests (8 guided scenarios)

**What this teaches:** The difference between treating AI like a search engine (keywords) and treating it like a knowledgeable colleague (full requests with context).

**Sources:** Anthropic's "Be clear and direct" principle; OpenAI's Strategy 1 "Write clear instructions"; Google's "Precision and specificity" technique.

### Scenario 1.1 — "The snow shoveling problem"

**Situation:** It snowed heavily overnight. You need to clear your driveway before work and you want to do it efficiently.

**This is the landing page demo scenario.**

**Principle:** P1 (Be specific), P4 (Avoid ambiguity)

**Feedback notes:** Focus on binary question pattern (P4) and the difference between keyword search and actual requests (P1). The "Do you know" construction is one of the most common ineffective patterns. *(Documented across all three providers as the most basic prompting mistake.)*

---

### Scenario 1.2 — "The meal plan"

**Situation:** You want to eat healthier this week but you're short on time. You'd like some dinner ideas.

**Principle:** P1 (Be specific), P2 (Provide context)

**Feedback notes:** Highlight how adding constraints (time, preferences, format) transforms generic lists into usable plans. *(Google's documentation emphasizes that "Gemini favors directness" — this applies universally.)*

---

### Scenario 1.3 — "The error message"

**Situation:** You got a 403 Forbidden error when trying to access your company's internal dashboard. It worked fine yesterday.

**Principle:** P1 (Be specific), P2 (Provide context), P3 (State your intent)

**Feedback notes:** Show how context about what changed (or didn't) helps the AI narrow down causes instead of listing every possibility. *(OpenAI's "include details in your query" sub-tactic.)*

---

### Scenario 1.4 — "The email draft"

**Situation:** You need to write an email to your manager about a project delay. The Q2 report will be 3 days late because you're waiting on data from the finance team.

**Principle:** P1 (Be specific), P2 (Provide context), P3 (State your intent), P5 (Show what "good" looks like)

**Feedback notes:** Emphasize how specifying recipient, tone, reason, and length transforms a generic email into one that's actually sendable. *(OpenAI's "specify the desired length" sub-tactic.)*

---

### Scenario 1.5 — "The product comparison"

**Situation:** You want to buy a new laptop for work and personal use, and you need help deciding what to get. Your budget is around $1,200.

**Principle:** P1 (Be specific), P4 (Avoid ambiguity)

**Feedback notes:** Highlight how "what's the best laptop?" gives the AI nothing to work with — there is no "best" without knowing budget, use case, screen size preference, and priorities (battery life vs. performance vs. weight). *(Google: "Vague goals produce vague deliverables.")*

---

### Scenario 1.6 — "The recipe request"

**Situation:** You want to cook dinner tonight but you're tired and don't want to go to the store. You have chicken, rice, some vegetables, and basic pantry staples.

**Principle:** P1 (Be specific), P2 (Provide context)

**Feedback notes:** Show how providing ingredients on hand, time available, and skill level turns a generic recipe list into a practical meal you can actually make tonight. *(All three providers document this pattern: constraints make outputs actionable.)*

---

### Scenario 1.7 — "The travel recommendation"

**Situation:** You and a friend are planning a long weekend trip sometime in the next two months and want destination ideas. You have a rough budget but aren't sure where to go.

**Principle:** P1 (Be specific), P2 (Provide context), P3 (State your intent)

**Feedback notes:** Show how budget, travel dates, interests, group size, and distance preferences transform "where should I go?" into targeted, bookable recommendations. *(OpenAI's "include details in your query" — every missing detail forces the AI to guess.)*

---

### Scenario 1.8 — "The meeting summary"

**Situation:** You just finished a 45-minute team meeting and have messy handwritten notes. You need to send a clear summary to your team, but your notes are scattered and disorganized.

**Principle:** P1 (Be specific), P5 (Show what "good" looks like)

**Feedback notes:** Show how specifying the summary format (action items, decisions, key discussion points) and audience produces a much more useful result than "summarize this." *(Google: "specify the output format" is a major lever for quality.)*

---

## Category 2: Context & Framing (8 guided scenarios)

**What this teaches:** How providing information about yourself, your audience, and your goal dramatically changes the quality of AI output.

**Sources:** Anthropic's "Add context / explain the why" technique; OpenAI's "Provide reference text" strategy and persona tactics; Google's role prompting and context injection patterns.

### Scenario 2.1 — "Explain this concept"

**Situation:** You're 25 years old, just opened your first retirement account, and need to understand how compound interest works. You don't have a finance background.

**Principle:** P2 (Provide context), P3 (State your intent), P5 (Show what "good" looks like)

**Feedback notes:** Show how telling the AI about your knowledge level and purpose produces an explanation calibrated to you, not a textbook definition. *(All three providers emphasize this: context about the user's level transforms explanations.)*

---

### Scenario 2.2 — "The audience mismatch"

**Situation:** Your company's main database was down for 2 hours this morning, affecting customer-facing services. You need to communicate about the outage — but different people need different messages.

**Principle:** P2 (Provide context), P3 (State your intent)

**Feedback notes:** The key insight: the SAME event requires completely different messages depending on your audience. Context about WHO you're writing for is as important as WHAT you're writing about. *(Google calls this the "audience mismatch" problem. OpenAI's persona tactic addresses the same issue.)*

---

### Scenario 2.3 — "The presentation helper"

**Situation:** You need to prepare a 10-minute presentation for your VP and directors about a customer migration project. You've moved 340 of 500 accounts, you're on track to finish by June, and the main risk is a legacy system deprecation in April.

**Principle:** P1 (Be specific), P2 (Provide context), P3 (State your intent)

**Feedback notes:** Highlight how specifying the audience's priorities (timeline, risk, asks) shapes the AI's output more than describing the topic. *(Anthropic: "The 'new employee' model" — give the AI all the context it needs to do the job.)*

---

### Scenario 2.4 — "The role switch"

**Situation:** You're thinking about buying your first home and need to understand how a mortgage works — the process, costs, and what to watch out for.

**Principle:** P2 (Provide context), P5 (Show what "good" looks like)

**Feedback notes:** Show how "explain mortgages" produces a Wikipedia-style overview, while "I'm a first-time buyer with no real estate experience — explain this like a patient advisor walking me through my first meeting" produces a warm, practical, beginner-friendly guide. *(All three providers document role prompting as a core technique. Anthropic: "Even a single sentence of role-setting makes a measurable difference.")*

---

### Scenario 2.5 — "The cover letter"

**Situation:** You found a job posting you're excited about and want help writing a cover letter. You have the posting details and your relevant experience.

**Principle:** P2 (Provide context), P3 (State your intent)

**Feedback notes:** Show how pasting the actual job posting details and key resume highlights into the prompt vs. just saying "write a cover letter" produces a tailored letter vs. a generic template. *(OpenAI's "Provide reference text" strategy — grounding the AI in actual source material eliminates generic filler.)*

---

### Scenario 2.6 — "The tone mismatch"

**Situation:** Your team's work schedule is changing next month — meetings are moving from Monday mornings to Wednesday afternoons. You need to tell your team (casual Slack message) and also notify the broader department (professional email).

**Principle:** P2 (Provide context), P5 (Show what "good" looks like)

**Feedback notes:** Show how the SAME information needs completely different treatment depending on the audience and channel. Specifying tone and medium is as important as specifying content. *(Anthropic: "explain the why" — when you tell the AI the channel is Slack, it understands the norms.)*

---

### Scenario 2.7 — "The format request"

**Situation:** You read a long article about productivity techniques and want to capture the main ideas. You just need the key takeaways in a format you can quickly reference later.

**Principle:** P1 (Be specific), P5 (Show what "good" looks like)

**Feedback notes:** Show how "summarize this article" produces a wall of text, while specifying format (5 bullet points, a comparison table, numbered takeaways with one sentence each) produces something actually scannable and useful. *(Google explicitly documents "specify the output format" as a standalone technique.)*

---

### Scenario 2.8 — "Explain the why"

**Situation:** You run a bakery's social media account. You need AI-generated posts that are warm, use food emojis, mention your location (Portland), and always end with your tagline. But just listing these rules doesn't always capture the spirit of what you want.

**Principle:** P2 (Provide context), P3 (State your intent)

**Feedback notes:** Show how explaining WHY behind a rule ("we use food emojis because our Instagram audience responds best to visual, casual content") helps the AI generalize and get the spirit right, not just the letter. The AI will also avoid things that conflict with the spirit even if you didn't think to mention them. *(Anthropic specifically documents this: "Rules with reasons are followed better than bare rules, because the AI can generalize intelligently from the reasoning.")*

---

## Category 3: Iterative Refinement (7 guided scenarios)

**What this teaches:** How to review AI output and steer it toward what you actually want through specific feedback. Also teaches power techniques: asking the AI to interview you, having it write prompts for you, and using positive instructions.

**Sources:** Anthropic's chain-prompts and self-correction loop; OpenAI's "Give the model time to think" and positive framing patterns; Google's iterative refinement strategies and positive instruction technique.

### Scenario 3.1 — "The vague rejection"

**Situation:** You asked an AI to draft an email for you. The draft is factually correct but way too formal — you're writing to a colleague you work with every day, not a client. You need to give the AI feedback to fix it.

**Principle:** P6 (Give specific feedback)

**Feedback notes:** Show that "try again" gives the AI nothing to work with. Specific feedback about what's right, what's wrong, and what to change produces targeted improvements. *(All three providers document this: specificity in feedback matters as much as specificity in initial requests.)*

---

### Scenario 3.2 — "Let the AI interview you"

**Situation:** You want to plan a team offsite for 8 people but you're not sure where to start. You have a rough budget and some ideas but haven't thought through all the details.

**Principle:** P7 (Ask the AI to ask you questions)

**Feedback notes:** This teaches a powerful technique: instead of guessing what information the AI needs, ask it to interview you. It will ask about things you might not have thought to mention — dietary restrictions, accessibility needs, weather preferences. *(Anthropic and Google both document this as an advanced technique that consistently produces better results.)*

---

### Scenario 3.3 — "Have the AI write your prompt"

**Situation:** You've been going back and forth with an AI about your weekly meal prep routine. After several messages, you've worked out exactly what you want — high-protein, 30-minute cook times, budget-friendly ingredients, with lunch leftovers. Now you want to save this as a reusable request you can use every week.

**Principle:** P8 (Ask the AI to write prompts for you)

**Feedback notes:** After working out the details through conversation, the AI can crystallize everything into a structured, reusable request that captures constraints you might forget to include next time. *(OpenAI's prompt generation guide documents this pattern. The AI's version is often more structured and complete than what you'd write yourself.)*

---

### Scenario 3.4 — "The 'try again' trap"

**Situation:** You asked an AI to write a product description for your handmade candles. The result is accurate but reads like a corporate press release — stiff, buzzwordy, and nothing like your brand voice.

**Principle:** P6 (Give specific feedback)

**Feedback notes:** Show the dramatic contrast between "That's not right, try again" (AI guesses randomly what to change, often produces something equally wrong but differently wrong) vs. specific feedback identifying what's wrong and what the brand voice should sound like ("I want it warm and personal, like I'm telling a friend about my favorite candle"). *(OpenAI: "Be explicit about what you DO want" — positive direction beats negative rejection.)*

---

### Scenario 3.5 — "The scope creep"

**Situation:** You asked for book recommendations and got a list of 20 books with paragraph-long descriptions for each. Way too much — you wanted a short, focused list you could actually use.

**Principle:** P1 (Be specific), P6 (Give specific feedback)

**Feedback notes:** Show how "make it shorter" doesn't tell the AI what to cut. Specific feedback like "give me your top 5 only, one sentence each, focused on [specific genre or preference]" gets exactly what you want. *(OpenAI's "specify the desired length" and Google's iteration strategy both address this.)*

---

### Scenario 3.6 — "The draft-review-refine"

**Situation:** You need to write a thank-you email after a job interview. Instead of trying to get a perfect email in one shot, you want to take a multi-step approach.

**Principle:** P6 (Give specific feedback), P8 (Ask the AI to write prompts for you)

**Feedback notes:** Show how asking for a draft first, then asking the AI to review it against criteria ("check the tone — is it grateful without being desperate?"), then refining based on that review produces better results than one monolithic request. *(Anthropic calls this the "self-correction loop" — the most common chained prompt pattern. OpenAI: "Split complex tasks into simpler subtasks.")*

---

### Scenario 3.7 — "The positive flip"

**Situation:** Every time you ask an AI for help writing something, it adds bullet points, markdown formatting, disclaimers, and unnecessary introductions. You just want clean, natural prose.

**Principle:** P1 (Be specific), P6 (Give specific feedback)

**Feedback notes:** Show how "don't use bullet points, don't add disclaimers, don't add headers" is less effective than "write in flowing prose paragraphs, get straight to the content, use a confident and direct tone." Telling the AI what TO do is more effective than listing what NOT to do. *(Anthropic explicitly documents this: "Tell the AI what TO DO rather than what NOT to do." Google's whitepaper lists "Use positive instructions" as a core technique. OpenAI found that negative framing like "DO NOT" often still triggered the unwanted behavior.)*

---

## Category 4: Smart Strategies (7 guided scenarios)

**What this teaches:** Powerful techniques that go beyond the basics — step-by-step reasoning, task decomposition, showing examples, structuring complex requests, and self-verification. These are techniques highlighted across all three major AI providers' documentation as significant quality multipliers.

**Sources:** Anthropic's "Let Claude think" and structured prompting; OpenAI's "Give the model time to think" and few-shot strategies; Google's chain-of-thought prompting and task decomposition.

### Scenario 4A.1 — "The step-by-step thinker"

**Situation:** You and four friends went out to dinner. The bill is $187. Three people had the steak special ($38 each), two shared an appetizer ($16), one person didn't drink but the rest split two bottles of wine ($45 each). You need to figure out what each person owes.

**Principle:** P1 (Be specific)

**Feedback notes:** Show how "split this bill" gives a rough per-person average that's unfair, while "work through this step by step before giving me the final amounts" produces accurate, verified math with clear reasoning you can check. *(All three providers document chain-of-thought as a major accuracy booster. Google found Gemini Ultra's reasoning accuracy jumped from 84% to 90% with this technique.)*

---

### Scenario 4A.2 — "The task breakdown"

**Situation:** You're planning a surprise birthday party for a friend — venue, food, decorations, guest list, timeline. It's a lot to organize all at once.

**Principle:** P1 (Be specific), P3 (State your intent)

**Feedback notes:** Show how one massive "plan a birthday party" request produces a generic checklist, while breaking it into focused steps ("first, help me choose a venue — here are my constraints") produces detailed, actionable results for each part that you can review before moving on. *(OpenAI: "Split complex tasks into simpler subtasks" is a full strategy. Google: "Research, strategy, structure, and copy should be separate requests, not one massive prompt.")*

---

### Scenario 4A.3 — "The few-shot example"

**Situation:** You sell handmade jewelry on Etsy and need to write product descriptions for 10 new items. You have a specific style you like — short, warm, and focused on the story behind each piece — but it's hard to put into words.

**Principle:** P5 (Show what "good" looks like)

**Feedback notes:** Show how "write product descriptions for my jewelry" produces generic marketing copy, while showing 2-3 examples of descriptions you like gives the AI a pattern to follow. The examples speak louder than any description of the style. *(Anthropic: examples are "one of the most reliable ways to steer output format, tone, and structure." OpenAI documents few-shot learning as a core tactic. Google: "Prompts without few-shot examples are likely to be less effective.")*

---

### Scenario 4A.4 — "The structured prompt"

**Situation:** You want help planning a weekly workout routine. You have specific goals (build upper body strength, improve cardio), constraints (3 days per week, 45 minutes max, home gym with dumbbells and a pull-up bar), and a history of shoulder injury on your left side.

**Principle:** P1 (Be specific), P2 (Provide context), P5 (Show what "good" looks like)

**Feedback notes:** Show how dumping all this info into one rambling paragraph leads to the AI missing important details (like the shoulder injury), while organizing it into clear sections (goals, schedule, equipment, medical notes) ensures nothing gets lost and the AI addresses every constraint. *(Anthropic: "Use clear formatting — XML tags, section headers, delimiters." Google's recommended prompt template uses labeled sections. OpenAI: "Use delimiters to clearly indicate distinct parts of the input.")*

---

### Scenario 4A.5 — "The self-check"

**Situation:** You're using an AI to help you proofread an important email to a client. You want to make sure there are no factual errors, awkward phrasing, or tone issues before you send it.

**Principle:** P1 (Be specific)

**Feedback notes:** Show how "proofread this" gives a surface-level pass, while "proofread this email, then review your own corrections — flag anything you're not confident about and explain your reasoning for each change" catches errors the AI might otherwise introduce. Asking the AI to verify its own work is a simple technique that significantly improves reliability. *(Anthropic: "Ask the AI to self-check before finalizing." OpenAI: "Instruct the model to work out its own solution before concluding." Google documents self-critique as an extension of chain-of-thought.)*

---

### Scenario 4A.6 — "Same question, different expert"

**Situation:** Your knee has been hurting after your morning runs. You want advice, but the kind of advice depends on who you ask.

**Principle:** P2 (Provide context), P5 (Show what "good" looks like)

**Feedback notes:** Show how the same question ("my knee hurts when I run") produces fundamentally different advice depending on the expert role you assign: a doctor focuses on diagnosis and warning signs, a running coach focuses on form and training errors, a physical therapist focuses on stretches and strengthening exercises. This teaches that the "who you're asking" matters as much as "what you're asking." *(All three providers document role/persona assignment. Anthropic: "Even a single sentence of role-setting makes a measurable difference." Google calls this "role prompting.")*

---

### Scenario 4A.7 — "The document detective"

**Situation:** You have a long rental lease agreement and need to quickly find answers about the pet policy, security deposit rules, and what happens if you need to break the lease early.

**Principle:** P2 (Provide context), P3 (State your intent)

**Feedback notes:** Show how "summarize my lease" gives a broad overview that might miss what you need, while providing the document and then asking specific questions at the end ("Based on this lease, answer these three questions: 1) Can I have a cat? 2) How much is the security deposit and when do I get it back? 3) What's the penalty for breaking the lease early?") produces targeted, accurate answers. *(Anthropic: "Put longform data at the top, queries at the bottom — this can improve response quality by up to 30%." OpenAI's "Provide reference text" strategy. Google: place specific questions after context, using bridge phrases like "Based on the information above.")*

---

## Category 5: The Full Conversation Loop (free-form only)

**What this teaches:** Combining all skills in a realistic multi-turn scenario. These scenarios are only available in Free-form Mode because they require the user to write and iterate, not just pick options.

**Principles covered:** All (P1–P8)

### Scenario 5.1 — "Daily work planner"

**Situation:** You want an AI to help you create a prioritized to-do list for today. You have emails to catch up on, a project deadline Friday, a 1-on-1 meeting to prep for, and some Slack messages to follow up on.

**Principle:** Full loop — P1, P2, P3, P5, P6

---

### Scenario 5.2 — "Customer escalation response"

**Situation:** A customer's account team has emailed asking why a data sync hasn't completed. The sync is delayed because of a database migration that took longer than expected. You need to draft both an internal update for your team and a customer-facing response.

**Principle:** Full loop — P1, P2, P3, P5, P6, P7, P8

---

### Scenario 5.3 — "Meeting prep brief"

**Situation:** You have a meeting in 30 minutes with a customer you haven't spoken to in 2 weeks. You need to quickly get up to speed on open issues, recent activity, and action items so you're not caught off guard.

**Principle:** P1, P2, P3, P5, P6

---

## Scenario data format (JSON)

Each scenario is stored as a JSON file. Here's the schema:

```json
{
  "id": "1.1-snow-shoveling",
  "category": "vague_vs_specific",
  "title": "The snow shoveling problem",
  "situation": "It snowed heavily overnight...",
  "mode": "guided",
  "principles": ["P1", "P4"],
  "feedback_notes": "Focus on binary question pattern..."
}
```

For free-form scenarios, the format is:

```json
{
  "id": "5.1-daily-planner",
  "category": "full_conversation_loop",
  "title": "Daily work planner",
  "situation": "You want to create a daily to-do list...",
  "mode": "freeform",
  "principles": ["P1", "P2", "P3", "P5", "P6"]
}
```

---

## v1 scope

For the initial release, target **30 guided scenarios** across 4 categories and **3 free-form scenarios** (category 5). This covers all 8 principles extensively and provides a meaningful learning path from basic specificity through advanced techniques.

### Scenario coverage by principle

| Principle | Scenarios covering it |
|-----------|----------------------|
| P1 — Be specific | 1.1–1.8, 2.7, 3.5, 3.7, 4A.1, 4A.2, 4A.4, 4A.5 (15 scenarios) |
| P2 — Provide context | 1.2, 1.3, 1.6, 1.7, 2.1–2.8, 4A.4, 4A.6, 4A.7 (14 scenarios) |
| P3 — State your intent | 1.3, 1.4, 1.7, 2.1–2.3, 2.5, 2.8, 4A.2, 4A.7 (10 scenarios) |
| P4 — Avoid ambiguity | 1.1, 1.5 (2 scenarios) |
| P5 — Show what "good" looks like | 1.4, 1.8, 2.1, 2.4, 2.6, 2.7, 4A.3, 4A.4, 4A.6 (9 scenarios) |
| P6 — Give specific feedback | 3.1, 3.4–3.7 (5 scenarios) |
| P7 — Ask AI to ask questions | 3.2 (1 scenario + free-form) |
| P8 — Ask AI to write prompts | 3.3, 3.6 (2 scenarios) |

Additional scenarios can be contributed by the community after launch.
