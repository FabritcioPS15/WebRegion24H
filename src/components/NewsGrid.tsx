'use client';

import { useNews } from '../context/NewsContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';
import { slugify } from '../lib/slug';

export default function NewsGrid() {
  const { displayNews: news, selectedCategory, changedIds, isPreviewMode } = useNews();

  if (!news || news.length === 0) return null;

  const filteredNews = news.filter(article => {
    const isRegular = !article.featured && !article.breaking;
    // Since 'news' (from displayNews) is already filtered by category in the context,
    // we only need to filter out featured/breaking articles for the grid.
    // We add an extra safety check for category just in case.
    const articleCategory = article.category?.toLowerCase();
    const currentCategory = selectedCategory?.toLowerCase();

    if (selectedCategory === 'Todas' || selectedCategory === 'Más') return isRegular;
    return isRegular && articleCategory === currentCategory;
  }).slice(0, 8);

  const hrefFor = (a: { id: string; slug?: string; category?: string; title?: string }) => `/${slugify(a.category || 'noticias')}/${a.slug || slugify(a.title || '') || a.id}`;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-100">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-sm font-black text-accent uppercase tracking-[0.4em] border-l-4 border-brand pl-6 py-1">Archivo de Noticias</h2>
        <div className="flex-1 h-[1px] bg-gray-100"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-8 md:gap-y-16">
        {filteredNews.map((article, index) => (
          <Link href={hrefFor(article)} key={article.id} className="block group">
            <motion.article
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className={`bg-white transition-all ${isPreviewMode && changedIds.has(article.id) ? 'border-4 border-red-500 p-2 bg-red-50/10' : ''}`}
            >
              <div className="relative h-56 overflow-hidden mb-6 bg-accent border border-gray-100">
                <OptimizedImage
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-700 grayscale-[20%] group-hover:grayscale-0"
                  width={400}
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
