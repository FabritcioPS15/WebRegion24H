import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

import Header from './Header';
import Footer from './Footer';
import SubscriptionForm from './SubscriptionForm';
import ArticleActions from './ArticleActions';

type Article = {
  id: string;
  slug?: string;
  title: string;
  subtitle?: string;
  pullQuote?: string;
  intro?: string;
  content: string;
  category: string;
  date: string;
  time?: string;
  image: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
  breaking?: boolean;
  links?: { label: string; url: string }[];
};

type ArticlePreview = {
  id: string;
  slug?: string;
  title: string;
  category: string;
  date: string;
  time?: string;
  image: string;
};

function getOptimizedUrl(url: string, width: number) {
  if (!url) return '';

  try {
    if (url.includes('images.pexels.com')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=compress&cs=tinysrgb&w=${width}`;
    }

    if (url.includes('images.unsplash.com')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=${width}&q=80`;
    }

    if (url.includes('.supabase.co/storage/v1/object/public/')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}width=${width}&quality=80`;
    }
  } catch {
    // ignore
  }

  return url;
}

export default function ArticleDetailServer({
  article,
  related,
  more,
  mostRead,
}: {
  article: Article;
  related: ArticlePreview[];
  more: ArticlePreview[];
  mostRead: ArticlePreview[];
}) {
  const hrefFor = (a: { id: string; slug?: string }) => `/articulo/${a.slug || a.id}`;
  const imageUrl = getOptimizedUrl(article.image, 1200);
  const rawContent = article.content || '';
  const looksLikeHtml = /<\s*\w+[^>]*>/.test(rawContent);
  const htmlContent = looksLikeHtml
    ? rawContent
    : rawContent
        .split(/\n{2,}/)
        .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
        .join('');
  const htmlContentNormalized = htmlContent.replace(
    /<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi,
    '<p>&nbsp;</p>',
  );
  const safeContentHtml = DOMPurify.sanitize(htmlContentNormalized);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-brand transition-colors">
              Inicio
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-brand">{article.category || 'Noticias'}</span>
            <span className="text-gray-300 hidden md:inline">/</span>
            <span className="hidden md:block text-accent truncate max-w-[280px]">{article.title}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <header className="lg:col-span-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              <div className="lg:col-span-12">
                <h1 className="text-4xl md:text-7xl font-serif font-black text-accent mb-4 leading-[1.05] tracking-tight">
                  {article.title}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center mb-8">
                  <div className="lg:col-span-9 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    {article.breaking && (
                      <span className="text-accent font-black uppercase tracking-widest animate-pulse mr-2">
                        Última Hora
                      </span>
                    )}
                    {article.author && <span>Por {article.author}</span>}
                    {article.category && <span>| {article.category}</span>}
                    {article.date && <span>| {article.date}</span>}
                    {article.time && <span>| {article.time}</span>}
                  </div>

                  <div className="hidden lg:flex lg:col-span-3 items-center justify-end">
                    <ArticleActions
                      articleId={article.slug || article.id}
                      title={article.title}
                      subtitle={article.subtitle}
                      showCount
                      showSave={false}
                    />
                  </div>
                </div>

                {(article.pullQuote || article.subtitle) && (
                  <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-700 mb-10 border-l-4 border-brand pl-8 py-2 leading-relaxed">
                    {article.pullQuote || article.subtitle}
                  </blockquote>
                )}
              </div>
            </div>
          </header>

          <article className="lg:col-span-8">
            {imageUrl && (
              <div className="relative aspect-video mb-16 overflow-hidden bg-accent">
                <img
                  src={imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover opacity-90 grayscale-[5%]"
                  loading="eager"
                  decoding="async"
                />

                {article.category && (
                  <span className="absolute bottom-4 left-4 bg-brand text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                    {article.category}
                  </span>
                )}
              </div>
            )}

            {article.intro && (
              <div className="prose prose-xl prose-serif max-w-none mb-12">
                <h3 className="text-2xl font-serif font-black mb-6">Introducción</h3>
                <p className="text-gray-800 font-serif text-xl md:text-2xl leading-relaxed whitespace-pre-wrap">
                  {article.intro}
                </p>
              </div>
            )}

            <div className="prose prose-xl prose-serif max-w-none mb-20">
              <div
                className="text-gray-800 font-serif text-xl md:text-2xl leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: safeContentHtml }}
              />
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
                <h3 className="text-[11px] font-black text-brand uppercase tracking-[0.3em] mb-6">ENLACES DE INTERÉS</h3>
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
                      <span className="text-gray-300 group-hover:text-brand transition-all">→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-20 p-10 bg-accent text-white border border-white/10 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-serif font-black mb-4">¿Te gustó lo que leíste?</h3>
                <p className="text-gray-400 text-sm mb-8 max-w-md">
                  Suscríbete a nuestro boletín diario y recibe las noticias más importantes de la región directamente en tu correo.
                </p>
                <SubscriptionForm variant="article" className="max-w-md" />
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </article>

          <aside className="lg:col-span-4 flex flex-col gap-12">
            <div className="sticky top-32">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xs font-black text-accent uppercase tracking-[0.3em]">Relacionados</h3>
                <div className="flex-1 h-[1px] bg-gray-100" />
              </div>

              <div className="bg-brand text-white text-xs font-black uppercase tracking-widest px-4 py-2 mb-6">
                {article.category || 'RELACIONADOS'}
              </div>

              <div className="flex flex-col gap-6">
                {(related.length > 0 ? related : more).slice(0, 3).map((rel) => (
                  <Link key={rel.id} href={hrefFor(rel)} className="group block">
                    <div className="flex gap-4 p-4 bg-white border border-gray-100 hover:shadow-lg transition-all">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-accent">
                        {rel.image ? (
                          <img
                            src={getOptimizedUrl(rel.image, 200)}
                            alt={rel.title}
                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <span className="text-brand text-[8px] font-black uppercase tracking-widest mb-1 block">
                          {rel.category}
                        </span>
                        <h4 className="text-sm font-serif font-black text-accent group-hover:text-brand leading-tight line-clamp-2">
                          {rel.title}
                        </h4>
                        <div className="text-[10px] text-gray-400 flex gap-2 mt-1">
                          <span>{rel.date}</span>
                          {rel.time ? <span>{rel.time}</span> : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {more.length > 0 && (
                <div className="mt-8">
                  <div className="bg-brand text-white text-xs font-black uppercase tracking-widest px-4 py-2 mb-4">
                    Más recomendaciones
                  </div>
                  <div className="flex flex-col gap-6">
                    {more.slice(0, 3).map((rel) => (
                      <Link key={rel.id} href={hrefFor(rel)} className="group block">
                        <div className="flex gap-4 p-4 bg-white border border-gray-100 hover:shadow-lg transition-all">
                          <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-accent">
                            {rel.image ? (
                              <img
                                src={getOptimizedUrl(rel.image, 200)}
                                alt={rel.title}
                                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : null}
                          </div>
                          <div className="flex-1">
                            <span className="text-brand text-[8px] font-black uppercase tracking-widest mb-1 block">
                              {rel.category}
                            </span>
                            <h4 className="text-sm font-serif font-black text-accent group-hover:text-brand leading-tight line-clamp-2">
                              {rel.title}
                            </h4>
                            <div className="text-[10px] text-gray-400 flex gap-2 mt-1">
                              <span>{rel.date}</span>
                              {rel.time ? <span>{rel.time}</span> : null}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {mostRead.length > 0 && (
                <div className="mt-12 p-8 border border-gray-100 bg-gray-50/50">
                  <h4 className="text-[10px] font-black text-accent uppercase tracking-widest mb-4">Lo más leído</h4>
                  <ol className="flex flex-col gap-6">
                    {mostRead.map((pop, i) => (
                      <li key={pop.id} className="flex gap-4 items-start">
                        <span className="text-2xl font-serif font-black text-brand/20 leading-none">{i + 1}</span>
                        <Link
                          href={hrefFor(pop)}
                          className="text-xs font-black text-accent hover:text-brand transition-colors leading-relaxed line-clamp-2 uppercase"
                        >
                          {pop.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
