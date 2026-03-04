import { cache } from 'react';
import { slugify } from './slug';
import { createSupabaseServerClient } from './supabase/server';

export type Article = {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  descripcion?: string;
  imagen?: string;
  fecha_publicacion?: string; // ISO o string
  categoria: string;
  status?: string | null;
};

const TABLE = process.env.SUPABASE_ARTICLES_TABLE || 'news';

const SELECT_LIST =
  'id,slug,titulo,title,contenido,content,descripcion,description,subtitle,imagen,image,fecha_publicacion,created_at,date,categoria,category,status';

function mapRowToArticle(row: any): Article {
  return {
    id: String(row.id),
    slug: String(row.slug || ''),
    titulo: String(row.titulo ?? row.title ?? ''),
    contenido: String(row.contenido ?? row.content ?? ''),
    descripcion: (row.descripcion ?? row.description ?? row.subtitle ?? undefined) as
      | string
      | undefined,
    imagen: (row.imagen ?? row.image ?? undefined) as string | undefined,
    fecha_publicacion: (row.fecha_publicacion ??
      row.created_at ??
      row.date ??
      undefined) as string | undefined,
    categoria: String(row.categoria ?? row.category ?? ''),
    status: (row.status ?? null) as string | null,
  };
}

function isPublished(a: Article) {
  return !a.status || a.status === 'published' || a.status === 'publicado';
}

export const getAllPublishedArticles = cache(async () => {
  const supabase = createSupabaseServerClient();
  const res = await supabase
    .from(TABLE)
    .select(SELECT_LIST)
    .order('fecha_publicacion', { ascending: false })
    .order('created_at', { ascending: false });

  if (res.error) {
    // Fallback robusto (columnas opcionales como slug/fecha_publicacion pueden no existir)
    const resStar = await supabase
      .from(TABLE)
      .select('*')
      .order('fecha_publicacion', { ascending: false })
      .order('created_at', { ascending: false });

    if (!resStar.error) {
      return (resStar.data || []).map(mapRowToArticle).filter(isPublished);
    }

    const resStar2 = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (resStar2.error) throw resStar2.error;
    return (resStar2.data || []).map(mapRowToArticle).filter(isPublished);
  }

  return (res.data || []).map(mapRowToArticle).filter(isPublished);
});

async function findArticleByCategoriaAndSlug(
  categoriaParam: string,
  slugParam: string,
) {
  const all = await getAllPublishedArticles();
  return (
    all.find(
      (a) =>
        slugify(a.categoria) === categoriaParam &&
        (slugify(a.titulo) === slugParam || a.id === slugParam),
    ) || null
  );
}

export const getArticleByCategoriaSlug = cache(
  async (categoriaParam: string, slugParam: string) => {
    console.log('[getArticleByCategoriaSlug] Buscando:', { categoriaParam, slugParam });
    
    const supabase = createSupabaseServerClient();

    // 1) Buscar por slug (forma recomendada)
    const res = await supabase.from(TABLE).select(SELECT_LIST).eq('slug', slugParam);

    console.log('[getArticleByCategoriaSlug] Resultado búsqueda por slug:', { 
      error: res.error, 
      dataCount: res.data?.length || 0 
    });

    // Si la columna slug no existe o falla, intentar compatibilidad con ruta antigua por id
    if (res.error) {
      const msg = String((res.error as any)?.message || '');
      console.log('[getArticleByCategoriaSlug] Error en consulta:', msg);
      
      const looksLikeMissingSlug =
        msg.toLowerCase().includes('slug') && msg.toLowerCase().includes('column');

      if (looksLikeMissingSlug) {
        console.log('[getArticleByCategoriaSlug] Columna slug no existe, usando fallback');
        // No hay columna slug: buscamos por slug generado (slugify(titulo)) o por id
        return await findArticleByCategoriaAndSlug(categoriaParam, slugParam);
      }

      // Si el error es sobre 'titulo', intentar con 'title'
      if (msg.includes('titulo') && msg.includes('does not exist')) {
        console.log('[getArticleByCategoriaSlug] Columna titulo no existe, usando fallback con todos los artículos');
        return await findArticleByCategoriaAndSlug(categoriaParam, slugParam);
      }

      throw res.error;
    }

    const candidates = (res.data || []).map(mapRowToArticle).filter(isPublished);
    if (candidates.length === 0) {
      console.log('[getArticleByCategoriaSlug] Sin candidatos, usando fallback');
      // La columna slug existe pero este registro no tiene slug rellenado:
      // usamos el mismo fallback basado en titulo/id.
      return await findArticleByCategoriaAndSlug(categoriaParam, slugParam);
    }

    const match = candidates.find((a) => slugify(a.categoria) === categoriaParam);
    console.log('[getArticleByCategoriaSlug] Artículo encontrado:', !!match);
    return match || candidates[0] || null;
  },
);

export function getArticleHref(article: Pick<Article, 'categoria' | 'slug' | 'id' | 'titulo'>) {
  const categoria = slugify(article.categoria || 'noticias') || 'noticias';
  const slug = article.slug || slugify(article.titulo) || article.id;
  return `/${categoria}/${slug}`;
}

