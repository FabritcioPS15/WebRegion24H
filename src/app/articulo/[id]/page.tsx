import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';

import ArticleDetailServer from '../../../components/ArticleDetailServer';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

type Params = { id: string };

export const revalidate = 10;

const ARTICLE_SELECT =
  'id,slug,title,subtitle,content,category,date,time,image,author,tags,featured,breaking,created_at,links,status,pull_quote,pullquote,intro';

const RECO_SELECT = 'id,slug,title,category,date,time,image,created_at,status';

// Generar páginas estáticas para todos los artículos
export async function generateStaticParams() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: articles } = await supabase
      .from('news')
      .select('id, slug')
      .or('status.is.null,status.eq.published');

    const params = (articles || [])
      .filter((article) => article && article.id)
      .map((article) => ({
        id: article.slug || article.id,
      }));

    // Si no hay artículos, generar al menos una página para evitar error de export
    if (params.length === 0) {
      return [{ id: 'placeholder' }];
    }

    return params;
  } catch (error) {
    console.error('Error en generateStaticParams:', error);
    // Fallback para evitar que falle el build
    return [{ id: 'placeholder' }];
  }
}

const getArticleBySlugOrId = cache(async (slugOrId: string) => {
  if (slugOrId === 'new_draft_id' || slugOrId === 'placeholder') return null;
  const supabase = createSupabaseServerClient();

  // Primero intenta por slug (SEO)
  const { data: bySlug, error: slugError } = await supabase
    .from('news')
    .select(ARTICLE_SELECT)
    .eq('slug', slugOrId)
    .maybeSingle();

  if (bySlug) return bySlug;

  // Fallback por UUID (compatibilidad con links antiguos)
  const { data: byId, error: idError } = await supabase
    .from('news')
    .select(ARTICLE_SELECT)
    .eq('id', slugOrId)
    .maybeSingle();

  if (!byId && (slugError || idError)) {
    console.error(`[getArticleBySlugOrId] Error buscando "${slugOrId}":`, {
      slugError: slugError?.message,
      idError: idError?.message,
    });
  }

  return byId;
});

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { id } = await params;
  const row = await getArticleBySlugOrId(id).catch(() => null);

  if (!row) {
    return {
      title: 'Artículo no encontrado',
      robots: { index: false, follow: false },
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://noticias24h.pe';
  const title = (row.title as string) || 'Artículo';
  const description =
    (row.subtitle as string) ||
    (row.content
      ? String(row.content).slice(0, 160)
      : 'Lee este artículo en NOTICIAS 24H');

  const image = (row.image as string) || undefined;
  const slug = (row.slug as string) || (row.id as string);
  const articleUrl = `${siteUrl}/articulo/${slug}`;

  return {
    title: `${title} | NOTICIAS 24H`,
    description,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title,
      description,
      url: articleUrl,
      siteName: 'NOTICIAS 24H',
      type: 'article',
      locale: 'es_PE',
      ...(image
        ? { images: [{ url: image, width: 1200, height: 630, alt: title }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ArticleByIdPage(
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const row = await getArticleBySlugOrId(id).catch(() => null);

  if (!row) notFound();

  // Si se accedió por UUID pero hay un slug, redirigir al slug
  if (id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    // Se accedió por UUID
    if (row.slug) {
      // Existe un slug, redirigir
      redirect(`/articulo/${row.slug}`);
    }
  }

  const article = {
    id: String(row.id),
    slug: (row.slug as string) || undefined,
    title: String(row.title ?? ''),
    subtitle: (row.subtitle ?? undefined) as string | undefined,
    pullQuote: (row.pull_quote ?? row.pullquote ?? undefined) as string | undefined,
    intro: (row.intro ?? undefined) as string | undefined,
    content: String(row.content ?? ''),
    category: String(row.category ?? ''),
    date: String(row.date ?? ''),
    time: (row.time ?? undefined) as string | undefined,
    image: String(row.image ?? ''),
    author: (row.author ?? undefined) as string | undefined,
    tags: (row.tags ?? undefined) as string[] | undefined,
    featured: (row.featured ?? false) as boolean,
    breaking: (row.breaking ?? false) as boolean,
    links: (row.links ?? undefined) as
      | { label: string; url: string }[]
      | undefined,
    status: (row.status ?? undefined) as
      | 'published'
      | 'hidden'
      | 'draft'
      | 'pending'
      | undefined,
  };

  const supabase = createSupabaseServerClient();
  const { data: recentRows } = await supabase
    .from('news')
    .select(RECO_SELECT)
    .or('status.is.null,status.eq.published')
    .order('created_at', { ascending: false })
    .limit(60);

  const recent = (recentRows || [])
    .filter((r: any) => r && r.id)
    .map((r: any) => ({
      id: String(r.id),
      slug: (r.slug as string) || undefined,
      title: String(r.title ?? ''),
      category: String(r.category ?? ''),
      date: String(r.date ?? ''),
      time: (r.time ?? undefined) as string | undefined,
      image: String(r.image ?? ''),
    }));

  const related = recent
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const more = recent
    .filter((a) => a.id !== article.id && a.category !== article.category)
    .slice(0, 3);

  const mostRead = recent.filter((a) => a.id !== article.id).slice(0, 5);

  return (
    <ArticleDetailServer
      article={article}
      related={related}
      more={more}
      mostRead={mostRead}
    />
  );
}