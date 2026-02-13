import { Clock } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function FeaturedNews() {
  const { displayNews: news, changedIds, isPreviewMode } = useNews();

  const mainNews = news.find(article => article.featured) || news[0] || {
    id: '1',
    title: "Último momento",
    subtitle: "Gobierno anuncia nuevas medidas económicas para el segundo semestre",
    date: "22 de enero de 2025",
    time: "14:30",
    image: "https://images.pexels.com/photos/6894428/pexels-photo-6894428.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "ECONOMÍA"
  };

  const sideNews = news.filter(article => !article.featured && article.breaking).slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8 border-b-2 border-black pb-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Destacados del Día</h2>
        <div className="flex-1 h-[1px] bg-gray-100 italic text-[10px] text-gray-400 text-right">EDICIÓN EJECUTIVA</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <Link to={`/articulo/${mainNews.id}`} className="block">
            <div className={`relative h-[400px] md:h-[600px] bg-accent group cursor-pointer border ${isPreviewMode && changedIds.has(mainNews.id) ? 'border-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-gray-200'}`}>
              <img
                src={mainNews.image}
                alt={mainNews.subtitle || mainNews.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-700 grayscale-[20%] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                <span className="inline-block bg-brand px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase mb-6 border border-white/20">
                  {mainNews.subtitle || mainNews.category || 'MÁXIMA PRIORIDAD'}
                </span>
                <h2 className="text-4xl md:text-6xl font-serif font-black mb-6 leading-[1.1] tracking-tight group-hover:underline decoration-brand underline-offset-8 transition-all">
                  {mainNews.title}
                </h2>
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span className="text-brand mr-2">●</span>
                  <span>{mainNews.date}</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <div className="flex flex-col gap-6">
          {sideNews.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-white border-b-2 pb-6 group cursor-pointer hover:border-brand transition-all duration-300 ${isPreviewMode && changedIds.has(news.id) ? 'border-2 border-red-500 bg-red-50/10' : 'border-gray-100'}`}
            >
              <Link to={`/articulo/${news.id}`} className="block">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-[9px] font-black text-brand uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {news.date}
                    </div>
                    <h3 className="text-xl font-serif font-black text-accent mb-2 leading-snug group-hover:text-brand transition">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-serif italic line-clamp-2">
                      {news.subtitle || "Resumen del evento más importante..."}
                    </p>
                  </div>
                  <div className="w-24 h-24 shrink-0 bg-gray-100 overflow-hidden border border-gray-200">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition duration-500"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
