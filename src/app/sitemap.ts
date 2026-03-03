import type { MetadataRoute } from 'next';
import { createSupabaseServerClient } from '../lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noticias24h.pe';

  // Fetch all published articles directly using the /articulo/[id] route format
  const supabase = createSupabaseServerClient();
  const { data: articles } = await supabase
    .from('news')
    .select('id, created_at, date')
    .or('status.is.null,status.eq.published')
    .order('created_at', { ascending: false });

  const articleEntries: MetadataRoute.Sitemap = (articles || []).map((a) => ({
    url: `${siteUrl}/articulo/${a.id}`,
    lastModified: a.date ? new Date(a.date) : (a.created_at ? new Date(a.created_at) : new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/podcasts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...articleEntries,
  ];
}

