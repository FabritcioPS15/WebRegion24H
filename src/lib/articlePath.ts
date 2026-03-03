import { slugify } from './slug';

/**
 * Generates the canonical URL path for an article.
 * Uses slug if available, falls back to UUID id.
 */
export function getArticlePath(article: { id: string; slug?: string; title?: string }): string {
    const slug = article.slug || (article.title ? slugify(article.title) : article.id);
    return `/articulo/${slug}`;
}
