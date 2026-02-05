import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../context/NewsContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Play, Clock, Radio, ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PodcastsPage() {
    const { displayPodcasts: podcasts } = useNews();
    const [selectedPodcast, setSelectedPodcast] = useState(podcasts[0]);
    const heroRef = useRef<HTMLDivElement>(null);

    // Exclude the currently selected one from grid? Or keep all? Let's keep all in grid but highlight active
    // Actually, filtering active out of grid might be nicer UX, or just keeping it. Let's keep active logic simple.

    const handlePodcastClick = (podcast: any) => {
        setSelectedPodcast(podcast);
        heroRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-20">
                {/* Breadcrumbs */}
                <div className="bg-gray-50 border-b border-gray-100 py-3 mt-12">
                    <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Link to="/" className="hover:text-brand transition-colors flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            Inicio
                        </Link>
                        <ChevronRight className="h-3 w-3 text-gray-300" />
                        <span className="text-accent">Podcasts</span>
                    </div>
                </div>

                {/* Hero Section */}
                {selectedPodcast && (
                    <section ref={heroRef} className="bg-accent py-20 border-b-8 border-brand">
                        <div className="max-w-7xl mx-auto px-6">
                            <AnimatePresence mode="wait">
                                <div key={selectedPodcast.id} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.5 }}
                                        className="space-y-8"
                                    >
                                        <div className="inline-flex items-center gap-3 px-4 py-2 border border-brand/30 rounded-full text-brand text-[10px] font-black tracking-widest uppercase">
                                            <span className="w-2 h-2 bg-brand rounded-full animate-pulse" />
                                            Reproduciendo Ahora
                                        </div>
                                        <h1 className="text-4xl md:text-6xl font-serif font-black text-white leading-[1.1] tracking-tight">
                                            {selectedPodcast.title}
                                        </h1>
                                        <p className="text-gray-400 text-lg font-serif italic border-l-4 border-brand pl-6">
                                            "{selectedPodcast.description}"
                                        </p>
                                        <button className="bg-white text-accent px-8 py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand hover:text-white transition-all flex items-center gap-4 group">
                                            <Play className="h-4 w-4 fill-current" />
                                            Reproducir Episodio
                                        </button>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative aspect-square max-w-lg mx-auto lg:mx-0 shadow-2xl border-4 border-white/5"
                                    >
                                        <img src={selectedPodcast.image} alt={selectedPodcast.title} className="w-full h-full object-cover grayscale opacity-80" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-accent to-transparent opacity-80" />
                                    </motion.div>
                                </div>
                            </AnimatePresence>
                        </div>
                    </section>
                )}

                {/* Archive Grid */}
                <section className="max-w-7xl mx-auto px-6 py-20">
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-sm font-black text-accent uppercase tracking-[0.4em] border-l-4 border-brand pl-6 py-1">Archivo de Episodios</h2>
                        <div className="flex-1 h-[1px] bg-gray-100"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {podcasts.map((podcast, index) => (
                            <motion.article
                                key={podcast.id}
                                onClick={() => handlePodcastClick(podcast)}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`group cursor-pointer ${selectedPodcast?.id === podcast.id ? 'opacity-50 grayscale' : ''}`}
                            >
                                <div className="relative aspect-square overflow-hidden mb-6 bg-accent">
                                    <img
                                        src={podcast.image}
                                        alt={podcast.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-700 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <Radio className="h-3 w-3 text-brand" />
                                        PODCAST
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                                        <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                            <Play className="h-6 w-6 fill-white text-white ml-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                        <span className="flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-brand" />
                                            {podcast.duration}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-serif font-black text-accent leading-tight group-hover:text-brand transition-colors">
                                        {podcast.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                        {podcast.description}
                                    </p>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
