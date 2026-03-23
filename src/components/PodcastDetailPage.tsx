'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Calendar, Clock, ChevronRight, Home, Share2, Facebook, Twitter, Link2, Mic2 } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import OptimizedImage from './OptimizedImage';
import { Skeleton } from './LoadingSkeleton';
import AppLink from './AppLink';
import { getPodcastPath } from '../lib/podcastPath';
import GoogleAd from './GoogleAd';
import { useNews } from '../context/NewsContext';

export default function PodcastDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { podcasts, isLoading } = useNews();
    const [podcast, setPodcast] = useState<any>(null);

    useEffect(() => {
        if (podcasts.length > 0) {
            const found = podcasts.find(p => p.id === id || p.slug === id || (p.title && id && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id));
            setPodcast(found);
            
            if (found) {
                document.title = `${found.title} | PODCAST 24H`;
                window.scrollTo(0, 0);
            }
        }
    }, [id, podcasts]);

    if (isLoading && !podcast) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <Skeleton className="h-12 w-3/4 mb-6" />
                    <Skeleton className="aspect-video w-full mb-8" />
                    <Skeleton className="h-20 w-full mb-4" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!podcast) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-serif font-black text-accent mb-4">Podcast no encontrado</h1>
                        <AppLink to="/podcasts" className="text-brand hover:underline font-black uppercase tracking-widest text-xs">
                            Volver a Podcasts
                        </AppLink>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const otherPodcasts = podcasts.filter(p => p.id !== podcast.id).slice(0, 3);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <AppLink to="/" className="hover:text-brand transition-colors flex items-center gap-1">
                            <Home size={10} /> Inicio
                        </AppLink>
                        <ChevronRight size={10} />
                        <AppLink to="/podcasts" className="hover:text-brand transition-colors">Podcasts</AppLink>
                        <ChevronRight size={10} className="hidden md:block" />
                        <span className="hidden md:block text-accent truncate max-w-[200px]">{podcast.title}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* Content Column */}
                    <div className="lg:col-span-8">
                        <header className="mb-8">
                            <div className="flex items-center gap-2 text-brand font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                                <Mic2 size={14} /> Podcast Regional
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-black text-accent mb-6 leading-tight">
                                {podcast.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 border-y border-gray-100 py-6">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-brand" />
                                    <span>Publicado hoy</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-brand" />
                                    <span>{podcast.duration || '45 min'}</span>
                                </div>
                                <div className="ml-auto flex items-center gap-4">
                                    <Share2 size={16} className="text-gray-400" />
                                    <Facebook size={18} className="cursor-pointer hover:text-brand transition-colors" />
                                    <Twitter size={18} className="cursor-pointer hover:text-brand transition-colors" />
                                    <Link2 size={18} className="cursor-pointer hover:text-brand transition-colors" />
                                </div>
                            </div>
                        </header>

                        <div className="relative group mb-12">
                            <div className="aspect-square md:aspect-video overflow-hidden bg-accent rounded-xl shadow-2xl">
                                <OptimizedImage 
                                    src={podcast.image} 
                                    alt={podcast.title} 
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        <button className="w-20 h-20 bg-brand text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl group/btn ring-8 ring-brand/20">
                                            <Play size={40} className="fill-current ml-1" />
                                        </button>
                                        <div className="text-white">
                                            <p className="text-xs font-black uppercase tracking-widest text-brand mb-2">Reproducir ahora</p>
                                            <h2 className="text-2xl font-serif font-bold">{podcast.title}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-xl prose-serif max-w-none mb-12">
                            <p className="text-gray-800 text-xl leading-relaxed whitespace-pre-wrap first-letter:text-7xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-accent">
                                {podcast.description}
                            </p>
                        </div>

                        <GoogleAd slot="podcast-detail" className="mb-12" />
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-32">
                            <div className="flex items-center gap-4 mb-8">
                                <h3 className="text-xs font-black text-accent uppercase tracking-[0.3em]">Más Podcasts</h3>
                                <div className="flex-1 h-[1px] bg-gray-100"></div>
                            </div>

                            <div className="space-y-6">
                                {otherPodcasts.map((item) => (
                                    <AppLink key={item.id} to={getPodcastPath(item)} className="group block">
                                        <div className="flex gap-4 p-4 bg-gray-50 border border-transparent hover:border-brand hover:bg-white transition-all duration-300">
                                            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                                                <OptimizedImage src={item.image} alt={item.title} className="w-full h-full object-cover" width={100} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-serif font-black text-accent group-hover:text-brand line-clamp-2 leading-tight mb-2 transition-colors">
                                                    {item.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                    <Clock size={10} />
                                                    <span>{item.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </AppLink>
                                ))}
                            </div>

                            <div className="mt-12 bg-accent p-8 text-white rounded-xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-serif font-black mb-4">Escúchanos en Apple Podcasts y Spotify</h3>
                                    <p className="text-gray-400 text-xs mb-6">Suscríbete para no perderte ningún episodio de la actualidad regional.</p>
                                    <div className="flex flex-col gap-3">
                                        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                            Spotify
                                        </button>
                                        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                            Apple Podcasts
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-brand/20 blur-3xl rounded-full"></div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}
