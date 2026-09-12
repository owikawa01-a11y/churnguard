import './globals.css';

export const metadata = {
  title: 'ChurnGuard - Stop Losing Customers Silently',
  description: 'AI-powered churn reduction for indie SaaS founders.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="bg-[#05050c] border-t border-white/[0.06] py-8 px-6 text-center">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2026 ChurnGuard. All rights reserved.</p>
            <nav className="flex gap-6">
              <a href="/terms" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="/refund" className="hover:text-slate-300 transition-colors">Refund</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}