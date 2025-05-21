import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const roboto = Roboto({
  weight: ['400', '500', '700'], // Regular, Medium, Bold
  subsets: ['latin'],
  display: 'swap', // Ensures text is visible while font loads
});

export const metadata: Metadata = {
  title: 'CatalogViewer',
  description: 'View your academic grades.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
