import { useParams, Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { Clock, Calendar, Bookmark, Share2, ArrowLeft, ChevronRight } from 'lucide-react';
import { NewsArticle } from '../types/news';
import Header from './Header';
import Footer from './Footer';

interface NewsDetailPageProps {
    previewArticle?: NewsArticle;
}

export default function NewsDetailPage({ previewArticle }: NewsDetailPageProps) {
    const { id } = useParams();
    const { news } = useNews();

    const article = previewArticle || news.find(a => a.id === id);

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-4xl font-serif font-black text-accent mb-4">Artículo no encontrado</h1>
                    <Link to="/" className="text-brand hover:underline font-black uppercase tracking-widest text-xs">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    // Related articles (matching category, excluding current)
    const relatedArticles = news
        .filter(a => a.category === article.category && a.id !== article.id)
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Link to="/" className="hover:text-brand transition-colors">Inicio</Link>
                        <ChevronRight size={10} />
                        <span className="text-brand">{article.category || 'Noticias'}</span>
                        <ChevronRight size={10} className="hidden md:block" />
                        <span className="hidden md:block text-accent truncate max-w-[200px]">{article.title}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Main Article Content */}
                    <article className="lg:col-span-8">
                        <header className="mb-12">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="bg-brand text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em]">
                                    {article.category || 'EXCLUSIVO'}
                                </span>
                                {article.breaking && (
                                    <span className="text-accent text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                                        <span className="w-2 h-2 bg-brand rounded-full" />
                                        Última Hora
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

                            <div className="flex flex-wrap items-center gap-y-6 gap-x-10 py-8 border-y border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-accent flex items-center justify-center text-white font-black text-sm uppercase tracking-tighter">
                                        {((article as any).author?.[0] || 'R')}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Escrito por</p>
                                        <p className="text-sm font-black text-accent uppercase tracking-tighter">{(article as any).author || 'Redacción Región 24H'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-gray-400 flex flex-col gap-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={12} className="text-brand" /> Publicado
                                        </span>
                                        <span className="text-xs font-black text-accent uppercase tracking-tighter">{article.date}</span>
                                    </div>
                                    <div className="text-gray-400 flex flex-col gap-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={12} className="text-brand" /> Lectura
                                        </span>
                                        <span className="text-xs font-black text-accent uppercase tracking-tighter">5 min aprox</span>
                                    </div>
                                </div>

                                <div className="ml-auto flex items-center gap-4">
                                    <button className="p-3 border border-gray-100 hover:bg-brand hover:text-white transition-all rounded-none" title="Guardar">
                                        <Bookmark size={18} />
                                    </button>
                                    <button className="p-3 border border-gray-100 hover:bg-brand hover:text-white transition-all rounded-none" title="Compartir">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </header>

                        <div className="relative aspect-video mb-16 overflow-hidden bg-accent">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover opacity-90 grayscale-[5%]"
                            />
                        </div>

                        <div className="prose prose-xl prose-serif max-w-none mb-20">
                            <p className="text-gray-800 font-serif text-xl md:text-2xl leading-relaxed whitespace-pre-wrap first-letter:text-8xl first-letter:font-black first-letter:float-left first-letter:mr-4 first-letter:text-accent first-letter:mt-2">
                                {article.content}
                            </p>
                        </div>

                        {article.tags && article.tags.length > 0 && (
                            <div className="border-t border-gray-100 pt-12">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">TEMAS RELACIONADOS</h3>
                                <div className="flex flex-wrap gap-3">
                                    {article.tags.map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className="bg-gray-50 border border-transparent px-5 py-2.5 text-[10px] font-black text-accent uppercase tracking-widest hover:border-brand hover:text-brand transition-all cursor-pointer"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {article.links && article.links.length > 0 && (
                            <div className="border-t border-gray-100 pt-12 mt-12 bg-gray-50/50 p-8">
                                <h3 className="text-[11px] font-black text-brand uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Share2 size={14} /> ENLACES DE INTERÉS
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {article.links.map((link: { label: string; url: string }, index: number) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-between p-4 bg-white border border-gray-100 hover:border-brand hover:shadow-lg transition-all"
                                        >
                                            <span className="text-xs font-black text-accent uppercase tracking-tighter group-hover:text-brand truncate pr-4">
                                                {link.label || 'Ver más'}
                                            </span>
                                            <ChevronRight size={14} className="text-gray-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-20 p-10 bg-accent text-white border border-white/10 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-serif font-black mb-4">¿Te gustó lo que leíste?</h3>
                                <p className="text-gray-400 text-sm mb-8 max-w-md">Suscríbete a nuestro boletín diario y recibe las noticias más importantes de la región directamente en tu correo.</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <input type="email" placeholder="tu@email.com" className="bg-white/5 border border-white/20 px-6 py-4 text-sm focus:outline-none focus:border-brand flex-1" />
                                    <button className="bg-brand text-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-accent transition-all">
                                        Suscribirme
                                    </button>
                                </div>
                            </div>
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                        </div>
                    </article>

                    {/* Sidebar / Sidebar News */}
                    <aside className="lg:col-span-4 flex flex-col gap-12">
                        <div className="sticky top-32">
                            <div className="flex items-center gap-4 mb-8">
                                <h3 className="text-xs font-black text-accent uppercase tracking-[0.3em]">Relacionados</h3>
                                <div className="flex-1 h-[1px] bg-gray-100"></div>
                            </div>

                            <div className="flex flex-col gap-10">
                                {relatedArticles.length > 0 ? (
                                    relatedArticles.map((rel) => (
                                        <Link key={rel.id} to={`/articulo/${rel.id}`} className="group block">
                                            <div className="flex gap-6">
                                                <div className="w-24 h-24 shrink-0 overflow-hidden bg-accent border border-gray-100">
                                                    <img src={rel.image} alt={rel.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" />
                                                </div>
                                                <div>
                                                    <span className="text-brand text-[8px] font-black uppercase tracking-widest mb-1 block">{rel.category}</span>
                                                    <h4 className="text-md font-serif font-black text-accent group-hover:text-brand leading-tight transition-colors line-clamp-3">
                                                        {rel.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    news.filter(a => a.id !== article.id).slice(0, 3).map((rel) => (
                                        <Link key={rel.id} to={`/articulo/${rel.id}`} className="group block">
                                            <div className="flex gap-6">
                                                <div className="w-24 h-24 shrink-0 overflow-hidden bg-accent border border-gray-100">
                                                    <img src={rel.image} alt={rel.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" />
                                                </div>
                                                <div>
                                                    <span className="text-brand text-[8px] font-black uppercase tracking-widest mb-1 block">{rel.category}</span>
                                                    <h4 className="text-md font-serif font-black text-accent group-hover:text-brand leading-tight transition-colors line-clamp-3">
                                                        {rel.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>

                            <div className="mt-12 p-8 border border-gray-100 bg-gray-50/50">
                                <h4 className="text-[10px] font-black text-accent uppercase tracking-widest mb-4">Lo más leído</h4>
                                <ol className="flex flex-col gap-6">
                                    {news.slice(0, 5).map((pop, i) => (
                                        <li key={pop.id} className="flex gap-4 items-start">
                                            <span className="text-2xl font-serif font-black text-brand/20 leading-none">{i + 1}</span>
                                            <Link to={`/articulo/${pop.id}`} className="text-xs font-black text-accent hover:text-brand transition-colors leading-relaxed line-clamp-2 uppercase">
                                                {pop.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </aside>

                </div>
            </main>

            <Footer />

            {/* Scroll to Top Button (Floating) */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 left-8 z-[100] bg-white border border-gray-200 p-4 shadow-xl hover:bg-brand hover:text-white transition-all group"
                title="Volver arriba"
            >
                <ArrowLeft className="h-5 w-5 rotate-90" />
            </button>
        </div>
    );
}
