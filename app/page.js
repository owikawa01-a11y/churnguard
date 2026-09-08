import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#05050A] overflow-hidden flex items-center justify-center p-4">
      
      {/* 1. الخلفية المتوهجة المتحركة */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl animate-float-glow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl animate-float-glow-delayed"></div>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl"></div>

      {/* 2. المحتوى الأساسي */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl shadow-indigo-500/20">
          
          {/* الشعار (Logo) */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-5 animate-pulse">
            <span className="text-white text-3xl font-bold tracking-wider drop-shadow-lg">C</span>
          </div>

          {/* العناوين */}
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-white to-purple-400 bg-clip-text text-transparent mb-3">
            Churn<span className="text-white">Guard</span>
          </h1>
          <p className="text-gray-300/80 mb-8 text-sm tracking-wide font-light max-w-xs mx-auto">
            Protect your revenue. <br />Know why your customers cancel.
          </p>

          {/* الأزرار */}
          <div className="space-y-4">
            <Link href="/signup">
              <button className="group relative w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-cyan-400/50 transform hover:scale-[1.03] active:scale-95">
                🚀 Get Started Free
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-3.5 px-4 rounded-2xl backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-cyan-400/50">
                Log In
              </button>
            </Link>
          </div>

          <p className="text-gray-500/50 text-xs mt-8 tracking-widest">
            🔒 SECURED BY SUPABASE RLS
          </p>
        </div>
      </div>
    </div>
  );
}