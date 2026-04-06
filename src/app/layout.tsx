import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Family Recipe Vault | Preserve Your Culinary Legacy',
  description:
    'A beautiful digital vault to store, organize, and share your most treasured family recipes. Keep your culinary heritage alive for generations to come.',
  keywords: 'family recipes, recipe vault, cooking, family cookbook, recipe organizer',
  openGraph: {
    title: 'Family Recipe Vault',
    description: "Preserve your family's culinary legacy forever.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
