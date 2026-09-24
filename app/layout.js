import './globals.css';

export const metadata = {
  title: 'RetainPulse - Stop Losing Customers Silently',
  description: 'AI-powered churn reduction and retention service for indie SaaS founders.',
  metadataBase: new URL('https://retainpulse.com'),
  openGraph: {
    title: 'RetainPulse - Stop Losing Customers Silently',
    description: 'AI-powered churn reduction and retention service for indie SaaS founders.',
    url: 'https://retainpulse.com',
    siteName: 'RetainPulse',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RetainPulse - Stop Losing Customers Silently',
    description: 'AI-powered churn reduction and retention service for indie SaaS founders.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}