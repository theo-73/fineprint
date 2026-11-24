import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FinePrint — Consumer Rights MCP Agent',
  description: 'Statutory Consumer Protection Agent under CPA 2019 & E-Commerce Rules 2020 | Track 1 wHACKiest 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
