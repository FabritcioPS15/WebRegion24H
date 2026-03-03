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

