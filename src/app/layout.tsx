import React from 'react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CatalogViewer',
  description: 'View your academic grades and absences.',
  manifest: '/manifest.json', // Link to manifest
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
                <script dangerouslySetInnerHTML={{__html:`
if ('serviceWorker' in navigator && 'periodicSync' in ServiceWorkerRegistration.prototype) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sync/sw.js');
      // Request permission for periodic background sync
      const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
      if (status.state === 'granted') {
        // Service worker and permission are ready
        console.log('Service worker registered and periodic background sync granted.');
      } else {
        console.warn('Periodic background sync permission not granted:', status.state);
      }
    } catch (err) {
      console.error('Service worker registration or periodic sync failed:', err);
    }
  });
}`}}>
        </script>
        <meta name="application-name" content="CatalogViewer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CatalogViewer" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3F51B5" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3F51B5" />
        {/* Viewport settings are crucial for PWA responsiveness */}
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        {/* For the logo */}
        <link rel="apple-touch-icon" href="icons/apple-icon-180.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
      </head>
      <body className={`${roboto.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

// https://github.com/vercel/vercel/discussions/10117
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
