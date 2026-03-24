import React from "react";
import {
  AlertTriangle, ExternalLink, Link, Eye, Search,
  MessageSquare, Shield, ChevronLeft,
} from "lucide-react";

export default function AiSafetyPage({ onNavigate }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate("scenarios")}
        className="flex items-center gap-1 text-stone-500 hover:text-stone-700 text-sm mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to scenarios
      </button>

      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-6 h-6 text-amber-500" />
        <h1 className="font-serif text-3xl font-bold text-stone-800">Using AI Wisely</h1>
      </div>
      <p className="text-stone-600 mb-8">
        AI tools are powerful, but they have real limitations. Here's what every
        user should know — sourced from official guidance by Anthropic, OpenAI, and Google.
      </p>

      <div className="space-y-4">
        <RiskItem
          number="1"
          title="AI can sound confident and still be wrong"
          description="AI sometimes generates facts, statistics, citations, and even website URLs that don't exist — and presents them as if they're real. (The AI industry calls this a 'hallucination.')"
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
          action={`Be especially thoughtful when using AI for decisions that affect people — hiring, evaluations, recommendations. Try asking: "Check your response for any assumptions or one-sided perspectives."`}
        />
        <RiskItem
          number="6"
          title="AI knowledge has a cutoff date"
          description="AI models are trained on data up to a certain point. They may not know about recent events, new research, updated laws, or current prices."
          action="For time-sensitive topics, always verify with current sources."
        />
        <RiskItem
          number="7"
          title="AI is trained to agree with you"
          description="AI learned from human feedback that people prefer being agreed with. It will sometimes confirm your mistakes rather than correct them — even stating wrong 'facts' back to you with confidence."
          action={`Test this yourself: tell AI something incorrect and see if it pushes back. For important decisions, try saying: "Challenge my assumptions — what might I be getting wrong?"`}
          source="IBM Research (Miehling et al.)"
          sourceText="AI learned from human feedback that people prefer agreement — so models sometimes prioritize being agreeable over being accurate."
        />
        <RiskItem
          number="8"
          title="AI can't take real-world actions or verify itself"
          description="AI cannot browse the internet (unless a tool is connected), make phone calls, send emails, or check whether its own answers are correct against live sources. It also doesn't remember previous conversations unless memory is explicitly enabled."
          action={`Before relying on AI for anything time-sensitive or action-oriented, ask: "Can you actually access this information, or are you working from training data?" If it can't verify, you need to.`}
        />
        <RiskItem
          number="9"
          title="AI sometimes avoids topics without explaining why"
          description="AI has built-in safety filters that can make it refuse requests or give vague non-answers. This isn't random — it's usually because the topic touches a safety-sensitive area. But AI often won't tell you this unless you ask."
          action={`If AI refuses or dodges your question, try: "Why can't you help with this? What specifically is the concern? Can you suggest an alternative approach?" Most of the time, a small reframe gets you what you need.`}
        />
      </div>

      {/* Verification techniques */}
      <div className="mt-6 bg-white rounded-xl border border-amber-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-amber-600" aria-hidden="true" />
          <h2 className="font-semibold text-stone-800 text-sm">Quick verification techniques</h2>
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

      {/* CTA */}
      <div className="text-center pt-8 pb-4">
        <button
          onClick={() => onNavigate("scenarios")}
          className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
        >
          Start Practicing
        </button>
      </div>
    </div>
  );
}

/* ── Helper components ─────────────────────────────────────── */

function RiskItem({ number, title, description, action, source, sourceText }) {
  return (
    <div className="bg-white rounded-xl border border-amber-200 p-5">
      <div className="flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-amber-700" aria-hidden="true">
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-stone-800 text-base">{title}</h3>
          <p className="text-stone-700 text-sm mt-1">{description}</p>
          {action && (
            <p className="text-stone-700 text-sm mt-2">
              <strong>What to do:</strong> {action}
            </p>
          )}
          {source && sourceText && (
            <p className="text-stone-500 text-sm mt-2 italic">
              {source}: "{sourceText}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
