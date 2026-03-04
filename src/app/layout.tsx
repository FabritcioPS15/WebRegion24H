import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NOTICIAS 24H | Periodismo Independiente',
    template: '%s | NOTICIAS 24H',
  },
  description: 'Periódico digital: noticias, podcasts y videos con foco regional.',
  openGraph: {
    type: 'website',
    siteName: 'NOTICIAS 24H',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    // primary icon (used by most browsers)
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      // SVG version for modern browsers (keeps it sharp at any size)
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    // legacy shortcut icon for some older versions of IE/Edge
    shortcut: '/favicon.ico',
    // Apple touch (iOS) icon
    apple: '/apple-touch-icon.png',
    // mask-icon for Safari pinned tabs (uses monochrome version)
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#000000' }
    ]
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

