import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#05050c] text-white font-sans antialiased">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-slate-400 hover:text-white text-sm mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: September 13, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using ChurnGuard ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">2. Description of Service</h2>
            <p>ChurnGuard is a software-as-a-service tool that helps businesses understand why their customers cancel subscriptions and provides retention offers to reduce churn.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">3. Account Registration</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">4. Subscriptions and Billing</h2>
            <p>Subscriptions are billed monthly or annually through our payment processor, Paddle. Prices are listed on our Pricing page and may change with 30 days notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">5. Free Trial</h2>
            <p>New customers receive a 14-day free trial. You may cancel anytime during the trial without being charged.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">6. Acceptable Use</h2>
            <p>You agree not to use the Service for any illegal purpose, to attempt to gain unauthorized access, or to interfere with the Service's operation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">7. Intellectual Property</h2>
            <p>ChurnGuard and its original content, features, and functionality are owned by us and are protected by international copyright laws.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">8. Limitation of Liability</h2>
            <p>The Service is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">9. Termination</h2>
            <p>We may terminate or suspend your account at any time for violations of these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">10. Changes to Terms</h2>
            <p>We reserve the right to modify these terms. Continued use of the Service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">11. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:akamss001+support@gmail.com" className="text-violet-400 hover:text-violet-300">akamss001+support@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}