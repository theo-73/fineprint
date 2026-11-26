import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FinePrint — Consumer Rights MCP Agent',
  description: 'Statutory Consumer Protection Agent under CPA 2019 & E-Commerce Rules 2020',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${sans.variable} ${mono.variable} font-sans min-h-screen bg-[#09090B] text-[#F4F4F6] antialiased selection:bg-[#FF2A1A]/30 selection:text-[#FFFFFF]`}>
        {children}
      </body>
    </html>
  );
}
