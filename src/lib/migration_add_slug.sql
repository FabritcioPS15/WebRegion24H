-- ============================================================================
-- MIGRACIÓN: Agregar columna 'slug' a la tabla 'news' para URLs amigables
-- 
-- INSTRUCCIONES:
-- 1. Ve a tu panel de Supabase > SQL Editor
-- 2. Pega y ejecuta SOLO este archivo (no el schema.sql completo)
-- ============================================================================

-- 0. Habilitar extensión unaccent (quita tildés y acentos)
--    Si ya está habilitada, este comando es inofensivo.
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 1. Agregar columna slug
ALTER TABLE news
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Poblar slugs desde el título usando unaccent
UPDATE news
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        unaccent(title),
        '[^a-zA-Z0-9\s]', '', 'g'
      ),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
)
WHERE slug IS NULL OR slug = '';

-- 3. Unicidad: si dos artículos tienen el mismo slug, añade sufijo con id corto
UPDATE news n1
SET slug = n1.slug || '-' || SUBSTRING(n1.id::text, 1, 8)
WHERE EXISTS (
  SELECT 1 FROM news n2
  WHERE n2.slug = n1.slug AND n2.id != n1.id
);

-- 4. Índice único para búsquedas rápidas
CREATE UNIQUE INDEX IF NOT EXISTS news_slug_unique ON news (slug) WHERE slug IS NOT NULL;

-- ============================================================================
-- VERIFICACIÓN: Ejecuta esto para ver los slugs generados:
-- SELECT id, title, slug FROM news ORDER BY created_at DESC LIMIT 20;
-- ============================================================================
