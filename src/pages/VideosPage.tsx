import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../context/NewsContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PlayCircle, Clock, Video as VideoIcon, X, ChevronRight, Home, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Video } from '../types/news';

export default function VideosPage() {
    const { displayVideos: videos } = useNews();
    const location = useLocation();
    const state = location.state as { selectedId?: string };

    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        if (state?.selectedId && videos.length > 0) {
            const video = videos.find(v => v.id === state.selectedId);
            if (video) {
                setSelectedVideo(video);
            }
        }
    }, [state?.selectedId, videos]);

    const featuredVideo = videos[0];
    const remainingVideos = videos.slice(1);

    return (
        <div className="min-h-screen bg-black">
            <Header />

            <main className="pt-0 min-h-[50vh]">
                {/* Breadcrumbs */}
                <div className="bg-zinc-900 border-b border-white/10 py-3">
                    <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            Inicio
                        </Link>
                        <ChevronRight className="h-3 w-3 text-gray-700" />
                        <span className="text-gray-500">Videos</span>
                        {selectedVideo && (
                            <>
                                <ChevronRight className="h-3 w-3 text-gray-700" />
                                <span className="text-brand truncate max-w-[200px] sm:max-w-none">{selectedVideo.title}</span>
                            </>
                        )}
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
                                className="absolute top-4 right-4 z-50 text-white/50 hover:text-white transition-colors bg-black/50 p-2 rounded-full backdrop-blur-md"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* YouTube Player or Simulated Player */}
                            <div className="w-full h-full bg-zinc-900 overflow-hidden">
                                {selectedVideo.url && getYoutubeId(selectedVideo.url) ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.url)}?autoplay=1`}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : selectedVideo.url ? (
                                    <CustomVideoPlayer src={selectedVideo.url} />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900">
                                        <VideoIcon className="h-16 w-16 text-white/10 mb-4" />
                                        <p className="text-white/50 font-serif italic">Video no disponible</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

function CustomVideoPlayer({ src }: { src: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<number | null>(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const formatTime = (time: number) => {
        if (isNaN(time)) return '00:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const togglePlay = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentProgress = (videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100;
            setProgress(currentProgress);
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const newProgress = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = (newProgress / 100) * (videoRef.current.duration || 0);
            setProgress(newProgress);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            const newMuted = !videoRef.current.muted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            const isNowMuted = newVolume === 0;
            videoRef.current.muted = isNowMuted;
            setIsMuted(isNowMuted);
        }
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            const container = videoRef.current.parentElement;
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (container) {
                container.requestFullscreen();
            }
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            window.clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = window.setTimeout(() => {
            if (isPlaying && videoRef.current && !videoRef.current.paused) {
                setShowControls(false);
            }
        }, 3000);
    };

    return (
        <div
            className="relative w-full h-full group bg-black overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full cursor-pointer"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => { setIsPlaying(false); setShowControls(true); }}
                playsInline
            />

            {/* Overlay Controls */}
            <AnimatePresence>
                {(showControls || !isPlaying) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 flex flex-col justify-end p-6 z-20 cursor-pointer"
                        onClick={togglePlay}
                    >
                        {/* Center Play Button Overlay */}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={togglePlay}
                                    className="bg-brand text-white p-6 rounded-full shadow-2xl backdrop-blur-sm z-30"
                                >
                                    <Play className="h-8 w-8 fill-white ml-1" />
                                </motion.button>
                            </div>
                        )}

                        {/* Bottom Controls Bar */}
                        <div className="space-y-4" onClick={e => e.stopPropagation()}>
                            {/* Progress Bar Container */}
                            <div className="relative w-full h-1.5 group/progress cursor-pointer">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={progress}
                                    onChange={handleProgressChange}
                                    className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-pointer"
                                />
                                <div className="absolute inset-0 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-brand"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-xl z-20"
                                    style={{ left: `calc(${progress}% - 6px)` }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={togglePlay}
                                        className="text-white hover:text-brand transition-all transform active:scale-95"
                                    >
                                        {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
                                    </button>

                                    <div className="flex items-center gap-2 group/volume">
                                        <button
                                            onClick={toggleMute}
                                            className="text-white hover:text-brand transition-all"
                                        >
                                            {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                        </button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={isMuted ? 0 : volume}
                                            onChange={handleVolumeChange}
                                            className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-brand overflow-hidden cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <span className="text-white/80 text-[10px] font-mono tracking-widest tabular-nums bg-black/40 px-2 py-1 rounded">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                    <button
                                        onClick={toggleFullscreen}
                                        className="text-white hover:text-brand transition-all transform hover:scale-110"
                                    >
                                        <Maximize className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
