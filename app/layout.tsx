import type { Metadata } from 'next';
import { gmarketSans, spoqaHanSansNeo } from '@/fonts';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: '쇼핑몰 상품 크롤링',
  description: '쇼핑몰 상품 목록 및 상세정보 크롤링 서비스',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script
          src="https://insight-board-omega.vercel.app/track.js"
          data-project-id="Crawler"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${spoqaHanSansNeo.className} ${gmarketSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
