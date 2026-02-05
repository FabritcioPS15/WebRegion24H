import { useNews } from '../context/NewsContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NewsGrid() {
  const { displayNews: news, selectedCategory, changedIds, isPreviewMode } = useNews();

  const filteredNews = news.filter(article => {
    const isRegular = !article.featured && !article.breaking;
    if (selectedCategory === 'Todas' || selectedCategory === 'Más') return isRegular;
    return isRegular && article.category === selectedCategory;
  }).slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 border-t border-gray-100">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-sm font-black text-accent uppercase tracking-[0.4em] border-l-4 border-brand pl-6 py-1">Archivo de Noticias</h2>
        <div className="flex-1 h-[1px] bg-gray-100"></div>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-8 md:gap-y-16 md:overflow-visible md:pb-0 md:px-0">
        {filteredNews.map((article, index) => (
          <Link to={`/articulo/${article.id}`} key={article.id} className="block group min-w-[85vw] md:min-w-0 snap-center">
            <motion.article
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className={`bg-white transition-all ${isPreviewMode && changedIds.has(article.id) ? 'border-4 border-red-500 p-2 bg-red-50/10' : ''}`}
            >
              <div className="relative h-56 overflow-hidden mb-6 bg-accent border border-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-700 grayscale-[20%] group-hover:grayscale-0"
                />
                <span className="absolute top-0 right-0 bg-brand text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-xl">
                  {article.category}
                </span>
              </div>
              <div className="pr-2">
                <h3 className="text-xl font-serif font-black text-accent mb-4 line-clamp-2 leading-[1.2] group-hover:text-brand transition-colors duration-500">
                  {article.title}
                </h3>
                <div className="flex items-center text-[9px] font-black text-gray-400 uppercase tracking-widest gap-2">
                  <span className="text-brand">●</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  );
}
