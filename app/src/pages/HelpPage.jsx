import React from "react";
import {
  ArrowRight, HelpCircle, BookOpen, PenTool, Shield,
  AlertTriangle, ExternalLink, Link, Eye, Search,
  MessageSquare, ChevronRight, RefreshCw, Target, BarChart3,
} from "lucide-react";
import { PRINCIPLES } from "../data/principles";
import { resolveIcon } from "../data/icon-map";

export default function HelpPage({ onNavigate }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-6 h-6 text-indigo-500" />
        <h1 className="font-serif text-3xl font-bold text-stone-800">Help</h1>
      </div>
      <p className="text-stone-500 mb-8">Everything you need to get started.</p>

      {/* What is PromptBridge? */}
      <Section title="What is PromptBridge?">
        <p>
          PromptBridge is a free, interactive tool that teaches you how to talk to AI assistants
          more effectively. The skills you learn here work with any AI tool — ChatGPT, Claude,
          Gemini, Copilot, or any other.
        </p>
        <p className="mt-2">
          You don't need any technical background. The tool meets you where you are and helps
          you build practical skills through hands-on practice.
        </p>
      </Section>

      {/* How does it work? */}
      <Section title="How does it work?">
        <p className="mb-3">
          You'll practice with real-world scenarios across four modes, from structured to open-ended:
        </p>
        <div className="space-y-3">
          <ModeCard
            icon={<BookOpen className="w-4 h-4 text-indigo-500" />}
            title="Guided Practice"
            description="You see a situation and three ways to ask an AI for help. Pick the one you think works best, then see what each one actually produces — side by side. You'll get feedback on why one works better. After that, you can try the scenario again with shuffled options, or write your own version from scratch."
          />
          <ModeCard
            icon={<PenTool className="w-4 h-4 text-indigo-500" />}
            title="Write Your Own"
            description="Write your own request from scratch for a given scenario. With an API key, you'll get AI-powered feedback showing what's strong, what to improve, and a side-by-side comparison. Without one, you can copy your prompt and try it in any AI tool."
          />
          <ModeCard
            icon={<MessageSquare className="w-4 h-4 text-indigo-500" />}
            title="Write First"
            badge="Requires API key"
            description="Write your request first, then see three variations of it at different quality levels. Evaluate which version is strongest and see the difference in AI responses. This helps you spot patterns in your own writing."
          />
          <ModeCard
            icon={<RefreshCw className="w-4 h-4 text-indigo-500" />}
            title="Practice Iterating"
            badge="Requires API key"
            description="Available on some scenarios. Write an initial request, see a mediocre AI response, then write a follow-up to improve it. You'll see how iterating on your request transforms the result — and get feedback on the full conversation."
          />
        </div>
      </Section>

      {/* Where should I start? */}
      <Section title="Where should I start?">
        <p>Here's a natural learning path:</p>
        <ol className="mt-2 space-y-2 list-none">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">1</span>
            <span><strong>Start with Guided Practice.</strong> The first scenario — "The snow shoveling problem" — takes about 2 minutes and shows you exactly how the tool works.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">2</span>
            <span><strong>Follow the recommendations.</strong> After each scenario, the tool suggests what to try next based on which skills you haven't practiced yet. Look for "Next" badges on the scenario list.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">3</span>
            <span><strong>Try writing your own.</strong> After a few guided scenarios, switch to "Write Your Own" to practice from scratch.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">4</span>
            <span><strong>Check your progress.</strong> The Progress page tracks which skills you've practiced and how many scenarios you've completed.</span>
          </li>
        </ol>
        <button
          onClick={() => onNavigate("scenarios")}
          className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Start Practicing <ArrowRight className="w-4 h-4" />
        </button>
      </Section>

      {/* Tracking your progress */}
      <Section title="Tracking your progress">
        <div className="space-y-3">
          <ModeCard
            icon={<BarChart3 className="w-4 h-4 text-indigo-500" />}
            title="Progress Page"
            description="Shows how many scenarios you've completed and which of the 8 skills you've practiced. Visit it anytime from the header."
          />
          <ModeCard
            icon={<Target className="w-4 h-4 text-indigo-500" />}
            title="Skill Assessment"
            description="Take a quick 3-scenario assessment to measure your starting point. After completing 10+ scenarios, take it again to see how much you've improved. Find it on the Progress page."
          />
        </div>
        <p className="mt-3 text-stone-500 text-xs">
          When you first visit the scenario list, you'll also see a question: "What do you use AI for?"
          This is optional — if you answer, it helps surface the most relevant scenarios for you first.
        </p>
      </Section>

      {/* What are the 8 skills? */}
      <Section title="What are the 8 skills?">
        <p className="mb-3">
          Every scenario teaches one or more of these communication skills:
        </p>
        <div className="space-y-2">
          {PRINCIPLES.map(p => {
            const Icon = resolveIcon(p.icon);
            return (
              <div key={p.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {Icon && <Icon className="w-3.5 h-3.5 text-indigo-500" />}
                </div>
                <div>
                  <p className="font-medium text-stone-700 text-sm">{p.name}</p>
                  <p className="text-stone-500 text-xs">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Using AI wisely — Risk awareness */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6" id="ai-safety">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="font-serif text-lg font-bold text-stone-800">Using AI wisely</h2>
        </div>
        <p className="text-stone-600 text-sm mb-4">
          AI tools are powerful, but they have real limitations. Here's what every
          user should know — sourced from official guidance by Anthropic, OpenAI, and Google.
        </p>

        <div className="space-y-4">
          <RiskItem
            number="1"
            title="AI can sound confident and still be wrong"
            description="AI sometimes generates facts, statistics, citations, and even website URLs that don't exist — and presents them as if they're real. This is called a 'hallucination.'"
            action={`Ask AI to "provide direct links to your sources." If a link doesn't work or a citation can't be found, treat the claim as unverified. This is one of the fastest ways to catch fabricated information.`}
            source="Anthropic"
            sourceText="Verify with citations — make the response auditable by having it cite quotes and sources for each claim."
          />
          <RiskItem
            number="2"
            title="Always review before you rely on it"
            description="AI output is a first draft, not a final answer. All three major AI companies require human review before acting on AI output for anything consequential."
            action="Read the output critically. Does it actually answer your question? Does anything sound off? Check key facts independently before sharing or acting on them."
            source="OpenAI"
            sourceText="Evaluate output for accuracy and appropriateness for your use case, including using human review as appropriate."
          />
          <RiskItem
            number="3"
            title="AI is not a doctor, lawyer, or financial advisor"
            description="All three major AI companies explicitly state their tools are not a substitute for professional advice. AI can help you prepare questions or understand concepts, but should never replace a licensed professional."
            source="Google"
            sourceText="Don't rely on the Services for medical, mental health, legal, financial, or other professional advice."
          />
          <RiskItem
            number="4"
            title="Be careful what you share"
            description="Information you put into AI prompts may be processed or stored by the provider."
            action='Before pasting text into an AI tool, ask yourself: "Would I be comfortable if this became public?" Never share passwords, personal identifiers, or confidential business data.'
          />
          <RiskItem
            number="5"
            title="AI can reflect biases"
            description="AI learns from existing text, which contains societal biases. Its suggestions may not be equally applicable across different backgrounds, cultures, or contexts."
            action="Be especially thoughtful when using AI for decisions that affect people — hiring, evaluations, recommendations."
          />
          <RiskItem
            number="6"
            title="AI knowledge has a cutoff date"
            description="AI models are trained on data up to a certain point. They may not know about recent events, new research, updated laws, or current prices."
            action="For time-sensitive topics, always verify with current sources."
          />
        </div>

        {/* Verification techniques */}
        <div className="mt-5 bg-white rounded-lg border border-amber-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-amber-600" />
            <p className="font-semibold text-stone-800 text-sm">Quick verification techniques</p>
          </div>
          <ul className="space-y-2 text-stone-600 text-sm">
            <li className="flex items-start gap-2">
              <Link className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span><strong>Ask for source links.</strong> If AI can't provide a working URL, the information may be fabricated.</span>
            </li>
            <li className="flex items-start gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span><strong>Ask "how confident are you?"</strong> Giving AI permission to express uncertainty drastically reduces false information.</span>
            </li>
            <li className="flex items-start gap-2">
              <Eye className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span><strong>Run the same question twice.</strong> If you get different answers, the information may not be reliable.</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span><strong>For documents:</strong> Tell AI to "only use information from the document I provided, not your general knowledge."</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Do I need an account? */}
      <Section title="Do I need an account?">
        <p>
          No. There's nothing to sign up for. Your progress is saved automatically in your
          browser. If you clear your browser data, your progress will reset — but you can
          always start fresh.
        </p>
      </Section>

      {/* What's a Gemini API key? */}
      <Section title="What's an API key? Do I need one?">
        <p>
          <strong>Guided Practice works with no setup at all</strong> — you can start right now.
          But some features use AI to analyze your writing in real time, and those need an API
          key. Think of it as a password that lets the app talk to an AI service on your behalf.
        </p>
        <div className="mt-3 bg-stone-50 rounded-lg border border-stone-200 p-3">
          <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-2">What works without a key</p>
          <ul className="text-stone-600 text-xs space-y-1">
            <li>All 30 Guided Practice scenarios (pick from options, see comparison, get feedback)</li>
            <li>Try Again (round 2) in guided mode</li>
            <li>Write Your Own with Copy & Try (no AI feedback, but you can paste into any AI tool)</li>
            <li>"Now Write Your Own" in guided mode with basic skill scoring</li>
            <li>Pre/post skill assessment</li>
          </ul>
        </div>
        <div className="mt-2 bg-stone-50 rounded-lg border border-stone-200 p-3">
          <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-2">What unlocks with a free key</p>
          <ul className="text-stone-600 text-xs space-y-1">
            <li>AI-powered feedback in Write Your Own mode (analysis + side-by-side comparison)</li>
            <li>Full AI analysis in "Now Write Your Own" within guided mode</li>
            <li>Write First mode (the AI creates variations of your prompt)</li>
            <li>Practice Iterating mode (multi-turn conversation practice)</li>
          </ul>
        </div>
        <p className="mt-3">
          Google offers free Gemini API keys that work great with PromptBridge.
        </p>
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
        >
          Get a free key at Google AI Studio <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <p className="mt-2 text-stone-500 text-xs">
          You can also use your own Claude (Anthropic) or OpenAI key if you have one.
          Go to <button onClick={() => onNavigate("settings")} className="text-indigo-500 hover:text-indigo-700 underline">Settings</button> to
          configure your key.
        </p>
      </Section>

      {/* Is my data private? */}
      <Section title="Is my data private?">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p>
              Everything stays in your browser. Your progress, settings, and API key are stored
              locally on your device — nothing is sent to PromptBridge servers because there aren't any.
            </p>
            <p className="mt-2">
              When you use Write Your Own mode with an API key, your prompts are sent directly from
              your browser to the AI provider you chose (Google, Anthropic, or OpenAI). PromptBridge
              never sees or stores those requests.
            </p>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <div className="text-center pt-4 pb-8">
        <button
          onClick={() => onNavigate("scenarios")}
          className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
        >
          Start Practicing <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* ── Helper components ─────────────────────────────────────── */

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-lg font-bold text-stone-800 mb-2">{title}</h2>
      <div className="text-stone-600 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ModeCard({ icon, title, description, badge }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-lg border border-stone-200 p-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-stone-700 text-sm">{title}</p>
          {badge && (
            <span className="text-xs px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded font-medium">{badge}</span>
          )}
        </div>
        <p className="text-stone-500 text-xs mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function RiskItem({ number, title, description, action, source, sourceText }) {
  return (
    <div className="bg-white rounded-lg border border-amber-100 p-4">
      <div className="flex items-start gap-3">
        <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-amber-700">
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-800 text-sm">{title}</p>
          <p className="text-stone-600 text-xs mt-1">{description}</p>
          {action && (
            <p className="text-stone-700 text-xs mt-2">
              <strong>What to do:</strong> {action}
            </p>
          )}
          {source && sourceText && (
            <p className="text-stone-400 text-xs mt-2 italic">
              {source}: "{sourceText}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
