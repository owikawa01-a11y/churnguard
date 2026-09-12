import Link from 'next/link';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#05050c] text-white font-sans antialiased">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-slate-400 hover:text-white text-sm mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: September 13, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">1. Free Trial</h2>
            <p>We offer a 14-day free trial on all plans. You will not be charged during the trial period, and you may cancel at any time before it ends.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">2. Subscription Refunds</h2>
            <p>If you are not satisfied with the Service, you may request a full refund within 14 days of your first payment. After this period, refunds are issued at our discretion.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">3. How to Request a Refund</h2>
            <p>To request a refund, email us at <a href="mailto:akamss001+support@gmail.com" className="text-violet-400 hover:text-violet-300">akamss001+support@gmail.com</a> with your account email and reason for the request. We respond within 2 business days.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">4. Processing Time</h2>
            <p>Approved refunds are processed by Paddle within 5-10 business days. The refund will appear on your original payment method.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">5. Cancellation</h2>
            <p>You can cancel your subscription at any time from your dashboard. Cancellation stops future charges but does not automatically trigger a refund for the current period.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">6. Exceptions</h2>
            <p>Refunds are not provided for accounts terminated due to violations of our Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">7. Contact</h2>
            <p>For refund questions, contact us at <a href="mailto:akamss001+support@gmail.com" className="text-violet-400 hover:text-violet-300">akamss001+support@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}