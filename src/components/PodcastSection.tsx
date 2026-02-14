import { Play, Clock, Radio, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

export default function PodcastSection() {
  const { displayPodcasts: podcasts, changedIds, isPreviewMode } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPodcast = podcasts[currentIndex];

  if (!currentPodcast) {
    return null;
  }

  const nextPodcast = () => {
    setCurrentIndex((prev) => (prev + 1) % podcasts.length);
  };

  const prevPodcast = () => {
    setCurrentIndex((prev) => (prev - 1 + podcasts.length) % podcasts.length);
  };

  return (
    <section className="bg-accent py-24 my-20 overflow-hidden border-y-8 border-brand">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 mb-16 border-b border-white/10 pb-8">
          <h2 className="text-sm font-black text-brand uppercase tracking-[0.5em]">AUDIENCIA EJECUTIVA</h2>
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <div className="px-4 py-2 border border-white/10 text-[10px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-3">
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
            EMISIÓN CONTINUA
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            key={currentPodcast.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Link
              to="/podcasts"
              state={{ selectedId: currentPodcast.id }}
              className={`relative block bg-black group cursor-pointer h-[500px] border-4 shadow-2xl transition-all ${isPreviewMode && changedIds.has(currentPodcast.id) ? 'border-red-500 scale-[1.02] shadow-[0_0_40px_rgba(239,68,68,0.3)]' : 'border-white/5'}`}
            >
              <OptimizedImage
                src={currentPodcast.image}
                alt="Podcast"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-1000 grayscale group-hover:grayscale-0"
                width={1000}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-brand text-white p-10 group-hover:scale-110 transition-all duration-500 shadow-2xl group-hover:shadow-brand/50">
                  <Play className="h-12 w-12 fill-white" />
                </div>
              </div>
            </Link>

            {/* Navigation Arrows */}
            {podcasts.length > 1 && (
              <div className="absolute -bottom-6 right-10 flex gap-4 z-10">
                <button
                  onClick={(e) => { e.preventDefault(); prevPodcast(); }}
                  className="p-5 bg-white text-accent hover:bg-brand hover:text-white transition-all shadow-2xl"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); nextPodcast(); }}
                  className="p-5 bg-white text-accent hover:bg-brand hover:text-white transition-all shadow-2xl"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white space-y-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPodcast.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <p className="text-brand font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3">
                  <Radio className="h-5 w-5" />
                  {currentPodcast.live ? 'TRANSMISIÓN EN VIVO' : 'PODCAST EXCLUSIVO'}
                </p>
                <h3 className="text-4xl md:text-6xl font-serif font-black leading-[1.1] tracking-tight">
                  {currentPodcast.title}
                </h3>
              </motion.div>
            </AnimatePresence>

            <p className="text-gray-400 text-xl font-serif italic leading-relaxed border-l-4 border-brand pl-8 py-2">
              "{currentPodcast.description}"
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-10 border-t border-white/10">
              <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-brand" />
                  <span>DURACIÓN: {currentPodcast.duration}</span>
                </div>
                <div>ESTRENO: HOY</div>
              </div>
              <Link
                to="/podcasts"
                state={{ selectedId: currentPodcast.id }}
                className="bg-white text-accent px-10 py-5 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand hover:text-white transition-all shadow-xl active:scale-95 block text-center"
              >
                Ver Directorio
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
