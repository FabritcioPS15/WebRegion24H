import { Play, Film } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { motion } from 'framer-motion';

export default function VideosSection() {
  const { videos } = useNews();

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-24 my-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-sm font-black text-accent uppercase tracking-[0.5em] border-l-4 border-brand pl-6">Producción Audiovisual</h2>
          <div className="flex-1 h-[1px] bg-gray-100"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {videos.map((video, index) => (
            <motion.article
              key={video.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white group cursor-pointer border-b border-gray-50 pb-8 hover:border-brand transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden bg-accent border border-gray-100 mb-8">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition duration-1000 grayscale-[50%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-brand text-white p-6 shadow-2xl group-hover:scale-110 transition duration-500">
                    <Play className="h-8 w-8 fill-white" />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 bg-accent text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest border-l border-t border-white/10">
                  {video.duration}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[9px] font-black text-brand uppercase tracking-widest">
                  <span>{video.category}</span>
                  <Film className="w-4 h-4 text-gray-300" />
                </div>
                <h3 className="font-serif font-black text-2xl text-accent leading-tight group-hover:text-brand transition-colors h-16 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm font-serif italic line-clamp-2">{video.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
