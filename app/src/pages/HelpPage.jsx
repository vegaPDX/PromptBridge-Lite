import React from "react";
import {
  ArrowRight, HelpCircle, BookOpen, PenTool, Shield,
  AlertTriangle, ExternalLink, ChevronRight, Target, BarChart3,
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
      <p className="text-stone-600 mb-8">Everything you need to get started.</p>

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
          You'll practice with real-world scenarios — no setup required:
        </p>
        <div className="space-y-3">
          <ModeCard
            icon={<BookOpen className="w-4 h-4 text-indigo-500" />}
            title="Guided Practice"
            description="See a situation and predict which of three prompts would work best. Then see what each one actually produces — side by side. You'll get feedback on why one works better, then write your own version and try it in a real AI tool."
          />
          <ModeCard
            icon={<PenTool className="w-4 h-4 text-indigo-500" />}
            title="Write Your Own"
            description="Write your own request from scratch, check which skills you applied, then copy it and try it in any AI tool — ChatGPT, Claude, Gemini, or Copilot."
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
            description="Shows how many scenarios you've completed and which skills you've practiced. Visit it anytime from the header."
          />
          <ModeCard
            icon={<Target className="w-4 h-4 text-indigo-500" />}
            title="Skill Assessment"
            description="Take a quick 3-scenario assessment to measure your starting point. After completing 10+ scenarios, take it again to see how much you've improved. Find it on the Progress page."
          />
        </div>
        <p className="mt-3 text-stone-600 text-sm">
          When you first visit the scenario list, you'll also see a question: "What do you use AI for?"
          This is optional — if you answer, it helps surface the most relevant scenarios for you first.
        </p>
      </Section>

      {/* What are the skills? */}
      <Section title="What are the skills?">
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
                  <p className="font-medium text-stone-800 text-sm">{p.name}</p>
                  <p className="text-stone-600 text-sm">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Using AI wisely — Link to dedicated page */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="font-serif text-lg font-bold text-stone-800">Using AI wisely</h2>
        </div>
        <p className="text-stone-700 text-base mb-3">
          AI tools are powerful, but they have real limitations — they can make things up,
          agree with your mistakes, and reflect biases. We've put together a guide covering
          everything you need to know to use AI safely.
        </p>
        <button
          onClick={() => onNavigate("ai-safety")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Read the Guide <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Do I need an account? */}
      <Section title="Do I need an account?">
        <p>
          No. There's nothing to sign up for. Your progress is saved automatically in your
          browser. If you clear your browser data, your progress will reset — but you can
          always start fresh.
        </p>
      </Section>

      {/* How to use with your favorite AI tool */}
      <Section title="How to use with your favorite AI tool">
        <p className="mb-3">
          PromptBridge teaches the skills — then you practice them in real AI tools. Here's the workflow:
        </p>
        <ol className="space-y-2 list-none">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">1</span>
            <span><strong>Practice a scenario</strong> in PromptBridge to learn the skill.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">2</span>
            <span><strong>Write your own prompt</strong> and check which skills you applied.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">3</span>
            <span><strong>Copy your prompt</strong> and open your favorite AI tool.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">4</span>
            <span><strong>Paste and send.</strong> See how the AI responds to your prompt.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">5</span>
            <span><strong>Come back and improve.</strong> Try again with what you learned.</span>
          </li>
        </ol>
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { name: "ChatGPT", url: "https://chatgpt.com" },
            { name: "Claude", url: "https://claude.ai" },
            { name: "Gemini", url: "https://gemini.google.com" },
            { name: "Copilot", url: "https://copilot.microsoft.com" },
          ].map(tool => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              {tool.name} <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </Section>

      {/* Is my data private? */}
      <Section title="Is my data private?">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p>
              Everything stays in your browser. Your progress is stored
              locally on your device — nothing is sent to any server because there aren't any.
              PromptBridge is a fully static site with no backend.
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
      <div className="text-stone-700 text-base leading-relaxed">{children}</div>
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
          <p className="font-medium text-stone-800 text-sm">{title}</p>
          {badge && (
            <span className="text-xs px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded font-medium">{badge}</span>
          )}
        </div>
        <p className="text-stone-600 text-sm mt-0.5">{description}</p>
      </div>
    </div>
  );
}

