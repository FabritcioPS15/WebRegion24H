import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNews } from '../context/NewsContext';
import OptimizedImage from './OptimizedImage';

export default function HighlightSection() {
  const { displayNews: news, changedIds, isPreviewMode } = useNews();

  // Use non-featured news for the list
  const listArticles = news.filter(n => !n.featured).slice(0, 4);
  // Use a featured one or just the first for the big block
  const spotlight = news.find(n => n.featured) || news[0];

  if (!spotlight) return null;

  return (
    <section className="bg-white py-24 my-20 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-sm font-black text-accent uppercase tracking-[0.5em] border-l-4 border-brand pl-6">Investigación</h2>
              <div className="flex-1 h-[1px] bg-gray-100"></div>
            </div>

            <div className="space-y-10">
              {listArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-white border-b pb-8 hover:border-brand transition-all cursor-pointer group ${isPreviewMode && changedIds.has(article.id) ? 'border-2 border-red-500 bg-red-50/10 p-4' : 'border-gray-50'}`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="text-[9px] font-black text-brand uppercase tracking-widest mb-3">{article.date}</div>
                      <h3 className="text-2xl font-serif font-black text-accent mb-4 group-hover:text-brand transition-colors leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-serif leading-relaxed line-clamp-2 italic">{article.subtitle || "Resumen de investigación en profundidad..."}</p>
                    </div>
                    <div className="mt-2 text-gray-300 group-hover:text-brand group-hover:translate-x-1 transition-all">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative h-full min-h-[600px] bg-accent border-[12px] shadow-2xl transition-all ${isPreviewMode && changedIds.has(spotlight.id) ? 'border-red-500 scale-[1.02] shadow-[0_0_50px_rgba(239,68,68,0.4)]' : 'border-white'}`}
          >
            <OptimizedImage
              src={spotlight.image}
              alt={spotlight.title}
              className="w-full h-full object-cover opacity-80 grayscale-[30%] group-hover:grayscale-0 transition duration-1000"
              width={1000}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
              <span className="inline-block bg-brand px-4 py-1.5 text-[9px] font-black tracking-[0.3em] uppercase mb-6 border border-white/20">
                ENSAYO EDITORIAL
              </span>
              <h3 className="text-4xl md:text-5xl font-serif font-black mb-8 leading-[1.1] tracking-tight">
                {spotlight.title}
              </h3>
              <p className="text-gray-300 mb-10 text-xl font-serif italic leading-relaxed border-l-2 border-brand pl-8">
                "{spotlight.subtitle || "Un análisis exhaustivo sobre los desafíos actuales de nuestra sociedad moderna."}"
              </p>
              <button className="bg-white text-accent px-10 py-5 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-brand hover:text-white transition-all shadow-xl group/btn flex items-center gap-4">
                Lectura Completa <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
