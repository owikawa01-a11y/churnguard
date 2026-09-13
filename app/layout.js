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
      </body>
    </html>
  );
}