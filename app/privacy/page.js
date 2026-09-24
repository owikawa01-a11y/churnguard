import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#05050c] text-white font-sans antialiased">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-slate-400 hover:text-white text-sm mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: September 24, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly, including your name, email address, company name, and payment information (processed by Payoneer). We also collect cancellation event data submitted through the RetainPulse widget on your site.</p>
            <p className="mt-3">Specifically, from the widget, we collect:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>The cancellation reason the customer selected</li>
              <li>The customer's answer to the AI follow-up question (optional, customer-submitted)</li>
              <li>The customer's email (if your site passes it to the widget)</li>
              <li>The customer's monthly revenue value (if your site passes it to the widget)</li>
              <li>The customer's final decision (kept, paused, or cancelled)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">2. How We Use Information</h2>
            <p>We use your information to provide the Service, process payments, improve our product, and communicate with you about updates and support. We use cancellation event data to show you patterns in your own dashboard and to generate AI follow-up questions and retention offers specific to each customer's situation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">3. Data Storage and Security</h2>
            <p>Your data is stored securely on Supabase (PostgreSQL) with row-level security. We use industry-standard encryption for all data in transit and at rest. Access to production data is limited to the RetainPulse owner and requires authenticated access.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services to operate RetainPulse:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Payoneer</strong> – payment processing and invoicing</li>
              <li><strong>Supabase</strong> – database and authentication</li>
              <li><strong>Groq</strong> – AI processing for follow-up questions and retention offers</li>
              <li><strong>Upstash Redis</strong> – rate limiting and abuse prevention</li>
              <li><strong>Resend</strong> – transactional email delivery</li>
              <li><strong>Vercel</strong> – application hosting and content delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">5. Your Customers' Data</h2>
            <p>When the RetainPulse widget is installed on your site, you are the data controller for your customers' information. RetainPulse acts as a data processor on your behalf. You are responsible for ensuring your customers are informed that a cancellation flow collects feedback, and for complying with any applicable privacy laws (such as GDPR or CCPA) in your jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">6. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. Contact us at any time to exercise these rights. If you are in the EU/EEA, you also have the right to data portability and to lodge a complaint with a supervisory authority.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">8. Data Retention</h2>
            <p>We retain your account data as long as your account is active. Cancellation event data is retained indefinitely unless you request deletion, so that you can continue to analyze trends over time. After account termination, data is retained for 30 days before permanent deletion, unless required by law to be retained longer.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">9. Children's Privacy</h2>
            <p>The Service is not intended for users under 18. We do not knowingly collect data from children.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">10. Changes to This Policy</h2>
            <p>We may update this policy. Material changes will be communicated via email or through the Service. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">11. Contact</h2>
            <p>For privacy questions, contact us at <a href="mailto:hello@retainpulse.pro" className="text-violet-400 hover:text-violet-300">hello@retainpulse.pro</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}