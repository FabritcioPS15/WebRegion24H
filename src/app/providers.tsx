'use client';

import { NewsProvider } from '../context/NewsContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <NewsProvider>{children}</NewsProvider>;
}

