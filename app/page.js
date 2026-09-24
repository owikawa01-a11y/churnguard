import Link from 'next/link';

// ===========================================
//  Brand Logo
// ===========================================
const Logo = ({ size = "md" }) => {
  const dims = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const icon = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const text = size === "sm" ? "text-base" : "text-lg";
  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative ${dims} rounded-[10px] bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30`}>
        <div className="absolute inset-0 rounded-[10px] bg-gradient-to-tr from-transparent via-white/25 to-transparent"></div>
        <svg className={`${icon} text-white relative`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h3l2-7 4 14 2-7h7" />
        </svg>
      </div>
      <span className={`${text} font-bold tracking-tight`}>
        Retain<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Pulse</span>
      </span>
    </div>
  );
};

// ===========================================
//  Icons
// ===========================================
const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
const IconCheck = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IconClose = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
const IconBolt = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
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
const IconStar = () => (
  <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

// ===========================================
//  Main Page
// ===========================================
export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#05050c] text-white font-sans antialiased overflow-x-hidden">

      {/* Background layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at 50% 0%, black 40%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 40%, transparent 75%)",
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] bg-violet-600/[0.14] rounded-full blur-[160px]"></div>
        <div className="absolute top-[35%] right-[-15%] w-[700px] h-[700px] bg-fuchsia-600/[0.09] rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] bg-emerald-600/[0.05] rounded-full blur-[130px]"></div>
      </div>

      <div className="relative z-10">

        {/* ═══════════ Navbar ═══════════ */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#05050c]/70 border-b border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Logo />

            <div className="hidden md:flex items-center gap-1 text-sm text-slate-400">
              {[
                ["How it works", "#how-it-works"],
                ["Features", "#features"],
                ["Pricing", "#pricing"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                <a key={href} href={href} className="px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.04] transition-all">
                  {label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="hidden sm:block px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
                  Log in
                </button>
              </Link>
              <Link href="/signup">
                <button className="group relative px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center gap-1.5">
                    Start free
                    <IconArrowRight />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* ═══════════ Hero ═══════════ */}
        <section className="max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-20 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300 text-xs font-medium mb-8 backdrop-blur-sm">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
              <span className="relative w-2 h-2 rounded-full bg-emerald-400"></span>
            </span>
            <span>14-day free trial · No credit card required</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.03em] leading-[0.98] mb-7">
            <span className="bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent">
              Stop losing customers
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              silently.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            RetainPulse asks your customers the right questions when they cancel — and gives them one
            reason to stay. All in one line of code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link href="/signup">
              <button className="group relative px-7 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-violet-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-violet-600 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Start free — 5 min setup
                  <IconArrowRight />
                </span>
              </button>
            </Link>
            <a href="#how-it-works">
              <button className="px-7 py-4 rounded-2xl text-base font-medium text-slate-200 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.16] transition-all backdrop-blur-sm">
                See how it works
              </button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>No sales calls</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free 14 days</span>
            </div>
          </div>
        </section>

        {/* ═══════════ Trust Bar ═══════════ */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-slate-500 mb-6">
            Built for indie SaaS founders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40">
            {["MicroSaaS", "SoloStack", "IndieHQ", "LaunchPad", "ShipFast"].map((name) => (
              <span key={name} className="text-lg font-bold text-slate-400 tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* ═══════════ Problem ═══════════ */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.25em] mb-4">The Problem</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
              You're losing revenue
              <br />
              <span className="text-slate-500">and you don't know why.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Every month, customers cancel. Some leave a feedback form. Most just disappear. You're left
              guessing — while your MRR quietly shrinks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <IconClose />, color: "rose", title: "Silent churn", desc: "70% of customers who cancel never tell you why. You lose them without a single signal." },
              { icon: <IconChart />, color: "amber", title: "Generic surveys", desc: "Multi-choice forms give you data, not insight. You need to know the real reason behind the reason." },
              { icon: <IconBrain />, color: "violet", title: "No retention play", desc: "Without a way to intervene at the moment of cancellation, you never get a chance to save them." },
            ].map((item, i) => (
              <div key={i} className="relative p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 mb-5`}>
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ How It Works ═══════════ */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.25em] mb-4">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
              Up and running in under 5 minutes
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              No SDK. No sales calls. No backend changes. Just one script tag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: "01", icon: <IconBolt />, color: "violet", title: "Paste one script tag", desc: "Add a single line to your app. No SDK, no backend changes, no dev sprint." },
              { num: "02", icon: <IconBrain />, color: "fuchsia", title: "AI asks the right question", desc: "When someone clicks cancel, RetainPulse asks a smart, contextual follow-up — not a generic survey." },
              { num: "03", icon: <IconRocket />, color: "emerald", title: "Save them with one offer", desc: "Show a single, reason-matched retention offer — and watch your save rate climb." },
            ].map((step) => (
              <div key={step.num} className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] overflow-hidden">
                <div className="absolute top-5 right-6 text-7xl font-black text-white/[0.03] leading-none select-none">
                  {step.num}
                </div>
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-${step.color}-500/15 border border-${step.color}-500/25 flex items-center justify-center text-${step.color}-300 mb-6`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2.5">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Code block */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-black/50 border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/50">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
                <span className="ml-3 text-xs text-slate-500 font-mono">install.html</span>
              </div>
              <pre className="p-5 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`<script src="https://retainpulse.com/widget.js"></script>
<script>
  window.RetainPulseConfig = {
    publicKey: "your_public_key"
  };
</script>
<button data-retainpulse-trigger>Cancel subscription</button>`}
              </pre>
            </div>
          </div>
        </section>

        {/* ═══════════ Stats ═══════════ */}
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.04]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "70%", label: "of churn is silent" },
              { value: "5 min", label: "average setup time" },
              { value: "1 line", label: "of code to install" },
              { value: "30 days", label: "to see real signal" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-1.5">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ Features ═══════════ */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-24 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.25em] mb-4">Built for indie SaaS</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
              Everything you need.
              <br />
              <span className="text-slate-500">Nothing you don't.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'AI follow-up questions', desc: 'Goes deeper than the first reason. Understands the real why behind every cancellation.' },
              { title: 'One retention offer', desc: 'Reason-matched and compliant with California ARA 2025. No dark patterns.' },
              { title: 'Recovered Revenue tracking', desc: 'See exactly how much MRR you saved this month, in one clean number.' },
              { title: 'Save rate analytics', desc: 'Track the percentage of cancel attempts you actually save — per reason.' },
              { title: 'Zero-config install', desc: 'One script tag. Works with any frontend, any stack, any framework.' },
              { title: 'Dashboard, not a data dump', desc: 'Clean insights you can act on. Not another spreadsheet to decode.' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.03] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300 mb-4 group-hover:scale-110 transition-transform">
                  <IconCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ Testimonials ═══════════ */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.25em] mb-4">Founders say</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.05]">
              Built for people who ship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { quote: "Finally I know why people leave. Turns out my onboarding was the real problem — not the price.", name: "Sarah K.", role: "Founder, MicroSaaS" },
              { quote: "Set it up on a Friday. By Monday I'd already saved two customers I would have lost silently.", name: "Marcus T.", role: "Solo founder" },
              { quote: "The AI question is the killer feature. It surfaces the reason behind the reason.", name: "Priya R.", role: "Bootstrapper" },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <IconStar key={j} />)}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ Pricing ═══════════ */}
        <section id="pricing" className="max-w-5xl mx-auto px-6 py-24 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.25em] mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
              Simple, honest pricing
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Cheaper than a single lost customer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
              <h3 className="text-xl font-bold mb-1">Starter</h3>
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

            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-violet-500/[0.10] to-fuchsia-500/[0.04] border-2 border-violet-500/40 shadow-2xl shadow-violet-500/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold tracking-widest uppercase shadow-lg">
                Most popular
              </div>
              <h3 className="text-xl font-bold mb-1">Pro</h3>
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

        {/* ═══════════ FAQ ═══════════ */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-24 border-t border-white/[0.04]">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.25em] mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em]">Common questions</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: 'Why is this so much cheaper than enterprise churn tools?', a: "Because we built this for solo founders and small teams, not companies with a dedicated retention budget. You get the core of what matters — knowing why people leave, and a genuine shot at keeping some of them — without paying for features built for teams 100x your size." },
              { q: 'Do I need a developer to install this?', a: "No. It's one script tag and one button attribute. Most people have it live in under 5 minutes." },
              { q: 'Will this feel manipulative to my customers?', a: 'No fake urgency, no hidden cancel buttons, no dark patterns. Customers always see a clear way to finish cancelling at every step — we only ask once, and we mean it when we say "no hard feelings" if they decline.' },
              { q: 'What happens to the data?', a: "It's yours. Every reason, every answer, every offer outcome lives in your dashboard, exportable anytime." },
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel with one click from your dashboard. No emails, no phone calls, no friction.' },
            ].map((item, i) => (
              <details key={i} className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
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

        {/* ═══════════ Final CTA ═══════════ */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <div className="relative p-10 md:p-16 rounded-3xl bg-gradient-to-br from-violet-500/[0.10] via-fuchsia-500/[0.05] to-transparent border border-violet-500/20 overflow-hidden text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/[0.18] rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.05] mb-6">
                Ready to stop losing customers?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Join the founders who are turning cancellations into conversations — and some of those
                conversations into saved revenue.
              </p>

              <Link href="/signup">
                <button className="group relative px-9 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-violet-500/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500"></div>
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

        {/* ═══════════ Footer ═══════════ */}
        <footer className="border-t border-white/[0.06] py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
              <Logo size="sm" />
              <nav className="flex gap-6 text-sm text-slate-500">
                <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
                <Link href="/refund" className="hover:text-slate-300 transition-colors">Refund</Link>
                <a href="mailto:hello@retainpulse.com" className="hover:text-slate-300 transition-colors">Contact</a>
              </nav>
            </div>
            <div className="text-center text-xs text-slate-600">
              © 2026 RetainPulse. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}