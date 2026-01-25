import { X, Clock } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface NewsDetailModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-accent/95 backdrop-blur-sm flex items-center justify-center z-[100] p-0 md:p-10">
      <div className="bg-white max-w-5xl w-full h-full md:h-auto md:max-h-full overflow-y-auto relative shadow-2xl border-x md:border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-accent text-white p-3 hover:bg-brand transition-all z-10"
          title="Cerrar"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          <div className="md:col-span-7 relative h-72 md:h-auto bg-accent">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover opacity-90 grayscale-[10%]"
            />
          </div>

          <div className="md:col-span-12 p-8 md:p-16">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6 uppercase tracking-[0.3em] text-[10px] font-black">
                <span className="text-brand">{(article as any).category || 'PRIMERA PLANA'}</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-400">{article.date}</span>
                {article.breaking && (
                  <span className="ml-auto bg-brand text-white px-3 py-1 animate-pulse">
                    MÁXIMA PRIORIDAD
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-7xl font-serif font-black text-accent mb-8 leading-[1.05] tracking-tight">
                {article.title}
              </h1>

              {article.subtitle && (
                <h2 className="text-xl md:text-2xl font-serif italic text-gray-500 mb-10 border-l-4 border-brand pl-8 py-2 leading-relaxed">
                  {article.subtitle}
                </h2>
              )}

              <div className="flex items-center gap-6 mb-12 py-6 border-y border-gray-50">
                {(article as any).author && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent flex items-center justify-center text-white font-black text-xs uppercase tracking-tighter">
                      {((article as any).author[0] || 'R')}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Escrito por</p>
                      <p className="text-xs font-black text-accent uppercase">{(article as any).author}</p>
                    </div>
                  </div>
                )}
                <div className="ml-auto text-gray-400 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Clock size={14} className="text-brand" />
                  <span>Lectura: 5 min aprox</span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none mb-16">
                <p className="text-gray-800 font-serif text-lg md:text-xl leading-relaxed whitespace-pre-wrap first-letter:text-6xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-accent">
                  {article.content}
                </p>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="border-t border-gray-100 pt-8 flex flex-wrap gap-3">
                  <span className="w-full text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">TEMAS RELACIONADOS</span>
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-50 px-4 py-2 text-[10px] font-black text-accent uppercase tracking-widest hover:bg-brand hover:text-white transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
