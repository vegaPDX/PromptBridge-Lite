import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronRight, Check, X, MessageSquare, Loader2,
  RefreshCw, Target, Lightbulb, Zap, AlertCircle, Home,
  Sparkles, Eye, Users, HelpCircle, PenTool, Send,
  Award, ArrowLeft, ArrowRight, BookOpen, BarChart3
} from "lucide-react";
import _ from "lodash";

// ============================================================
// CONSTANTS — Communication Principles
// ============================================================

const PRINCIPLES = [
  { id: "P1", name: "Be specific, not vague", description: "Ask for exactly what you want — not a topic, not a keyword", icon: Target },
  { id: "P2", name: "Provide context", description: "Tell the AI who you are, what you're working on, what constraints exist", icon: Users },
  { id: "P3", name: "State your intent", description: "Explain what you'll use the result for", icon: Lightbulb },
  { id: "P4", name: "Avoid ambiguity", description: "Don't use yes/no questions when you want information", icon: AlertCircle },
  { id: "P5", name: "Show what 'good' looks like", description: "Provide examples of the format, tone, or style you want", icon: Eye },
  { id: "P6", name: "Give specific feedback", description: "Tell the AI what's wrong and how to fix it, not just 'try again'", icon: PenTool },
  { id: "P7", name: "Ask the AI to ask you questions", description: "Let it interview you instead of guessing what it needs", icon: HelpCircle },
  { id: "P8", name: "Ask the AI to write prompts for you", description: "Once direction is established, let it crystallize the prompt", icon: Sparkles },
];

const PRINCIPLE_MAP = Object.fromEntries(PRINCIPLES.map(p => [p.id, p]));

// ============================================================
// CONSTANTS — Categories
// ============================================================

const CATEGORIES = {
  vague_vs_specific: { label: "Vague vs. Specific", description: "Learn the difference between keyword searches and clear requests", icon: Target, color: "blue" },
  context_and_framing: { label: "Context & Framing", description: "How sharing your background transforms AI responses", icon: Users, color: "purple" },
  iterative_refinement: { label: "Iterative Refinement", description: "Steer AI responses with specific feedback and smart techniques", icon: RefreshCw, color: "teal" },
  smart_strategies: { label: "Smart Strategies", description: "Power techniques that level up your results — step-by-step thinking, examples, and more", icon: Sparkles, color: "rose" },
  full_conversation_loop: { label: "Full Conversation Loop", description: "Combine all skills in realistic scenarios", icon: Zap, color: "amber" },
};

// ============================================================
// CONSTANTS — Scenarios
// ============================================================

const SCENARIOS = [
  // ── Category 1: Vague vs. Specific (8 scenarios) ──────────────
  {
    id: "1.1-snow-shoveling",
    category: "vague_vs_specific",
    title: "The snow shoveling problem",
    situation: "It snowed heavily overnight. You need to clear your driveway before work and you want to do it efficiently.",
    mode: "guided",
    principles: ["P1", "P4"],
    feedbackNotes: "Focus on binary question pattern (P4) and the difference between keyword search and actual requests (P1). The 'Do you know' construction is one of the most common ineffective patterns.",
  },
  {
    id: "1.2-meal-plan",
    category: "vague_vs_specific",
    title: "The meal plan",
    situation: "You want to eat healthier this week but you're short on time. You'd like some dinner ideas.",
    mode: "guided",
    principles: ["P1", "P2"],
    feedbackNotes: "Highlight how adding constraints (time, preferences, format) transforms generic lists into usable plans.",
  },
  {
    id: "1.3-error-message",
    category: "vague_vs_specific",
    title: "The error message",
    situation: "You got a 403 Forbidden error when trying to access your company's internal dashboard. It worked fine yesterday.",
    mode: "guided",
    principles: ["P1", "P2", "P3"],
    feedbackNotes: "Show how context about what changed (or didn't) helps the AI narrow down causes instead of listing every possibility.",
  },
  {
    id: "1.4-email-draft",
    category: "vague_vs_specific",
    title: "The email draft",
    situation: "You need to write an email to your manager about a project delay. The Q2 report will be 3 days late because you're waiting on data from the finance team.",
    mode: "guided",
    principles: ["P1", "P2", "P3", "P5"],
    feedbackNotes: "Emphasize how specifying recipient, tone, reason, and length transforms a generic email into one that's actually sendable.",
  },
  {
    id: "1.5-product-comparison",
    category: "vague_vs_specific",
    title: "The product comparison",
    situation: "You want to buy a new laptop for work and personal use, and you need help deciding what to get. Your budget is around $1,200.",
    mode: "guided",
    principles: ["P1", "P4"],
    feedbackNotes: "Highlight how 'what's the best laptop?' gives the AI nothing to work with — there is no 'best' without knowing budget, use case, screen size preference, and priorities (battery vs. performance vs. weight). Source: Google emphasizes 'vague goals produce vague deliverables.'",
  },
  {
    id: "1.6-recipe-request",
    category: "vague_vs_specific",
    title: "The recipe request",
    situation: "You want to cook dinner tonight but you're tired and don't want to go to the store. You have chicken, rice, some vegetables, and basic pantry staples.",
    mode: "guided",
    principles: ["P1", "P2"],
    feedbackNotes: "Show how providing ingredients on hand, time available, and skill level turns a generic recipe list into a practical meal you can actually make tonight. All three providers document this: constraints make outputs actionable.",
  },
  {
    id: "1.7-travel-recommendation",
    category: "vague_vs_specific",
    title: "The travel recommendation",
    situation: "You and a friend are planning a long weekend trip sometime in the next two months and want destination ideas. You have a rough budget but aren't sure where to go.",
    mode: "guided",
    principles: ["P1", "P2", "P3"],
    feedbackNotes: "Show how budget, travel dates, interests, group size, and distance preferences transform 'where should I go?' into targeted, bookable recommendations. Source: OpenAI's 'include details in your query' — every missing detail forces the AI to guess.",
  },
  {
    id: "1.8-meeting-summary",
    category: "vague_vs_specific",
    title: "The meeting summary",
    situation: "You just finished a 45-minute team meeting and have messy handwritten notes. You need to send a clear summary to your team, but your notes are scattered and disorganized.",
    mode: "guided",
    principles: ["P1", "P5"],
    feedbackNotes: "Show how specifying the summary format (action items, decisions, key discussion points) and audience produces a much more useful result than 'summarize this.' Source: Google documents 'specify the output format' as a major lever for quality.",
  },

  // ── Category 2: Context & Framing (8 scenarios) ───────────────
  {
    id: "2.1-compound-interest",
    category: "context_and_framing",
    title: "Explain this concept",
    situation: "You're 25 years old, just opened your first retirement account, and need to understand how compound interest works. You don't have a finance background.",
    mode: "guided",
    principles: ["P2", "P3", "P5"],
    feedbackNotes: "Show how telling the AI about your knowledge level and purpose produces an explanation calibrated to you, not a textbook definition.",
  },
  {
    id: "2.2-audience-mismatch",
    category: "context_and_framing",
    title: "The audience mismatch",
    situation: "Your company's main database was down for 2 hours this morning, affecting customer-facing services. You need to communicate about the outage — but different people need different messages.",
    mode: "guided",
    principles: ["P2", "P3"],
    feedbackNotes: "The key insight: the SAME event requires completely different messages depending on your audience. Context about WHO you're writing for is as important as WHAT you're writing about.",
  },
  {
    id: "2.3-presentation-helper",
    category: "context_and_framing",
    title: "The presentation helper",
    situation: "You need to prepare a 10-minute presentation for your VP and directors about a customer migration project. You've moved 340 of 500 accounts, you're on track to finish by June, and the main risk is a legacy system deprecation in April.",
    mode: "guided",
    principles: ["P1", "P2", "P3"],
    feedbackNotes: "Highlight how specifying the audience's priorities (timeline, risk, asks) shapes the AI's output more than describing the topic.",
  },
  {
    id: "2.4-role-switch",
    category: "context_and_framing",
    title: "The role switch",
    situation: "You're thinking about buying your first home and need to understand how a mortgage works — the process, costs, and what to watch out for.",
    mode: "guided",
    principles: ["P2", "P5"],
    feedbackNotes: "Show how 'explain mortgages' produces a Wikipedia-style overview, while 'I'm a first-time buyer with no real estate experience — explain this like a patient advisor' produces a warm, practical guide. Source: All three providers document role prompting. Anthropic: 'Even a single sentence of role-setting makes a measurable difference.'",
  },
  {
    id: "2.5-cover-letter",
    category: "context_and_framing",
    title: "The cover letter",
    situation: "You found a job posting you're excited about and want help writing a cover letter. You have the posting details and your relevant experience.",
    mode: "guided",
    principles: ["P2", "P3"],
    feedbackNotes: "Show how pasting the actual job posting details and key resume highlights into the request vs. just saying 'write a cover letter' produces a tailored letter vs. a generic template. Source: OpenAI's 'Provide reference text' strategy — grounding the AI in actual source material eliminates generic filler.",
  },
  {
    id: "2.6-tone-mismatch",
    category: "context_and_framing",
    title: "The tone mismatch",
    situation: "Your team's work schedule is changing next month — meetings are moving from Monday mornings to Wednesday afternoons. You need to tell your team (casual Slack message) and also notify the broader department (professional email).",
    mode: "guided",
    principles: ["P2", "P5"],
    feedbackNotes: "Show how the SAME information needs completely different treatment depending on audience and channel. Specifying tone and medium is as important as specifying content. Source: Anthropic's 'explain the why' — when you tell the AI the channel is Slack, it understands the norms.",
  },
  {
    id: "2.7-format-request",
    category: "context_and_framing",
    title: "The format request",
    situation: "You read a long article about productivity techniques and want to capture the main ideas. You just need the key takeaways in a format you can quickly reference later.",
    mode: "guided",
    principles: ["P1", "P5"],
    feedbackNotes: "Show how 'summarize this article' produces a wall of text, while specifying format (5 bullet points, a comparison table, numbered takeaways) produces something actually scannable and useful. Source: Google explicitly documents 'specify the output format' as a standalone technique.",
  },
  {
    id: "2.8-explain-the-why",
    category: "context_and_framing",
    title: "Explain the why",
    situation: "You run a bakery's social media account. You need AI-generated posts that are warm, use food emojis, mention your location (Portland), and always end with your tagline. But just listing these rules doesn't always capture what you want.",
    mode: "guided",
    principles: ["P2", "P3"],
    feedbackNotes: "Show how explaining WHY behind a rule ('we use food emojis because our Instagram audience responds to visual, casual content') helps the AI generalize and get the spirit right, not just the letter. Source: Anthropic: 'Rules with reasons are followed better than bare rules.'",
  },

  // ── Category 3: Iterative Refinement (7 scenarios) ────────────
  {
    id: "3.1-vague-rejection",
    category: "iterative_refinement",
    title: "The vague rejection",
    situation: "You asked an AI to draft an email for you. The draft is factually correct but way too formal — you're writing to a colleague you work with every day, not a client. You need to give the AI feedback to fix it.",
    mode: "guided",
    principles: ["P6"],
    feedbackNotes: "Show that 'try again' gives the AI nothing to work with. Specific feedback about what's right, what's wrong, and what to change produces targeted improvements.",
  },
  {
    id: "3.2-ai-interview",
    category: "iterative_refinement",
    title: "Let the AI interview you",
    situation: "You want to plan a team offsite for 8 people but you're not sure where to start. You have a rough budget and some ideas but haven't thought through all the details.",
    mode: "guided",
    principles: ["P7"],
    feedbackNotes: "Instead of guessing what information the AI needs, ask it to interview you. It will ask about things you might not have thought to mention — dietary restrictions, accessibility needs, weather preferences.",
  },
  {
    id: "3.3-ai-write-prompt",
    category: "iterative_refinement",
    title: "Have the AI write your prompt",
    situation: "You've been going back and forth with an AI about your weekly meal prep routine. After several messages, you've worked out exactly what you want — high-protein, 30-minute cook times, budget-friendly ingredients, with lunch leftovers. Now you want to save this as a reusable request you can use every week.",
    mode: "guided",
    principles: ["P8"],
    feedbackNotes: "After working out the details through conversation, the AI can crystallize everything into a structured, reusable request that captures constraints you might forget to include next time.",
  },
  {
    id: "3.4-try-again-trap",
    category: "iterative_refinement",
    title: "The 'try again' trap",
    situation: "You asked an AI to write a product description for your handmade candles. The result is accurate but reads like a corporate press release — stiff, buzzwordy, and nothing like your brand voice.",
    mode: "guided",
    principles: ["P6"],
    feedbackNotes: "Show the contrast between 'that's not right, try again' (AI guesses randomly) vs. specific feedback about what's wrong and what the brand voice should sound like. Source: OpenAI: 'Be explicit about what you DO want.'",
  },
  {
    id: "3.5-scope-creep",
    category: "iterative_refinement",
    title: "The scope creep",
    situation: "You asked for book recommendations and got a list of 20 books with paragraph-long descriptions for each. Way too much — you wanted a short, focused list you could actually use.",
    mode: "guided",
    principles: ["P1", "P6"],
    feedbackNotes: "Show how 'make it shorter' doesn't tell the AI what to cut. Specific feedback like 'give me your top 5 only, one sentence each, focused on [genre]' gets exactly what you want. Source: OpenAI's 'specify the desired length' and Google's iteration strategy.",
  },
  {
    id: "3.6-draft-review-refine",
    category: "iterative_refinement",
    title: "The draft-review-refine",
    situation: "You need to write a thank-you email after a job interview. Instead of trying to get a perfect email in one shot, you want to take a multi-step approach.",
    mode: "guided",
    principles: ["P6", "P8"],
    feedbackNotes: "Show how draft → review against criteria → refine produces better results than one monolithic request. Source: Anthropic calls this the 'self-correction loop.' OpenAI: 'Split complex tasks into simpler subtasks.'",
  },
  {
    id: "3.7-positive-flip",
    category: "iterative_refinement",
    title: "The positive flip",
    situation: "Every time you ask an AI for help writing something, it adds bullet points, markdown formatting, disclaimers, and unnecessary introductions. You just want clean, natural prose.",
    mode: "guided",
    principles: ["P1", "P6"],
    feedbackNotes: "Show how 'don't use bullet points, don't add disclaimers' is less effective than 'write in flowing prose, get straight to the content, use a confident tone.' Telling the AI what TO do beats listing what NOT to do. Source: All three providers document this — Anthropic, OpenAI, and Google.",
  },

  // ── Category 4: Smart Strategies (7 scenarios) ────────────────
  {
    id: "4a.1-step-by-step",
    category: "smart_strategies",
    title: "The step-by-step thinker",
    situation: "You and four friends went out to dinner. The bill is $187. Three people had the steak special ($38 each), two shared an appetizer ($16), one person didn't drink but the rest split two bottles of wine ($45 each). You need to figure out what each person owes.",
    mode: "guided",
    principles: ["P1"],
    feedbackNotes: "Show how 'split this bill' gives a rough per-person average, while 'work through this step by step before giving the final amounts' produces accurate, verified math. Source: All three providers document step-by-step reasoning. Google found accuracy jumped from 84% to 90% with this technique.",
  },
  {
    id: "4a.2-task-breakdown",
    category: "smart_strategies",
    title: "The task breakdown",
    situation: "You're planning a surprise birthday party for a friend — venue, food, decorations, guest list, timeline. It's a lot to organize all at once.",
    mode: "guided",
    principles: ["P1", "P3"],
    feedbackNotes: "Show how one massive 'plan a birthday party' request produces a generic checklist, while breaking it into focused steps produces detailed, actionable results. Source: OpenAI: 'Split complex tasks into simpler subtasks.' Google: 'Research, strategy, structure, and copy should be separate requests.'",
  },
  {
    id: "4a.3-few-shot-example",
    category: "smart_strategies",
    title: "The few-shot example",
    situation: "You sell handmade jewelry on Etsy and need to write product descriptions for 10 new items. You have a specific style you like — short, warm, and focused on the story behind each piece — but it's hard to put into words.",
    mode: "guided",
    principles: ["P5"],
    feedbackNotes: "Show how describing a style in words produces inconsistent results, while showing 2-3 examples of descriptions you like gives the AI a clear pattern. Source: Anthropic: examples are 'one of the most reliable ways to steer output.' Google: 'Prompts without few-shot examples are likely to be less effective.'",
  },
  {
    id: "4a.4-structured-prompt",
    category: "smart_strategies",
    title: "The structured prompt",
    situation: "You want help planning a weekly workout routine. You have specific goals (build upper body strength, improve cardio), constraints (3 days per week, 45 minutes max, home gym with dumbbells and a pull-up bar), and a history of shoulder injury on your left side.",
    mode: "guided",
    principles: ["P1", "P2", "P5"],
    feedbackNotes: "Show how a rambling paragraph leads to the AI missing details (like the shoulder injury), while clear sections (goals, schedule, equipment, medical notes) ensures nothing gets lost. Source: Anthropic: 'Use structured formatting.' Google recommends labeled sections. OpenAI: 'Use delimiters to clearly indicate distinct parts.'",
  },
  {
    id: "4a.5-self-check",
    category: "smart_strategies",
    title: "The self-check",
    situation: "You're using an AI to help proofread an important email to a client. You want to make sure there are no factual errors, awkward phrasing, or tone issues before you send it.",
    mode: "guided",
    principles: ["P1"],
    feedbackNotes: "Show how 'proofread this' gives a surface-level pass, while 'proofread this, then review your own corrections and flag anything you're not confident about' catches errors the AI might introduce. Source: Anthropic and OpenAI both document self-verification as a reliability technique.",
  },
  {
    id: "4a.6-different-expert",
    category: "smart_strategies",
    title: "Same question, different expert",
    situation: "Your knee has been hurting after your morning runs. You want advice, but the kind of advice depends on who you ask.",
    mode: "guided",
    principles: ["P2", "P5"],
    feedbackNotes: "Show how 'my knee hurts when I run' produces different advice with different expert roles: a doctor focuses on diagnosis, a running coach on form, a physical therapist on exercises. Source: All three providers document role assignment as a core technique.",
  },
  {
    id: "4a.7-document-detective",
    category: "smart_strategies",
    title: "The document detective",
    situation: "You have a long rental lease agreement and need to quickly find answers about the pet policy, security deposit rules, and what happens if you need to break the lease early.",
    mode: "guided",
    principles: ["P2", "P3"],
    feedbackNotes: "Show how 'summarize my lease' gives a broad overview that misses what you need, while providing the document and asking specific questions at the end produces targeted answers. Source: Anthropic: 'Put longform data at the top, queries at the bottom — up to 30% quality improvement.' OpenAI: 'Provide reference text.'",
  },

  // ── Category 5: Full Conversation Loop (freeform only) ────────
  {
    id: "5.1-daily-planner",
    category: "full_conversation_loop",
    title: "Daily work planner",
    situation: "You want an AI to help you create a prioritized to-do list for today. You have emails to catch up on, a project deadline Friday, a 1-on-1 meeting to prep for, and some Slack messages to follow up on.",
    mode: "freeform",
    principles: ["P1", "P2", "P3", "P5", "P6"],
  },
  {
    id: "5.2-customer-escalation",
    category: "full_conversation_loop",
    title: "Customer escalation response",
    situation: "A customer's account team has emailed asking why a data sync hasn't completed. The sync is delayed because of a database migration that took longer than expected. You need to draft both an internal update for your team and a customer-facing response.",
    mode: "freeform",
    principles: ["P1", "P2", "P3", "P5", "P6", "P7"],
  },
  {
    id: "5.3-meeting-prep",
    category: "full_conversation_loop",
    title: "Meeting prep brief",
    situation: "You have a meeting in 30 minutes with a customer you haven't spoken to in 2 weeks. You need to quickly get up to speed on open issues, recent activity, and action items so you're not caught off guard.",
    mode: "freeform",
    principles: ["P1", "P2", "P3", "P5", "P6"],
  },
];

const GUIDED_SCENARIOS = SCENARIOS.filter(s => s.mode === "guided");
const FREEFORM_SCENARIOS = SCENARIOS.filter(s => s.mode === "freeform");

// ============================================================
// CONSTANTS — Landing Page Demo
// ============================================================

const DEMO_BAD_PROMPT = "Do you know how to shovel snow faster?";
const DEMO_BAD_RESPONSE = "Yes.";
const DEMO_GOOD_PROMPT = "Tell me 5 ways I can speed up shoveling snow in the morning before work. My driveway is about 40 feet long and I usually spend 45 minutes on it.";
const DEMO_GOOD_RESPONSE = `Here are 5 ways to cut down your shoveling time:

1. **Shovel in stages, not all at once** — If you clear snow twice during a heavy storm (once midway, once after), each pass is lighter and faster than waiting for the full accumulation.

2. **Push, don't lift** — Use your shovel like a plow and push snow to the edges rather than scooping and throwing. This saves energy and is much faster over a 40-foot stretch.

3. **Spray your shovel with cooking spray** — A light coat of non-stick spray or car wax prevents snow from sticking to the blade, so each push moves more snow.

4. **Start from the center** — Shovel a line down the middle of your driveway first, then push snow outward to each side. This gives you a clear path faster and cuts the pushing distance in half.

5. **Pre-treat the night before** — Scatter salt or a brine solution (water + rock salt) before the snow starts. It won't melt everything, but it prevents ice from bonding to the concrete, making the morning shovel much easier.

With these techniques, you could realistically cut your 45-minute routine to 20–25 minutes.`;

// ============================================================
// PROMPT TEMPLATES
// ============================================================

const OPTION_GENERATOR_SYSTEM = `You are a component of PromptBridge, an interactive tool that teaches people how to communicate effectively with AI assistants.

Your job: Given a scenario, generate exactly 3 prompt options that a user might write to an AI assistant. The options should represent different quality levels:

- One option should be clearly WEAK: vague, keyword-style, missing context, or phrased as a yes/no question when information is needed. This should feel realistic — it's how most people actually prompt AI when they first start.

- One option should be MEDIUM: partially effective, has some useful information but is missing key context, specificity, or clear intent. Not terrible, but not great.

- One option should be STRONG: specific, provides relevant context, states clear intent, avoids ambiguity, and would produce a genuinely useful AI response.

CRITICAL RULES:
- All three options must be plausible things a real person would type. The weak option should NOT be exaggerated or obviously wrong — it should be the kind of thing most people would type without thinking.
- Do NOT randomize the quality order. Always return them in the order: weak, medium, strong. The frontend will shuffle the display order.
- Each option should be a complete, ready-to-send message — not a fragment or label.
- Do NOT include any explanation, rating, or commentary. Just the three prompt texts.

Respond in JSON format:
{
  "options": [
    {"id": "a", "text": "...", "quality": "weak"},
    {"id": "b", "text": "...", "quality": "medium"},
    {"id": "c", "text": "...", "quality": "strong"}
  ]
}`;

const RESPONSE_SIMULATOR_SYSTEM = `You are a component of PromptBridge, an interactive tool that teaches people how to communicate effectively with AI assistants.

Your job: Simulate how an AI assistant would realistically respond to two different prompts about the same topic. You will receive a WEAK prompt and a STRONG prompt. Generate a realistic response for each.

For the WEAK prompt response:
- Respond the way an AI assistant actually would to a vague or poorly-phrased prompt
- If the prompt is a binary yes/no question, answer it literally (e.g., "Yes." or "Yes, I can help with that.")
- If the prompt is keyword-style, give a generic, surface-level response
- If the prompt is missing context, make generic assumptions and provide generic advice
- Do NOT deliberately produce bad content — produce the kind of genuinely unhelpful-but-technically-correct response a real AI gives to a vague prompt
- Keep it short — vague prompts produce brief, generic output

For the STRONG prompt response:
- Respond the way an AI assistant would to a well-crafted, specific prompt
- Use the context, constraints, and preferences provided in the prompt
- Be specific, actionable, and tailored to the situation described
- Match the format and scope the prompt requests
- This should be a genuinely useful response that demonstrates what good prompting produces

CRITICAL RULES:
- Both responses must be about the SAME underlying topic/task
- The contrast should be stark and immediately obvious
- Do NOT add any meta-commentary about the prompt quality
- Do NOT include phrases like "Based on your prompt..." or "Since you asked..."
- Just respond as if you ARE the AI assistant being prompted

Respond in JSON format:
{
  "response_weak": "...",
  "response_strong": "..."
}`;

const FEEDBACK_GENERATOR_SYSTEM = `You are a component of PromptBridge, an interactive tool that teaches people how to communicate effectively with AI assistants.

Your job: After a user has selected one of three prompt options and seen the simulated responses, provide constructive feedback that helps them understand WHY certain approaches work better than others.

Your feedback should include:

1. WHAT HAPPENED: A brief explanation of what the user saw — why the weak prompt produced a weak response and the strong prompt produced a strong one. Be specific about the cause-and-effect relationship.

2. THE PRINCIPLE: Name the communication principle(s) at work and explain it in one sentence. Use plain language — not jargon. The principles are:
   - Be specific, not vague
   - Provide context
   - State your intent
   - Avoid ambiguity
   - Show what "good" looks like
   - Give specific feedback
   - Ask the AI to ask you questions
   - Ask the AI to write prompts for you

3. THE TIP: One concrete, actionable thing the user can try next time they use any AI tool. This should be a specific behavior change, not abstract advice.

CRITICAL RULES:
- TONE: Constructive, specific, encouraging, never condescending. You are a coach, not a grader.
- If the user picked the STRONG option: Acknowledge their good instinct and explain specifically what made it work. Still provide the principle and tip for reinforcement.
- If the user picked a WEAK or MEDIUM option: Do NOT make them feel bad. Explain what happened matter-of-factly, show the contrast, and give a clear path to improvement.
- Keep total feedback under 200 words. Dense and useful, not long-winded.
- NEVER use the phrase "prompt engineering" — say "how you talk to AI tools" or "how you phrase your request"
- NEVER use technical AI jargon (tokens, context window, system prompt, etc.)

Respond in JSON format:
{
  "what_happened": "...",
  "principle": "...",
  "principle_name": "...",
  "tip": "...",
  "user_picked_best": true or false
}`;

const FREEFORM_ANALYSIS_SYSTEM = `You are a component of PromptBridge, an interactive tool that teaches people how to communicate effectively with AI assistants.

Your job: A user has written their own prompt for a given scenario. You need to:

1. ANALYZE their prompt — what's strong about it and what could be improved. Be specific: point to exact phrases or missing elements, not vague impressions.

2. IDENTIFY which communication principles their prompt follows well and which it misses:
   - P1: Be specific, not vague
   - P2: Provide context (who you are, situation, constraints)
   - P3: State your intent (what the output is for)
   - P4: Avoid ambiguity (no yes/no questions when you want info)
   - P5: Show what "good" looks like (examples, format, tone guidance)
   - P6: Give specific feedback (when iterating)
   - P7: Ask the AI to ask you questions
   - P8: Ask the AI to write prompts for you

3. WRITE an improved version of their prompt that addresses the weaknesses while keeping their intent and voice intact.

4. PROVIDE a concrete tip they can apply next time.

CRITICAL RULES:
- Start with what's GOOD about their prompt.
- Be specific about what to change. "Add context about your timeline" is better than "provide more context."
- The improved prompt should be recognizably THEIRS, not a generic "perfect prompt."
- Keep analysis under 150 words. Keep the tip under 50 words.
- NEVER use "prompt engineering" — say "how you phrase your request" or "the way you asked"
- NEVER use technical AI jargon

Respond in JSON format:
{
  "strengths": "...",
  "improvements": "...",
  "improved_prompt": "...",
  "principles_present": ["P1", "P2"],
  "principles_missing": ["P3", "P5"],
  "tip": "..."
}`;

// ============================================================
// API SERVICE
// ============================================================

async function callClaude(systemPrompt, userMessage, { temperature = 0.7, maxTokens = 1024 } = {}) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    throw new Error(`API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  if (!data.content || !data.content[0]) {
    throw new Error("Empty response from API");
  }

  const text = data.content[0].text;
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

async function generateOptions(scenario) {
  const principleNames = scenario.principles.map(p => PRINCIPLE_MAP[p]?.name).join(", ");
  const userMsg = `Scenario: ${scenario.situation}\n\nThe user's task: ${scenario.title}\n\nCommunication principles being taught: ${principleNames}\n\nAdditional guidance: ${scenario.feedbackNotes || ""}\n\nGenerate 3 prompt options as described in your instructions.`;
  return callClaude(OPTION_GENERATOR_SYSTEM, userMsg, { temperature: 0.8, maxTokens: 800 });
}

async function simulateResponses(weakPrompt, strongPrompt, situation) {
  const userMsg = `Scenario context: ${situation}\n\nWEAK PROMPT: ${weakPrompt}\n\nSTRONG PROMPT: ${strongPrompt}\n\nGenerate realistic AI responses to each prompt.`;
  return callClaude(RESPONSE_SIMULATOR_SYSTEM, userMsg, { temperature: 0.5, maxTokens: 1500 });
}

async function generateFeedback(scenario, options, userChoice, responses) {
  const optTexts = options.map(o => `${o.id.toUpperCase()} (${o.quality}): ${o.text}`).join("\n");
  const userMsg = `Scenario: ${scenario.situation}\n\nThe three options were:\n${optTexts}\n\nThe user selected: Option ${userChoice.id.toUpperCase()} (quality: ${userChoice.quality})\n\nThe simulated responses were:\nWeak prompt response: ${responses.response_weak}\nStrong prompt response: ${responses.response_strong}\n\nProvide feedback as described in your instructions.`;
  return callClaude(FEEDBACK_GENERATOR_SYSTEM, userMsg, { temperature: 0.3, maxTokens: 600 });
}

async function analyzeFreeform(scenario, userPrompt) {
  const userMsg = `Scenario: ${scenario.situation}\n\nThe user wrote this prompt:\n"${userPrompt}"\n\nAnalyze this prompt and provide an improved version as described in your instructions.`;
  return callClaude(FREEFORM_ANALYSIS_SYSTEM, userMsg, { temperature: 0.4, maxTokens: 1200 });
}

// ============================================================
// STORAGE HELPERS
// ============================================================

async function loadProgress() {
  try {
    const result = await window.storage.get("promptbridge_progress");
    if (result && result.value) {
      return JSON.parse(result.value);
    }
  } catch (e) {
    // First visit or no saved data
  }
  return { completedScenarios: [], practicedPrinciples: [] };
}

async function saveProgress(data) {
  try {
    await window.storage.set("promptbridge_progress", JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

// ============================================================
// UTILITY COMPONENTS
// ============================================================

function LoadingSpinner({ message = "Thinking..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <p className="text-stone-500 text-sm">{message}</p>
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p className="text-red-700 text-sm">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  );
}

function PrincipleBadge({ principleId, size = "sm" }) {
  const p = PRINCIPLE_MAP[principleId];
  if (!p) return null;
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span className={`inline-flex items-center gap-1 ${sizeClasses} bg-indigo-50 text-indigo-700 rounded-full font-medium`}>
      {p.name}
    </span>
  );
}

function MarkdownText({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        const formatted = line
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>");
        const isListItem = /^\d+\.\s/.test(line.trim()) || /^[-•]\s/.test(line.trim());
        return (
          <p key={i} className={isListItem ? "pl-4" : ""} dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      })}
    </div>
  );
}

// ============================================================
// RESPONSE COMPARISON — The hero interaction
// ============================================================

function ResponseComparison({ weakPrompt, strongPrompt, weakResponse, strongResponse }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Weak side */}
      <div className="rounded-xl border-2 border-rose-200 bg-gradient-to-b from-rose-50 to-white p-5 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center">
            <X className="w-4 h-4 text-rose-500" />
          </div>
          <span className="font-semibold text-rose-700">Vague Request</span>
        </div>
        <div className="bg-white rounded-lg p-3.5 mb-3 border border-rose-100">
          <p className="text-xs text-stone-400 mb-1 font-medium uppercase tracking-wide">The request</p>
          <p className="text-stone-700 italic text-sm">"{weakPrompt}"</p>
        </div>
        <div className="bg-white rounded-lg p-3.5 border border-rose-100">
          <p className="text-xs text-stone-400 mb-1 font-medium uppercase tracking-wide">What the AI gave back</p>
          <div className="text-stone-600 text-sm">
            <MarkdownText text={weakResponse} />
          </div>
        </div>
      </div>

      {/* Strong side */}
      <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="font-semibold text-emerald-700">Clear Request</span>
        </div>
        <div className="bg-white rounded-lg p-3.5 mb-3 border border-emerald-100">
          <p className="text-xs text-stone-400 mb-1 font-medium uppercase tracking-wide">The request</p>
          <p className="text-stone-700 italic text-sm">"{strongPrompt}"</p>
        </div>
        <div className="bg-white rounded-lg p-3.5 border border-emerald-100">
          <p className="text-xs text-stone-400 mb-1 font-medium uppercase tracking-wide">What the AI gave back</p>
          <div className="text-stone-600 text-sm">
            <MarkdownText text={strongResponse} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================

function LandingPage({ onNavigate }) {
  const [showGood, setShowGood] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center pt-8 pb-10 px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-800 mb-4">
          Learn to talk to AI
        </h1>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
          The way you phrase your request changes everything.
          <br className="hidden md:block" />
          See the difference in 5 seconds.
        </p>
      </div>

      {/* Snow Shoveling Demo */}
      <div className="px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="bg-stone-50 px-6 py-3 border-b border-stone-200">
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">
              Same question, two different ways
            </p>
          </div>

          <div className="p-6">
            {/* Bad example — always visible */}
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div>
                  <p className="text-stone-800 font-medium italic">"{DEMO_BAD_PROMPT}"</p>
                </div>
              </div>
              <div className="ml-9 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
                <p className="text-stone-600 text-sm">
                  <span className="text-rose-400 text-xs font-medium mr-2">AI:</span>
                  {DEMO_BAD_RESPONSE}
                </p>
              </div>
            </div>

            {/* Reveal button */}
            {!showGood && (
              <button
                onClick={() => setShowGood(true)}
                className="w-full py-3 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-sm font-medium"
              >
                Now see what happens with a better request →
              </button>
            )}

            {/* Good example — revealed */}
            {showGood && (
              <div className="animate-fadeIn">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-stone-800 font-medium italic">"{DEMO_GOOD_PROMPT}"</p>
                  </div>
                </div>
                <div className="ml-9 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
                  <div className="text-stone-600 text-sm">
                    <span className="text-emerald-500 text-xs font-medium mr-2">AI:</span>
                    <MarkdownText text={DEMO_GOOD_RESPONSE} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insight callout */}
      {showGood && (
        <div className="px-4 mb-8 animate-fadeIn">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
            <Lightbulb className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <p className="text-stone-700 text-sm max-w-xl mx-auto">
              <strong>Same topic. Wildly different results.</strong> The first question can be answered with one word. The second tells the AI exactly what you need — and it delivers.
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center px-4 pb-12">
        <button
          onClick={() => onNavigate("scenarios")}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-colors text-lg"
        >
          Try It Yourself <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-stone-400 text-sm mt-3">
          Interactive scenarios that build real skills
        </p>
      </div>

      {/* What you'll learn */}
      <div className="px-4 pb-12">
        <h2 className="font-serif text-2xl font-bold text-stone-800 text-center mb-6">
          8 skills that work with any AI
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRINCIPLES.map(p => {
            const Icon = p.icon;
            return (
              <div key={p.id} className="flex items-start gap-3 bg-white rounded-xl border border-stone-200 p-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <p className="font-medium text-stone-700 text-sm">{p.name}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCENARIO SELECTOR
// ============================================================

function ScenarioSelector({ onSelectScenario, completedScenarios }) {
  const [activeTab, setActiveTab] = useState("guided");
  const scenarios = activeTab === "guided" ? GUIDED_SCENARIOS : FREEFORM_SCENARIOS;

  const grouped = _.groupBy(scenarios, "category");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Choose a Scenario</h1>
      <p className="text-stone-500 mb-6">Pick a situation and practice talking to AI effectively.</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("guided")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "guided"
              ? "bg-indigo-600 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          Guided Practice
        </button>
        <button
          onClick={() => setActiveTab("freeform")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "freeform"
              ? "bg-indigo-600 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <PenTool className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          Write Your Own
        </button>
      </div>

      {/* Scenario cards grouped by category */}
      {Object.entries(grouped).map(([catKey, catScenarios]) => {
        const cat = CATEGORIES[catKey];
        if (!cat) return null;
        const CatIcon = cat.icon;
        return (
          <div key={catKey} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <CatIcon className="w-5 h-5 text-stone-400" />
              <h2 className="font-serif text-lg font-semibold text-stone-700">{cat.label}</h2>
            </div>
            <p className="text-stone-400 text-sm mb-4">{cat.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catScenarios.map(scenario => {
                const isCompleted = completedScenarios.includes(scenario.id);
                return (
                  <button
                    key={scenario.id}
                    onClick={() => onSelectScenario(scenario)}
                    className="text-left bg-white rounded-xl border border-stone-200 p-4 hover:border-indigo-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-stone-800 group-hover:text-indigo-700 transition-colors text-sm">
                        {scenario.title}
                      </h3>
                      {isCompleted && (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-500" />
                        </div>
                      )}
                    </div>
                    <p className="text-stone-500 text-xs mb-3 line-clamp-2">{scenario.situation}</p>
                    <div className="flex flex-wrap gap-1">
                      {scenario.principles.map(pid => (
                        <span key={pid} className="text-xs px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded font-medium">
                          {PRINCIPLE_MAP[pid]?.name}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// GUIDED MODE
// ============================================================

function GuidedMode({ scenario, onComplete, onBack }) {
  const [step, setStep] = useState("loading-options"); // loading-options, pick, loading-responses, comparison, loading-feedback, feedback
  const [options, setOptions] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [responses, setResponses] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const weakOption = useRef(null);
  const strongOption = useRef(null);

  // Generate options on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStep("loading-options");
      setError(null);
      try {
        const result = await generateOptions(scenario);
        if (cancelled) return;
        const opts = result.options;
        weakOption.current = opts.find(o => o.quality === "weak");
        strongOption.current = opts.find(o => o.quality === "strong");
        setOptions(opts);
        setShuffledOptions(_.shuffle([...opts]));
        setStep("pick");
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [scenario]);

  const handleSelect = async (option) => {
    setSelectedOption(option);
    setStep("loading-responses");
    setError(null);
    try {
      const resp = await simulateResponses(
        weakOption.current.text,
        strongOption.current.text,
        scenario.situation
      );
      setResponses(resp);
      setStep("comparison");
      // Start loading feedback in background
      try {
        const fb = await generateFeedback(scenario, options, option, resp);
        setFeedback(fb);
        setStep("feedback");
      } catch (e) {
        setError(e.message);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const retryFromError = () => {
    if (!options) {
      // Retry generating options
      setError(null);
      setStep("loading-options");
      generateOptions(scenario)
        .then(result => {
          const opts = result.options;
          weakOption.current = opts.find(o => o.quality === "weak");
          strongOption.current = opts.find(o => o.quality === "strong");
          setOptions(opts);
          setShuffledOptions(_.shuffle([...opts]));
          setStep("pick");
        })
        .catch(e => setError(e.message));
    } else if (selectedOption) {
      handleSelect(selectedOption);
    }
  };

  const qualityLabel = (q) => {
    if (q === "strong") return { text: "Strong", color: "emerald" };
    if (q === "medium") return { text: "Okay", color: "amber" };
    return { text: "Weak", color: "rose" };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to scenarios
      </button>

      {/* Scenario header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-indigo-500" />
          <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Guided Practice</span>
        </div>
        <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">{scenario.title}</h2>
        <p className="text-stone-600 text-sm">{scenario.situation}</p>
      </div>

      {/* Error state */}
      {error && <div className="mb-6"><ErrorBanner message={error} onRetry={retryFromError} /></div>}

      {/* Step: Loading options */}
      {step === "loading-options" && !error && (
        <LoadingSpinner message="Generating prompt options..." />
      )}

      {/* Step: Pick an option */}
      {step === "pick" && (
        <div>
          <h3 className="font-semibold text-stone-700 mb-1">Which request would get the best result?</h3>
          <p className="text-stone-400 text-sm mb-4">Pick the one you think an AI would respond to most helpfully.</p>
          <div className="space-y-3">
            {shuffledOptions.map((opt, idx) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className="w-full text-left bg-white rounded-xl border-2 border-stone-200 p-4 hover:border-indigo-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 font-semibold text-sm text-stone-500 group-hover:text-indigo-600 transition-colors">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <p className="text-stone-700 text-sm leading-relaxed">{opt.text}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Loading responses */}
      {step === "loading-responses" && !error && (
        <LoadingSpinner message="Simulating AI responses..." />
      )}

      {/* Step: Comparison */}
      {(step === "comparison" || step === "loading-feedback" || step === "feedback") && responses && (
        <div className="mb-6">
          {/* User's pick indicator */}
          {selectedOption && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-stone-500">You picked:</span>
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                selectedOption.quality === "strong" ? "bg-emerald-100 text-emerald-700" :
                selectedOption.quality === "medium" ? "bg-amber-100 text-amber-700" :
                "bg-rose-100 text-rose-700"
              }`}>
                {qualityLabel(selectedOption.quality).text}
              </span>
            </div>
          )}

          <h3 className="font-semibold text-stone-700 mb-3">See the difference</h3>
          <ResponseComparison
            weakPrompt={weakOption.current?.text}
            strongPrompt={strongOption.current?.text}
            weakResponse={responses.response_weak}
            strongResponse={responses.response_strong}
          />
        </div>
      )}

      {/* Loading feedback */}
      {step === "comparison" && !error && (
        <LoadingSpinner message="Preparing feedback..." />
      )}

      {/* Step: Feedback */}
      {step === "feedback" && feedback && (
        <div className="animate-fadeIn">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-amber-800">What happened here</span>
            </div>
            <p className="text-stone-700 text-sm mb-4">{feedback.what_happened}</p>

            <div className="bg-white rounded-lg p-4 mb-4 border border-amber-100">
              <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">The Principle</p>
              <p className="font-semibold text-stone-800 mb-1">{feedback.principle_name}</p>
              <p className="text-stone-600 text-sm">{feedback.principle}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-amber-100">
              <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">Try This Next Time</p>
              <p className="text-stone-700 text-sm">{feedback.tip}</p>
            </div>
          </div>

          {/* Principle badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {scenario.principles.map(pid => (
              <PrincipleBadge key={pid} principleId={pid} />
            ))}
          </div>

          {/* Next button */}
          <div className="flex gap-3">
            <button
              onClick={() => onComplete(scenario)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Next Scenario <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-medium transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FREE-FORM MODE
// ============================================================

function FreeformMode({ scenario, onComplete, onBack }) {
  const [step, setStep] = useState("write"); // write, loading-analysis, analysis, loading-responses, results
  const [userPrompt, setUserPrompt] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [responses, setResponses] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!userPrompt.trim()) return;
    setStep("loading-analysis");
    setError(null);
    try {
      const result = await analyzeFreeform(scenario, userPrompt.trim());
      setAnalysis(result);
      setStep("analysis");

      // Now simulate responses
      setStep("loading-responses");
      const resp = await simulateResponses(
        userPrompt.trim(),
        result.improved_prompt,
        scenario.situation
      );
      setResponses(resp);
      setStep("results");
    } catch (e) {
      setError(e.message);
    }
  };

  const retryFromError = () => {
    if (!analysis) {
      handleSubmit();
    } else {
      setStep("loading-responses");
      setError(null);
      simulateResponses(userPrompt.trim(), analysis.improved_prompt, scenario.situation)
        .then(resp => {
          setResponses(resp);
          setStep("results");
        })
        .catch(e => setError(e.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to scenarios
      </button>

      {/* Scenario header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <PenTool className="w-4 h-4 text-indigo-500" />
          <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Write Your Own</span>
        </div>
        <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">{scenario.title}</h2>
        <p className="text-stone-600 text-sm">{scenario.situation}</p>
      </div>

      {error && <div className="mb-6"><ErrorBanner message={error} onRetry={retryFromError} /></div>}

      {/* Step: Write */}
      {step === "write" && (
        <div>
          <h3 className="font-semibold text-stone-700 mb-1">Write your request</h3>
          <p className="text-stone-400 text-sm mb-4">How would you ask an AI to help with this? Write the message you'd actually send.</p>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Type your request here..."
            rows={5}
            className="w-full bg-white border border-stone-300 rounded-xl p-4 text-stone-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 placeholder:text-stone-300"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmit}
              disabled={!userPrompt.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              <Send className="w-4 h-4" /> Submit
            </button>
          </div>
        </div>
      )}

      {/* Loading analysis */}
      {step === "loading-analysis" && !error && (
        <LoadingSpinner message="Analyzing your request..." />
      )}

      {/* Loading responses */}
      {step === "loading-responses" && !error && (
        <LoadingSpinner message="Simulating AI responses..." />
      )}

      {/* Step: Results (analysis + comparison) */}
      {step === "results" && analysis && responses && (
        <div className="space-y-6 animate-fadeIn">
          {/* Analysis */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-800 mb-4">How you did</h3>

            {/* Strengths */}
            <div className="bg-emerald-50 rounded-lg p-4 mb-3 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide mb-1">What's working</p>
              <p className="text-stone-700 text-sm">{analysis.strengths}</p>
            </div>

            {/* Improvements */}
            <div className="bg-amber-50 rounded-lg p-4 mb-3 border border-amber-100">
              <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">What to improve</p>
              <p className="text-stone-700 text-sm">{analysis.improvements}</p>
            </div>

            {/* Improved prompt */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">Improved version</p>
              <p className="text-stone-700 text-sm italic">"{analysis.improved_prompt}"</p>
            </div>
          </div>

          {/* Side-by-side comparison */}
          <div>
            <h3 className="font-semibold text-stone-700 mb-3">See the difference</h3>
            <ResponseComparison
              weakPrompt={userPrompt}
              strongPrompt={analysis.improved_prompt}
              weakResponse={responses.response_weak}
              strongResponse={responses.response_strong}
            />
          </div>

          {/* Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-amber-800">Try This Next Time</span>
            </div>
            <p className="text-stone-700 text-sm">{analysis.tip}</p>
          </div>

          {/* Principle badges */}
          <div>
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-2">Skills practiced</p>
            <div className="flex flex-wrap gap-2">
              {(analysis.principles_present || []).map(pid => (
                <span key={pid} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-200">
                  ✓ {PRINCIPLE_MAP[pid]?.name}
                </span>
              ))}
              {(analysis.principles_missing || []).map(pid => (
                <span key={pid} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full font-medium border border-stone-200">
                  {PRINCIPLE_MAP[pid]?.name}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onComplete(scenario, [...(analysis.principles_present || []), ...(analysis.principles_missing || [])])}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Next Scenario <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setStep("write"); setUserPrompt(""); setAnalysis(null); setResponses(null); setError(null); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PROGRESS PAGE
// ============================================================

function ProgressPage({ completedScenarios, practicedPrinciples, onNavigate }) {
  const totalScenarios = SCENARIOS.length;
  const completedCount = completedScenarios.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">Your Progress</h1>
      <p className="text-stone-500 mb-8">
        {completedCount} of {totalScenarios} scenarios completed
      </p>

      {/* Progress bar */}
      <div className="bg-stone-200 rounded-full h-3 mb-8 overflow-hidden">
        <div
          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${totalScenarios > 0 ? (completedCount / totalScenarios) * 100 : 0}%` }}
        />
      </div>

      {/* Principles grid */}
      <h2 className="font-serif text-xl font-bold text-stone-800 mb-4">Communication Skills</h2>
      <div className="space-y-3 mb-8">
        {PRINCIPLES.map(p => {
          const Icon = p.icon;
          const practiced = practicedPrinciples.includes(p.id);
          return (
            <div
              key={p.id}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                practiced
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-white border-stone-200"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                practiced ? "bg-emerald-100" : "bg-stone-100"
              }`}>
                {practiced
                  ? <Check className="w-5 h-5 text-emerald-500" />
                  : <Icon className="w-5 h-5 text-stone-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${practiced ? "text-emerald-800" : "text-stone-700"}`}>{p.name}</p>
                <p className={`text-xs ${practiced ? "text-emerald-600" : "text-stone-400"}`}>{p.description}</p>
              </div>
              {practiced && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                  Practiced
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {completedCount < totalScenarios && (
        <div className="text-center">
          <button
            onClick={() => onNavigate("scenarios")}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            Continue Practicing <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {completedCount === totalScenarios && (
        <div className="text-center bg-amber-50 border border-amber-200 rounded-xl p-6">
          <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="font-serif text-lg font-bold text-stone-800 mb-1">All scenarios completed!</p>
          <p className="text-stone-500 text-sm">You've practiced every scenario. Try the "Write Your Own" mode to keep building skills.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

function App() {
  const [page, setPage] = useState("landing");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [practicedPrinciples, setPracticedPrinciples] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load progress on mount
  useEffect(() => {
    loadProgress().then(data => {
      setCompletedScenarios(data.completedScenarios || []);
      setPracticedPrinciples(data.practicedPrinciples || []);
      setLoaded(true);
    });
  }, []);

  const markCompleted = useCallback(async (scenario, extraPrinciples) => {
    const newCompleted = [...new Set([...completedScenarios, scenario.id])];
    const allPrinciples = [...(scenario.principles || []), ...(extraPrinciples || [])];
    const newPracticed = [...new Set([...practicedPrinciples, ...allPrinciples])];
    setCompletedScenarios(newCompleted);
    setPracticedPrinciples(newPracticed);
    await saveProgress({ completedScenarios: newCompleted, practicedPrinciples: newPracticed });
  }, [completedScenarios, practicedPrinciples]);

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setPage(scenario.mode === "freeform" ? "freeform" : "guided");
  };

  const handleScenarioComplete = async (scenario, extraPrinciples) => {
    await markCompleted(scenario, extraPrinciples);
    // Navigate to next uncompleted scenario, or back to list
    const pool = scenario.mode === "freeform" ? FREEFORM_SCENARIOS : GUIDED_SCENARIOS;
    const currentIdx = pool.findIndex(s => s.id === scenario.id);
    const next = pool.find((s, i) => i > currentIdx && !completedScenarios.includes(s.id));
    if (next) {
      setSelectedScenario(next);
      setPage(next.mode === "freeform" ? "freeform" : "guided");
    } else {
      setPage("scenarios");
    }
  };

  const navigate = (p) => {
    setPage(p);
    setSelectedScenario(null);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAFAF8" }}>
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* Header */}
      {page !== "landing" && (
        <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => navigate("landing")}
              className="flex items-center gap-2 font-serif font-bold text-stone-800 hover:text-indigo-600 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              PromptBridge
            </button>
            <nav className="flex items-center gap-1">
              <button
                onClick={() => navigate("scenarios")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  page === "scenarios" || page === "guided" || page === "freeform"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
                }`}
              >
                Scenarios
              </button>
              <button
                onClick={() => navigate("progress")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  page === "progress"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Progress
                {practicedPrinciples.length > 0 && (
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-semibold">
                    {practicedPrinciples.length}/8
                  </span>
                )}
              </button>
            </nav>
          </div>
        </header>
      )}

      {/* Pages */}
      <main>
        {page === "landing" && (
          <LandingPage onNavigate={navigate} />
        )}
        {page === "scenarios" && (
          <ScenarioSelector
            onSelectScenario={handleSelectScenario}
            completedScenarios={completedScenarios}
          />
        )}
        {page === "guided" && selectedScenario && (
          <GuidedMode
            key={selectedScenario.id}
            scenario={selectedScenario}
            onComplete={handleScenarioComplete}
            onBack={() => navigate("scenarios")}
          />
        )}
        {page === "freeform" && selectedScenario && (
          <FreeformMode
            key={selectedScenario.id}
            scenario={selectedScenario}
            onComplete={handleScenarioComplete}
            onBack={() => navigate("scenarios")}
          />
        )}
        {page === "progress" && (
          <ProgressPage
            completedScenarios={completedScenarios}
            practicedPrinciples={practicedPrinciples}
            onNavigate={navigate}
          />
        )}
      </main>

      {/* Footer — landing page only */}
      {page === "landing" && (
        <footer className="text-center py-8 px-4 border-t border-stone-200">
          <p className="text-stone-400 text-xs">
            PromptBridge — Open source. Inspired by NeuroBridge (Haroon et al., ASSETS 2025).
          </p>
          <p className="text-stone-300 text-xs mt-1">
            Skills learned here work with any AI assistant.
          </p>
        </footer>
      )}
    </div>
  );
}

export default App;
