import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../context/NewsContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PlayCircle, Clock, Video as VideoIcon, X, ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Video } from '../types/news';

export default function VideosPage() {
    const { displayVideos: videos } = useNews();
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const featuredVideo = videos[0];
    const remainingVideos = videos.slice(1);

    return (
        <div className="min-h-screen bg-black">
            <Header />

            <main className="pt-20">
                {/* Breadcrumbs */}
                <div className="bg-zinc-900 border-b border-white/10 py-3 mt-12">
                    <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            Inicio
                        </Link>
                        <ChevronRight className="h-3 w-3 text-gray-700" />
                        <span className="text-brand">Videos</span>
                    </div>
                </div>

                {/* Hero Section */}
                {featuredVideo && (
                    <section className="relative h-[60vh] overflow-hidden group cursor-pointer" onClick={() => setSelectedVideo(featuredVideo)}>
                        <div className="absolute inset-0">
                            <img src={featuredVideo.thumbnail} alt={featuredVideo.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        </div>

                        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-20">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="max-w-3xl space-y-6"
                            >
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand/90 text-white text-[10px] font-black tracking-widest uppercase shadow-lg backdrop-blur-sm">
                                    <VideoIcon className="h-4 w-4" />
                                    Video Destacado
                                </div>
                                <h1 className="text-4xl md:text-6xl font-serif font-black text-white leading-[1.1] drop-shadow-2xl">
                                    {featuredVideo.title}
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl font-serif italic border-l-4 border-brand pl-6 drop-shadow-md">
                                    {featuredVideo.description}
                                </p>
                                <button className="bg-white text-black px-8 py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand hover:text-white transition-all flex items-center gap-4 group mt-8 shadow-xl">
                                    <PlayCircle className="h-5 w-5 fill-current" />
                                    Ver Video Completo
                                </button>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Archive Grid */}
                <section className="max-w-7xl mx-auto px-6 py-20">
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] border-l-4 border-brand pl-6 py-1">Galería de Videos</h2>
                        <div className="flex-1 h-[1px] bg-white/10"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {remainingVideos.map((video, index) => (
                            <motion.article
                                key={video.id}
                                onClick={() => setSelectedVideo(video)}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-video overflow-hidden mb-6 bg-white/5 border border-white/10 rounded-sm">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md border border-white/10">
                                        <Clock className="h-3 w-3 text-brand" />
                                        {video.duration}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[1px]">
                                        <PlayCircle className="h-16 w-16 text-white drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                                        <span className="inline-block px-2 py-1 bg-brand text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                                            {video.category}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-serif font-black text-white mb-2 line-clamp-2 leading-tight group-hover:text-brand transition-colors">
                                    {video.title}
                                </h3>
                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                    {video.description}
                                </p>
                            </motion.article>
                        ))}
                    </div>
                </section>
            </main>

            {/* Video Player Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-10 text-white/50 hover:text-white transition-colors bg-black/50 p-2 rounded-full backdrop-blur-md"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Simulated Player */}
                            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 group">
                                <img
                                    src={selectedVideo.thumbnail}
                                    className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
                                    alt=""
                                />

                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative z-10 text-center space-y-6"
                                >
                                    <PlayCircle className="h-24 w-24 text-brand mx-auto fill-brand/20 animate-pulse" />
                                    <div className="text-white space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reproduciendo</p>
                                        <h2 className="text-2xl md:text-4xl font-serif font-black">{selectedVideo.title}</h2>
                                    </div>
                                </motion.div>

                                {/* Simulated Controls */}
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                                    <div className="w-full h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
                                        <div className="w-1/3 h-full bg-brand relative">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                                        <span>04:20</span>
                                        <span>{selectedVideo.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
