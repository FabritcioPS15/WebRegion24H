import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import PodcastDetailClient from '../../../components/PodcastDetailClient';

type Params = { id: string };

const PODCAST_SELECT = 'id,slug,title,description,duration,image,link,live,created_at';

const getPodcastBySlugOrId = cache(async (slugOrId: string) => {
    const supabase = createSupabaseServerClient();

    // Try by slug
    const { data: bySlug } = await supabase
        .from('podcasts')
        .select(PODCAST_SELECT)
        .eq('slug', slugOrId)
        .maybeSingle();

    if (bySlug) return bySlug;

    // Fallback by ID (only if it looks like a UUID to avoid DB error)
    if (slugOrId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const { data: byId } = await supabase
            .from('podcasts')
            .select(PODCAST_SELECT)
            .eq('id', slugOrId)
            .maybeSingle();

        return byId;
    }

    return null;
});

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { id } = await params;
    const podcast = await getPodcastBySlugOrId(id);

    if (!podcast) {
        return { title: 'Podcast no encontrado' };
    }

    return {
        title: `${podcast.title} | PODCAST 24H`,
        description: podcast.description,
        openGraph: {
            title: podcast.title,
            description: podcast.description,
            images: [{ url: podcast.image }],
        }
    };
}

export default async function PodcastPage({ params }: { params: Promise<Params> }) {
    const { id } = await params;
    const podcast = await getPodcastBySlugOrId(id);

    if (!podcast) notFound();

    const supabase = createSupabaseServerClient();
    const { data: recentPodcasts } = await supabase
        .from('podcasts')
        .select(PODCAST_SELECT)
        .order('created_at', { ascending: false })
        .limit(20);

    return (
        <PodcastDetailClient 
            podcast={podcast} 
            recentPodcasts={recentPodcasts || []} 
        />
    );
}
