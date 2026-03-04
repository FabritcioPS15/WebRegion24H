import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ChevronRight } from 'lucide-react';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import SubscriptionForm from '../../../components/SubscriptionForm';
import OptimizedImage from '../../../components/OptimizedImage';
import {
  getAllPublishedArticles,
  getArticleByCategoriaSlug,
  getArticleHref,
} from '../../../lib/articles';
import { slugify } from '../../../lib/slug';

export const revalidate = 10;
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const articles = await getAllPublishedArticles();
    return articles.map((a) => ({
      categoria: slugify(a.categoria || 'noticias') || 'noticias',
      slug: a.slug || slugify(a.titulo) || a.id,
    }));
  } catch (error) {
    console.error('Error en generateStaticParams:', error);
    // Fallback vacío para evitar que falle el build
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { categoria: string; slug: string };
}): Promise<Metadata> {
  const { categoria, slug } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const article = await getArticleByCategoriaSlug(categoria, slug);
  if (!article) {
    return {
      title: 'Artículo no encontrado',
      robots: { index: false, follow: false },
    };
  }

  const title = article.titulo || 'Artículo';
  const description =
    article.descripcion ||
    (article.contenido ? article.contenido.slice(0, 160) : undefined);
  const url = `${siteUrl}${getArticleHref(article)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'NOTICIAS 24H',
      images: article.imagen ? [{ url: article.imagen, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.imagen ? [article.imagen] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { categoria: string; slug: string };
}) {
  const { categoria, slug } = params;
  
  try {
    console.log(`[ArticlePage] Buscando artículo: categoria=${categoria}, slug=${slug}`);
    const article = await getArticleByCategoriaSlug(categoria, slug);
    
    if (!article) {
      console.log(`[ArticlePage] Artículo no encontrado: categoria=${categoria}, slug=${slug}`);
      notFound();
    }

    console.log(`[ArticlePage] Artículo encontrado:`, article.id, article.titulo);

    const all = await getAllPublishedArticles();
    const related = all
      .filter((a) => a.id !== article.id && slugify(a.categoria) === slugify(article.categoria))
      .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-brand transition-colors">
              Inicio
            </Link>
            <ChevronRight size={10} />
            <Link
              href={`/#${slugify(article.categoria)}`}
              className="text-brand hover:underline"
            >
              {article.categoria || 'Noticias'}
            </Link>
            <ChevronRight size={10} className="hidden md:block" />
            <span className="hidden md:block text-accent truncate max-w-[200px]">
              {article.titulo}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <article className="lg:col-span-8">
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <span className="bg-brand text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em]">
                  {article.categoria || 'EXCLUSIVO'}
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl font-serif font-black text-accent mb-8 leading-[1.05] tracking-tight">
                {article.titulo}
              </h1>

              {article.descripcion && (
                <h2 className="text-xl md:text-2xl font-serif italic text-gray-500 mb-10 border-l-4 border-brand pl-8 py-2 leading-relaxed">
                  {article.descripcion}
                </h2>
              )}

              <div className="flex flex-wrap items-center gap-y-6 gap-x-10 py-8 border-y border-gray-100">
                <div className="text-gray-400 flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={12} className="text-brand" /> Publicado
                  </span>
                  <span className="text-xs font-black text-accent uppercase tracking-tighter">
                    {article.fecha_publicacion
                      ? new Date(article.fecha_publicacion).toLocaleDateString('es-ES')
                      : ''}
                  </span>
                </div>
              </div>
            </header>

            {article.imagen && (
              <div className="relative aspect-video mb-16 overflow-hidden bg-accent">
                <OptimizedImage
                  src={article.imagen}
                  alt={article.titulo}
                  className="w-full h-full object-cover opacity-90 grayscale-[5%]"
                  priority
                  width={1200}
                />
              </div>
            )}

            <div className="prose prose-xl prose-serif max-w-none mb-20">
              <p className="text-gray-800 font-serif text-xl md:text-2xl leading-relaxed whitespace-pre-wrap first-letter:text-8xl first-letter:font-black first-letter:float-left first-letter:mr-4 first-letter:text-accent first-letter:mt-2">
                {article.contenido}
              </p>
            </div>

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
                <h3 className="text-xs font-black text-accent uppercase tracking-[0.3em]">
                  Relacionados
                </h3>
                <div className="flex-1 h-[1px] bg-gray-100"></div>
              </div>

              <div className="flex flex-col gap-10">
                {related.map((rel) => (
                  <Link key={rel.id} href={getArticleHref(rel)} className="group block">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 shrink-0 overflow-hidden bg-accent border border-gray-100">
                        {rel.imagen && (
                          <OptimizedImage
                            src={rel.imagen}
                            alt={rel.titulo}
                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                            width={200}
                          />
                        )}
                      </div>
                      <div>
                        <span className="text-brand text-[8px] font-black uppercase tracking-widest mb-1 block">
                          {rel.categoria}
                        </span>
                        <h4 className="text-md font-serif font-black text-accent group-hover:text-brand leading-tight transition-colors line-clamp-3">
                          {rel.titulo}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
  } catch (error) {
    console.error('[ArticlePage] Error al cargar artículo:', error);
    console.error('[ArticlePage] Params:', { categoria, slug });
    throw error;
  }
}

