import Link from 'next/link';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#05050c] text-white font-sans antialiased">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-slate-400 hover:text-white text-sm mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: September 24, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">1. Overview</h2>
            <p>RetainPulse is a done-for-you service, not a recurring subscription. Our fees are structured in two milestones:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Installation fee:</strong> $100 (or Founding Member rate) — paid upfront before installation begins.</li>
              <li><strong>Management fee:</strong> $149 (or Founding Member rate) — paid after 7 days, once you've seen the value.</li>
            </ul>
            <p className="mt-3">This policy explains when each milestone is refundable.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">2. Installation Fee Refund ($100)</h2>
            <p>The installation fee covers the time and effort required to set up RetainPulse on your site within 48 hours. Because this is a hands-on service, the installation fee is refundable only under the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Before installation begins:</strong> Full refund if you cancel before we start the setup work.</li>
              <li><strong>If we fail to deliver:</strong> Full refund if we cannot complete the installation within 5 business days for reasons on our side.</li>
              <li><strong>If the widget doesn't work:</strong> Full refund if the installed widget fails to function on your site and we cannot fix it within 7 days.</li>
            </ul>
            <p className="mt-3">Once installation is complete and the widget is working, the installation fee is non-refundable.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">3. Management Fee Refund ($149)</h2>
            <p>The management fee covers 30 days of hands-on monitoring, offer optimization, and weekly insights. This fee is only charged after 7 days of installation — giving you a full week to see the widget in action before committing.</p>
            <p className="mt-3">If you decide not to continue before the management period begins, you do not pay the $149. If you pay it and are unsatisfied within the first 7 days of the management period, contact us and we will refund it in full.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">4. How to Request a Refund</h2>
            <p>To request a refund, email us at <a href="mailto:hello@retainpulse.pro" className="text-violet-400 hover:text-violet-300">hello@retainpulse.pro</a> with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your account email</li>
              <li>The invoice ID (found in your payment confirmation)</li>
              <li>A brief reason for the request</li>
            </ul>
            <p className="mt-3">We respond to all refund requests within 2 business days.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">5. Processing Time</h2>
            <p>Approved refunds are processed through Payoneer. The refund will be sent to your original payment method within 5–10 business days. You will receive a confirmation email once the refund is issued.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">6. What's Not Refundable</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The installation fee after installation is complete and the widget is functioning on your site.</li>
              <li>The management fee after the first 7 days of the management period.</li>
              <li>Fees for accounts terminated due to violations of our <Link href="/terms" className="text-violet-400 hover:text-violet-300">Terms of Service</Link>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">7. Service After 30 Days</h2>
            <p>After the 30-day management period ends, RetainPulse is yours to keep forever — no recurring fees. The widget and dashboard remain fully functional on your site. If you need ongoing management later, you can book a new service period at the current rate.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">8. Chargebacks</h2>
            <p>We ask that you contact us before initiating a chargeback. Most refund requests are resolved quickly and amicably. Filing a chargeback without contacting us first may result in a suspension of future service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">9. Contact</h2>
            <p>For refund questions, contact us at <a href="mailto:hello@retainpulse.pro" className="text-violet-400 hover:text-violet-300">hello@retainpulse.pro</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}