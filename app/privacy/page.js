import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#05050c] text-white font-sans antialiased">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-slate-400 hover:text-white text-sm mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: September 13, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly, including your name, email address, and payment information (processed by Paddle). We also collect cancellation event data submitted through our widget.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">2. How We Use Information</h2>
            <p>We use your information to provide the Service, process payments, improve our product, and communicate with you about updates and support.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">3. Data Storage and Security</h2>
            <p>Your data is stored securely on Supabase (PostgreSQL) with row-level security. We use industry-standard encryption for all data in transit and at rest.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Paddle</strong> – payment processing (Merchant of Record)</li>
              <li><strong>Supabase</strong> – database and authentication</li>
              <li><strong>Groq</strong> – AI processing for follow-up questions</li>
              <li><strong>Vercel</strong> – hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">5. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. Contact us at any time to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">7. Data Retention</h2>
            <p>We retain your data as long as your account is active. After cancellation, data is retained for 30 days before permanent deletion.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">8. Children's Privacy</h2>
            <p>The Service is not intended for users under 18. We do not knowingly collect data from children.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">9. Changes to This Policy</h2>
            <p>We may update this policy. Material changes will be communicated via email or through the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">10. Contact</h2>
            <p>For privacy questions, contact us at <a href="mailto:akamss001+support@gmail.com" className="text-violet-400 hover:text-violet-300">akamss001+support@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}