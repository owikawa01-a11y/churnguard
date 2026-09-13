import Link from 'next/link';

// ===========================================
//  SVG Icons
// ===========================================
const IconCheck = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const IconBrain = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const IconChart = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconRocket = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const IconShield = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconBolt = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// ===========================================
//  Main Component
// ===========================================
export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#05050c] text-white font-sans antialiased overflow-x-hidden">

      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-violet-600/[0.12] rounded-full blur-[150px]"></div>
        <div className="absolute top-[30%] right-[-15%] w-[700px] h-[700px] bg-fuchsia-600/[0.08] rounded-full blur-[130px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/[0.05] rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10">

        {/* ═══════ Navbar ═══════ */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl blur-md opacity-40"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white text-lg font-black">C</span>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight">ChurnGuard</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
                Log In
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-[1.02]">
                Start Free
              </button>
            </Link>
          </div>
        </nav>

        {/* ═══════ Hero ═══════ */}
        <section className="max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            14-day free trial · No credit card required
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            <span className="bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-transparent">
              Stop losing customers
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              silently.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            ChurnGuard asks your customers the right questions when they cancel — and gives them one
            reason to stay. All in one line of code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/signup">
              <button className="group relative px-8 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden transition-transform hover:scale-[1.03] active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-2xl shadow-xl shadow-violet-500/30"></div>
                <span className="relative flex items-center gap-2">
                  Start free — 5 min setup
                  <IconArrowRight />
                </span>
              </button>
            </Link>

            <a href="#how-it-works">
              <button className="px-8 py-4 rounded-2xl text-base font-medium text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all">
                See how it works
              </button>
            </a>
          </div>

          <p className="text-xs text-slate-500">
            Built for indie SaaS · No sales calls · Cancel anytime
          </p>
        </section>

        {/* ═══════ Problem Section ═══════ */}
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-4">The Problem</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
              You're losing revenue
              <br />
              <span className="text-slate-500">and you don't know why.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Every month, customers cancel. Some leave a feedback form. Most just disappear. You're left
              guessing — while your MRR quietly shrinks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5">
                <IconClose />
              </div>
              <h3 className="text-base font-semibold mb-2">Silent churn</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                70% of customers who cancel never tell you why. You lose them without a single signal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                <IconChart />
              </div>
              <h3 className="text-base font-semibold mb-2">Generic surveys</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Multi-choice forms give you data, not insight. You need to know the real reason behind the
                reason.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-5">
                <IconBrain />
              </div>
              <h3 className="text-base font-semibold mb-2">No retention play</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Without a way to intervene at the moment of cancellation, you never get a chance to save
                them.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ How It Works ═══════ */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-4">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
              Up and running in under 5 minutes
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              No SDK. No sales calls. No backend changes. Just one script tag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06]">
              <div className="absolute top-6 right-6 text-6xl font-black text-white/[0.03] leading-none">01</div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-300 mb-6">
                  <IconBolt />
                </div>
                <h3 className="text-lg font-semibold mb-3">Paste one script tag</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Add a single line to your app. No SDK, no backend changes, no dev sprint.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06]">
              <div className="absolute top-6 right-6 text-6xl font-black text-white/[0.03] leading-none">02</div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/25 flex items-center justify-center text-fuchsia-300 mb-6">
                  <IconBrain />
                </div>
                <h3 className="text-lg font-semibold mb-3">AI asks the right question</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  When someone clicks cancel, ChurnGuard asks a smart, contextual follow-up — not a
                  generic survey.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06]">
              <div className="absolute top-6 right-6 text-6xl font-black text-white/[0.03] leading-none">03</div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-300 mb-6">
                  <IconRocket />
                </div>
                <h3 className="text-lg font-semibold mb-3">Save them with one offer</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Show a single, reason-matched retention offer — and watch your save rate climb.
                </p>
              </div>
            </div>
          </div>

          {/* Code Preview */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-black/40 border border-white/[0.06] overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
                <span className="ml-3 text-xs text-slate-500 font-mono">install.html</span>
              </div>
              <pre className="p-5 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`<script src="https://churnguard.com/widget.js"></script>
<script>
  window.ChurnGuardConfig = {
    publicKey: "your_public_key"
  };
</script>
<button data-churnguard-trigger>Cancel subscription</button>`}
              </pre>
            </div>
          </div>
        </section>

        {/* ═══════ Features Grid ═══════ */}
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-4">Built for indie SaaS</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
              Everything you need.<br />
              <span className="text-slate-500">Nothing you don't.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'AI follow-up questions', desc: 'Goes deeper than the first reason. Understands the real why.' },
              { title: 'One retention offer', desc: 'Reason-matched. Compliant with California ARA 2025.' },
              { title: 'Recovered Revenue tracking', desc: 'See exactly how much MRR you saved this month.' },
              { title: 'Save rate analytics', desc: 'Track the percentage of cancel attempts you actually save.' },
              { title: 'Zero-config install', desc: 'One script tag. Works with any frontend, any stack.' },
              { title: 'Dashboard, not a data dump', desc: 'Clean insights you can act on — not another spreadsheet.' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/30 transition-colors duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300 mb-4">
                  <IconCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ Pricing Preview ═══════ */}
        <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
              Simple, honest pricing
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Cheaper than a single lost customer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Starter */}
            <div className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-sm text-slate-500 mb-6">For indie founders just getting started</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold tracking-tight">$29</span>
                <span className="text-slate-500 text-sm">/month</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">14-day free trial · Cancel anytime</p>
              <Link href="/pricing">
                <button className="w-full py-3.5 rounded-xl text-sm font-semibold bg-white/[0.05] text-white border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all">
                  Start free trial
                </button>
              </Link>
            </div>

            {/* Pro */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-violet-500/[0.08] to-fuchsia-500/[0.04] border-2 border-violet-500/40 shadow-2xl shadow-violet-500/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold tracking-wider uppercase shadow-lg">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-sm text-slate-400 mb-6">For growing SaaS teams</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold tracking-tight">$79</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">14-day free trial · Cancel anytime</p>
              <Link href="/pricing">
                <button className="w-full py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all">
                  Start free trial
                </button>
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            <Link href="/pricing" className="text-violet-400 hover:text-violet-300 transition-colors">
              See full pricing and features →
            </Link>
          </p>
        </section>

        {/* ═══════ FAQ ═══════ */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-20 border-t border-white/[0.04]">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Common questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Why is this so much cheaper than enterprise churn tools?',
                a: "Because we built this for solo founders and small teams, not companies with a dedicated retention budget. You get the core of what matters — knowing why people leave, and a genuine shot at keeping some of them — without paying for features built for teams 100x your size.",
              },
              {
                q: 'Do I need a developer to install this?',
                a: "No. It's one script tag and one button attribute. Most people have it live in under 5 minutes.",
              },
              {
                q: 'Will this feel manipulative to my customers?',
                a: 'No fake urgency, no hidden cancel buttons, no dark patterns. Customers always see a clear way to finish cancelling at every step — we only ask once, and we mean it when we say "no hard feelings" if they decline.',
              },
              {
                q: 'What happens to the data?',
                a: "It's yours. Every reason, every answer, every offer outcome lives in your dashboard, exportable anytime.",
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel with one click from your dashboard. No emails, no phone calls, no friction.',
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
              >
                <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-white">{item.q}</span>
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 group-open:rotate-45 transition-transform duration-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ═══════ Final CTA ═══════ */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="relative p-10 md:p-16 rounded-3xl bg-gradient-to-br from-violet-500/[0.08] via-fuchsia-500/[0.04] to-transparent border border-violet-500/20 overflow-hidden text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/[0.15] rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
                Ready to stop losing customers?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Join the founders who are turning cancellations into conversations — and some of those
                conversations into saved revenue.
              </p>

              <Link href="/signup">
                <button className="group relative px-10 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden transition-transform hover:scale-[1.03] active:scale-95">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500"></div>
                  <div className="absolute inset-0 rounded-2xl shadow-xl shadow-violet-500/40"></div>
                  <span className="relative flex items-center gap-2">
                    Start your free trial
                    <IconArrowRight />
                  </span>
                </button>
              </Link>

              <p className="text-xs text-slate-500 mt-6">
                14 days free · No credit card required · Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ Footer ═══════ */}
        <footer className="border-t border-white/[0.06] py-10 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white text-sm font-black">C</span>
              </div>
              <span className="text-sm text-slate-500">© 2026 ChurnGuard. All rights reserved.</span>
            </div>

            <nav className="flex gap-6 text-sm text-slate-500">
              <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
              <Link href="/refund" className="hover:text-slate-300 transition-colors">Refund</Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}