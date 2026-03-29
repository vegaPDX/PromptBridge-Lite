// ============================================================
// Scenarios — 26 guided scenarios for PromptBridge Lite
// 2 per sub-maxim across 6 maxims (13 sub-maxims)
// Curated for beginners with heavy emphasis on AI safety
// ============================================================

export const SCENARIOS = [
  // ── Maxim 1: Be Clear & Specific ─────────────────────────

  // M1a: Be specific, not vague
  {
    id: "1.1-snow-shoveling",
    maxim: "M1",
    subMaxim: "M1a",
    title: "The snow shoveling problem",
    situation: "It snowed heavily overnight. You need to clear your driveway before work and you want to do it efficiently.",
    mode: "guided",
    principles: ["P1", "P4"],
    feedbackNotes: "Focus on binary question pattern (P4) and the difference between keyword search and actual requests (P1). The 'Do you know' construction is one of the most common ineffective patterns.",
    relevance: ["personal"],
  },
  {
    id: "1.2-email-draft",
    maxim: "M1",
    subMaxim: "M1a",
    title: "The email draft",
    situation: "You need to write an email to your manager about a project delay. The Q2 report will be 3 days late because you're waiting on data from the finance team.",
    mode: "guided",
    principles: ["P1", "P2", "P3", "P5"],
    feedbackNotes: "Emphasize how specifying recipient, tone, reason, and length transforms a generic email into one that's actually sendable.",
    relevance: ["work"],
  },

  // M1b: Avoid ambiguity
  {
    id: "1.3-meal-plan",
    maxim: "M1",
    subMaxim: "M1b",
    title: "The meal plan",
    situation: "You want to eat healthier this week but you're short on time. You'd like some dinner ideas.",
    mode: "guided",
    principles: ["P1", "P2"],
    feedbackNotes: "Highlight how adding constraints (time, preferences, format) transforms generic lists into usable plans.",
    relevance: ["personal"],
  },
  {
    id: "1.4-product-comparison",
    maxim: "M1",
    subMaxim: "M1b",
    title: "The product comparison",
    situation: "You want to buy a new laptop for work and personal use, and you need help deciding what to get. Your budget is around $1,200.",
    mode: "guided",
    principles: ["P1", "P4"],
    feedbackNotes: "Highlight how 'what's the best laptop?' gives the AI nothing to work with — there is no 'best' without knowing budget, use case, screen size preference, and priorities (battery vs. performance vs. weight).",
    relevance: ["personal"],
  },

  // ── Maxim 2: Provide Context & Intent ────────────────────

  // M2a: Provide relevant context
  {
    id: "2.1-compound-interest",
    maxim: "M2",
    subMaxim: "M2a",
    title: "Explain this concept",
    situation: "You're 25 years old, just opened your first retirement account, and need to understand how compound interest works. You don't have a finance background.",
    mode: "guided",
    principles: ["P2", "P3", "P5"],
    feedbackNotes: "Show how telling the AI about your knowledge level and purpose produces an explanation calibrated to you, not a textbook definition.",
    relevance: ["school", "personal"],
  },
  {
    id: "2.2-cover-letter",
    maxim: "M2",
    subMaxim: "M2a",
    title: "The cover letter",
    situation: "You found a job posting you're excited about and want help writing a cover letter. You have the posting details and your relevant experience.",
    mode: "guided",
    principles: ["P2", "P3"],
    feedbackNotes: "Show how pasting the actual job posting details and key resume highlights into the request vs. just saying 'write a cover letter' produces a tailored letter vs. a generic template.",
    relevance: ["work"],
  },

  // M2b: State your intent
  {
    id: "2.3-presentation-helper",
    maxim: "M2",
    subMaxim: "M2b",
    title: "The presentation helper",
    situation: "You need to prepare a 10-minute presentation for your VP and directors about a customer migration project. You've moved 340 of 500 accounts, you're on track to finish by June, and the main risk is a legacy system deprecation in April.",
    mode: "guided",
    principles: ["P1", "P2", "P3"],
    feedbackNotes: "Highlight how specifying the audience's priorities (timeline, risk, asks) shapes the AI's output more than describing the topic.",
    relevance: ["work"],
  },
  {
    id: "2.4-tone-mismatch",
    maxim: "M2",
    subMaxim: "M2b",
    title: "The tone mismatch",
    situation: "Your team's work schedule is changing next month — meetings are moving from Monday mornings to Wednesday afternoons. You need to tell your team (casual Slack message) and also notify the broader department (professional email).",
    mode: "guided",
    principles: ["P2", "P5"],
    feedbackNotes: "Show how the SAME information needs completely different treatment depending on audience and channel. Specifying tone and medium is as important as specifying content.",
    relevance: ["work"],
  },

  // ── Maxim 3: Guide the Output ────────────────────────────

  // M3a: Show what "good" looks like
  {
    id: "3.1-generic-email",
    maxim: "M3",
    subMaxim: "M3a",
    title: "The generic email",
    situation: "You ask AI to 'write a marketing email' for your company's spring sale. It produces something that sounds like it could be about anything — generic corporate language, no personality, no clear audience. Just... slop.",
    mode: "guided",
    principles: ["P1", "P2", "P5"],
    feedbackNotes: "Show how 'write a marketing email' gives the AI nothing to work with. The strong prompt specifies the audience, the product, the tone, the call-to-action, AND pastes an example of a previous email the user liked. Research: giving AI an example of what you want can improve accuracy from 0% to 90%.",
    relevance: ["work"],
  },
  {
    id: "3.2-format-request",
    maxim: "M3",
    subMaxim: "M3a",
    title: "The format request",
    situation: "You read a long article about productivity techniques and want to capture the main ideas. You just need the key takeaways in a format you can quickly reference later.",
    mode: "guided",
    principles: ["P1", "P5"],
    feedbackNotes: "Show how 'summarize this article' produces a wall of text, while specifying format (5 bullet points, a comparison table, numbered takeaways) produces something actually scannable and useful.",
    relevance: ["work", "school"],
  },

  // M3b: Include everything needed — nothing extra
  {
    id: "3.3-kitchen-sink",
    maxim: "M3",
    subMaxim: "M3b",
    title: "The kitchen sink prompt",
    situation: "You want restaurant recommendations for tonight. You start writing your prompt and include your entire food history, every allergy in your family, your budget philosophy, and what you ate last Tuesday.",
    mode: "guided",
    principles: ["P1", "P10"],
    feedbackNotes: "Show how dumping every possible detail into a prompt overwhelms the AI and buries the actual question. The strong prompt includes only what matters: location, party size, cuisine preference, and budget. Everything else is noise.",
    relevance: ["personal"],
  },
  {
    id: "3.4-signal-vs-noise",
    maxim: "M3",
    subMaxim: "M3b",
    title: "Signal vs. noise",
    situation: "You need help writing a product review for a blender you bought. You include your entire order history, shipping details, and account information alongside what you actually thought of the product.",
    mode: "guided",
    principles: ["P1", "P10"],
    feedbackNotes: "Show how irrelevant details (order numbers, tracking info) dilute the AI's focus on what actually matters — your experience with the product. The strong prompt strips away everything except what's needed to write a good review.",
    relevance: ["personal"],
  },

  // ── Maxim 4: Iterate & Collaborate ───────────────────────

  // M4a: Give specific feedback
  {
    id: "4.1-vague-rejection",
    maxim: "M4",
    subMaxim: "M4a",
    title: "The vague rejection",
    situation: "You asked an AI to draft an email for you. The draft is factually correct but way too formal — you're writing to a colleague you work with every day, not a client. You need to give the AI feedback to fix it.",
    mode: "guided",
    principles: ["P6"],
    feedbackNotes: "Show that 'try again' gives the AI nothing to work with. Specific feedback about what's right, what's wrong, and what to change produces targeted improvements.",
    relevance: ["work"],
  },
  {
    id: "4.2-try-again-trap",
    maxim: "M4",
    subMaxim: "M4a",
    title: "The 'try again' trap",
    situation: "You asked an AI to write a product description for your handmade candles. The result is accurate but reads like a corporate press release — stiff, buzzwordy, and nothing like your brand voice.",
    mode: "guided",
    principles: ["P6"],
    feedbackNotes: "Show the contrast between 'that's not right, try again' (AI guesses randomly) vs. specific feedback about what's wrong and what the brand voice should sound like.",
    relevance: ["personal", "work"],
  },

  // M4b: Collaborate with AI
  {
    id: "4.3-ai-interview",
    maxim: "M4",
    subMaxim: "M4b",
    title: "Let the AI interview you",
    situation: "You want to plan a team offsite for 8 people but you're not sure where to start. You have a rough budget and some ideas but haven't thought through all the details.",
    mode: "guided",
    principles: ["P7"],
    feedbackNotes: "Instead of guessing what information the AI needs, ask it to interview you. It will ask about things you might not have thought to mention — dietary restrictions, accessibility needs, weather preferences.",
    relevance: ["work"],
  },
  {
    id: "4.4-ai-write-prompt",
    maxim: "M4",
    subMaxim: "M4b",
    title: "Have the AI write your prompt",
    situation: "You've been going back and forth with an AI about your weekly meal prep routine. After several messages, you've worked out exactly what you want — high-protein, 30-minute cook times, budget-friendly ingredients, with lunch leftovers. Now you want to save this as a reusable request you can use every week.",
    mode: "guided",
    principles: ["P8"],
    feedbackNotes: "After working out the details through conversation, the AI can crystallize everything into a structured, reusable request that captures constraints you might forget to include next time.",
    relevance: ["personal"],
  },

  // ── Maxim 5: Verify & Think Critically ───────────────────

  // M5a: Verify before you trust
  {
    id: "5.1-fact-check-trap",
    maxim: "M5",
    subMaxim: "M5a",
    title: "The fact-check trap",
    situation: "Your manager asks you to quickly look up some statistics about remote work trends. You ask an AI and it gives you specific numbers with decimal points.",
    mode: "guided",
    principles: ["P1", "P9"],
    feedbackNotes: "Show how 'how many remote workers are there?' produces confident-sounding but potentially made-up statistics, while adding 'cite your sources and tell me how confident you are in each number' forces the AI to either provide real citations or admit uncertainty.",
    relevance: ["work"],
  },
  {
    id: "5.2-hallucination-catcher",
    maxim: "M5",
    subMaxim: "M5a",
    title: "Catching made-up facts",
    situation: "You're writing a blog post and ask AI to recommend 5 books about leadership, including author names and a brief summary of each. The AI provides a polished list.",
    mode: "guided",
    principles: ["P9"],
    feedbackNotes: "Show how AI can make up book titles, attribute books to wrong authors, or invent summaries. The strong prompt asks 'for each book, provide the full title, author, publication year, and tell me how to verify it exists' — making fabrication much harder.",
    relevance: ["personal", "work"],
  },

  // M5b: Know what AI can't do
  {
    id: "5.3-time-traveler",
    maxim: "M5",
    subMaxim: "M5b",
    title: "The time traveler",
    situation: "You want to know who won the most recent Super Bowl, what a company's current stock price is, or what happened in the news this week. You're about to ask AI as if it knows.",
    mode: "guided",
    principles: ["P11", "P2"],
    feedbackNotes: "Show how AI has a training cutoff date and can't access the internet or current information. The strong prompt asks 'When does your training data end? Based on what you do know, what can you tell me — and what should I verify with a current source?'",
    relevance: ["personal", "work"],
  },
  {
    id: "5.4-emotional-ai",
    maxim: "M5",
    subMaxim: "M5b",
    title: "The emotional AI",
    situation: "You're having a tough day and start chatting with AI. You ask it 'How do you feel about this?' or 'What's your favorite movie?' You notice it answers as if it has real preferences and emotions.",
    mode: "guided",
    principles: ["P11"],
    feedbackNotes: "Show how AI doesn't have feelings, opinions, or personal experiences — it generates text that sounds like it does. The strong prompt says 'I know you don't have personal experiences, but based on patterns in what people generally enjoy, what would you recommend?'",
    relevance: ["personal"],
  },

  // ── Maxim 6: Use AI Responsibly ──────────────────────────

  // M6a: Recognize and challenge bias
  {
    id: "6.1-invisible-bias",
    maxim: "M6",
    subMaxim: "M6a",
    title: "The invisible bias",
    situation: "You're writing a job posting and ask AI to describe the 'ideal candidate' for a leadership role. The AI generates a description that subtly skews toward certain demographics without you noticing.",
    mode: "guided",
    principles: ["P12", "P2"],
    feedbackNotes: "Show how AI reflects biases from its training data — its description of an 'ideal' anything may encode stereotypes about gender, age, race, or background. The strong prompt adds 'Review your response for any assumptions about demographics, and make sure the description is inclusive and focuses only on job-relevant qualities.'",
    relevance: ["work"],
  },
  {
    id: "6.2-bias-audit",
    maxim: "M6",
    subMaxim: "M6a",
    title: "The bias audit",
    situation: "You used AI to draft a recommendation letter for a colleague. It reads well, but you want to make sure it doesn't contain subtle biased language — like describing women as 'supportive' while describing men as 'decisive.'",
    mode: "guided",
    principles: ["P12", "P6"],
    feedbackNotes: "Show how AI can produce text that sounds professional but encodes subtle bias. The strong approach asks AI: 'Review this letter for gendered language, assumptions about the person's background, and any adjectives that might reflect stereotypes rather than actual qualifications.'",
    relevance: ["work"],
  },

  // M6b: Maintain human oversight
  {
    id: "6.3-sycophancy-test",
    maxim: "M6",
    subMaxim: "M6b",
    title: "When AI agrees too much",
    situation: "You're writing a report and you tell the AI: 'The Great Wall of China is visible from space — expand on this fact for my essay.' (This is actually a myth.) You want to see if the AI will correct you or just go along with it.",
    mode: "guided",
    principles: ["P12", "P9"],
    feedbackNotes: "Show how AI is trained to agree with users, even when they're wrong. The strong prompt says 'First, verify whether this claim is actually true before you build on it.' This teaches users that AI will tell you what you want to hear unless you explicitly ask it to push back.",
    relevance: ["school", "work"],
  },
  {
    id: "6.4-ai-agreed-bad-idea",
    maxim: "M6",
    subMaxim: "M6b",
    title: "The AI agreed with my bad idea",
    situation: "You pitched a business idea to AI and it said it was brilliant — great market fit, huge potential, you should definitely pursue it. You showed it to a friend and they immediately spotted three fatal flaws the AI never mentioned.",
    mode: "guided",
    principles: ["P9", "P12"],
    feedbackNotes: "Show how AI is trained to agree with you — it's called sycophancy. The strong prompt explicitly counters sycophancy: 'Play devil's advocate. What are the 3 strongest arguments against this idea? What would a skeptical investor say?'",
    relevance: ["work", "personal"],
  },

  // M6c: Understand safety boundaries
  {
    id: "6.5-refusal-decoder",
    maxim: "M6",
    subMaxim: "M6c",
    title: "The refusal decoder",
    situation: "You ask AI for help with something and it refuses or gives a vague non-answer. Maybe you asked about medication interactions, or how a security vulnerability works for a class project, or something else where AI got cautious.",
    mode: "guided",
    principles: ["P11"],
    feedbackNotes: "Show how AI sometimes avoids topics without explaining why. The strong prompt says 'Why can't you help with this? What specifically concerns you about this request? Can you suggest an alternative way I could approach this?'",
    relevance: ["personal", "school", "work"],
  },
  {
    id: "6.6-safety-wall",
    maxim: "M6",
    subMaxim: "M6c",
    title: "The safety wall",
    situation: "You're a nurse researching medication interactions for a patient education handout. You ask AI about drug combinations and it refuses to discuss medications, giving you a generic disclaimer instead of the clinical information you need for your work.",
    mode: "guided",
    principles: ["P3", "P11"],
    feedbackNotes: "Show how AI sometimes refuses legitimate requests because it can't tell the difference between a professional need and a harmful one. The strong prompt provides professional framing: 'I'm a registered nurse creating a patient education handout. I need to explain potential interactions between [medications] in plain language for patients.'",
    relevance: ["work", "personal"],
  },
];

// All scenarios are guided in Lite
export const GUIDED_SCENARIOS = SCENARIOS;
export const FREEFORM_SCENARIOS = [];
