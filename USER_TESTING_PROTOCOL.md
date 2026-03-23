# PromptBridge — User Testing Protocol

A guide for conducting informal usability testing with 5-10 participants to identify issues and improve the learning experience.

## Recruitment criteria

**Target participants:**
- People who have used AI tools (ChatGPT, Gemini, etc.) fewer than 10 times
- No technical background required
- Diverse in age, profession, and comfort with technology
- Mix of people who have never used AI tools and light users

**Where to find them:**
- Friends, family, or coworkers who match the criteria
- Local community groups or meetups
- University students (non-CS majors)

**Aim for 5-10 participants.** Research consistently shows that 5 users reveal ~80% of usability issues.

## Before the session

1. Open PromptBridge in a clean browser profile (no saved progress)
2. Have a notepad or recording app ready
3. Set up screen sharing or sit beside the participant
4. Allocate 20-30 minutes per session

## Test script

Read this to the participant at the start:

> "I'm testing a tool that helps people learn to communicate with AI assistants like ChatGPT. I'd like you to try it out for about 20 minutes. There are no right or wrong answers — I'm testing the tool, not you. Please think out loud as you go. If anything is confusing, that's the tool's fault, not yours."

## Task list

### Task 1: First impressions (2 min)
- Show the participant the landing page
- Ask: "What do you think this tool does?"
- Ask: "What would you click first?"
- Observe: Do they read the demo? Do they click "Try It Yourself"?

### Task 2: Complete 2 guided scenarios (10 min)
- Ask them to try the first guided scenario (snow shoveling)
- Observe: Do they understand the three options? Do they read all three before picking?
- After seeing results: Do they read the feedback? Do they understand the side-by-side comparison?
- Ask them to continue to a second scenario
- Observe: Is the flow between scenarios clear?

### Task 3: Try "Write Your Own" mode (5 min)
- Ask them to pick a freeform scenario and write their own prompt
- Observe: Do they know what to write? Do they struggle with the blank textarea?
- If no API key: Do they find the Copy & Try flow useful?
- If API key available: Do they understand the analysis and comparison?

### Task 4: Explore (3 min)
- Ask them to look at their Progress page
- Ask: "What skills have you practiced?"
- Ask them to find the Help page
- Observe: Is navigation intuitive?

## Observation checklist

During each session, note:

**Navigation:**
- [ ] Did the user find the CTA on the landing page?
- [ ] Did they understand the guided/freeform tabs?
- [ ] Did they use the header navigation?
- [ ] Did they find the Help page?

**Guided mode:**
- [ ] Did they read all three options before picking?
- [ ] Did they understand the side-by-side comparison immediately?
- [ ] Did they read the feedback panel?
- [ ] Did the feedback feel helpful or preachy?
- [ ] Did they try "Now Write Your Own" or skip it?
- [ ] Did they try "Try Again" (round 2)?

**Freeform mode:**
- [ ] Did they know what to write in the textarea?
- [ ] Did they find the Copy & Try flow useful?
- [ ] Did the analysis feel accurate and helpful?

**Feedback tone:**
- [ ] Did any feedback make them defensive or frustrated?
- [ ] Did they feel encouraged to continue?
- [ ] Were the tips actionable?

**Confusion points:**
- [ ] Where did they hesitate or look confused?
- [ ] Did they click something that didn't do what they expected?
- [ ] Did they miss any important UI elements?

## Post-session questions

Ask after they've finished the tasks:

1. "What was the most useful part of the tool?"
2. "Was there anything confusing or frustrating?"
3. "Would you use this again? Why or why not?"
4. "Is there anything you wish it did differently?"
5. "How would you explain this tool to a friend?"
6. "Did the feedback after each scenario feel helpful? Too much? Too little?"

## Recording results

For each participant, record:

```
Participant: [initials or number]
Date: [date]
AI experience: [none / light / moderate]
Profession: [general description]

Key observations:
- [What they did, said, or struggled with]

Quotes:
- "[Anything notable they said]"

Issues found:
1. [Specific issue and where it happened]
2. ...

Suggestions:
- [Any ideas they mentioned or you observed]
```

## Synthesizing findings

After all sessions:

1. **List all issues** found across participants
2. **Count frequency** — how many participants hit each issue?
3. **Prioritize** by frequency + severity:
   - **Critical:** 3+ participants struggled, blocks core task
   - **Major:** 2+ participants noticed, degrades experience
   - **Minor:** 1 participant noticed, cosmetic or edge case
4. **Identify patterns** — are issues clustered in one area (navigation, feedback, freeform)?
5. **Create action items** ranked by priority
