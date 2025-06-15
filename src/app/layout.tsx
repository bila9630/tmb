import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TMB - Healthcare Challenge',
  description: 'A demo of the Realtime Agent framework in Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
