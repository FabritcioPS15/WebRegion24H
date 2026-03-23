/**
 * Generates the canonical URL path for a podcast.
 * Uses slug if available, falls back to slugified title or UUID id.
 */
export function getPodcastPath(podcast: { id: string; slug?: string; title?: string }): string {
    const slug = podcast.slug || podcast.id;
    return `/podcast/${slug}`;
}
