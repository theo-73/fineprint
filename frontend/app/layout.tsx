import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'FinePrint — Codified Consumer Statutory Defense',
  description: 'Deterministic Consumer Protection Agent under CPA 2019 & E-Commerce Rules 2020',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} font-sans min-h-screen bg-[#0C0C0E] text-[#F4F4F6] antialiased selection:bg-[#FF2A1A] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
