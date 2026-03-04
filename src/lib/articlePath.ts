import { slugify } from './slug';

/**
 * Generates the canonical URL path for an article.
 * Uses slug if available, falls back to UUID id.
 */
export function getArticlePath(article: { id: string; slug?: string; title?: string; category?: string }): string {
    const slug = article.slug || (article.title ? slugify(article.title) : article.id);
    const categoria = article.category ? slugify(article.category) : 'noticias';
    return `/${categoria}/${slug}`;
}
