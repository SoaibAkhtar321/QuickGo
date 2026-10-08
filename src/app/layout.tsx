import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuickGo - Multi-Service Delivery Platform',
  description:
    'Interactive prototype for QuickGo: fast, reliable local delivery connecting Customers, Businesses, Delivery Partners, and Super Admins.',
  openGraph: {
    title: 'QuickGo - Multi-Service Delivery Platform',
    description:
      'Interactive prototype for QuickGo: fast, reliable local delivery connecting Customers, Businesses, Delivery Partners, and Super Admins.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8F9FA] text-[#171717] antialiased selection:bg-red-500/20 selection:text-red-700">
        {children}
      </body>
    </html>
  );
}
