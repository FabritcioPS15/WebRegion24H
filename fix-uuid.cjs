const fs = require('fs');

const filePath = 'src/app/articulo/[id]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldFunction = `async function getArticleBySlugOrId(slugOrId: string) {
  const supabase = createSupabaseServerClient();

  // Primero intenta por slug (SEO)
  const { data: bySlug, error: slugError } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slugOrId)
    .maybeSingle();

  if (bySlug) return bySlug;

  // Fallback por UUID (compatibilidad con links antiguos)
  const { data: byId, error: idError } = await supabase
    .from('news')
    .select('*')
    .eq('id', slugOrId)
    .maybeSingle();

  if (!byId && (slugError || idError)) {
    console.error(\`[getArticleBySlugOrId] Error buscando "\${slugOrId}":\`, {
      slugError: slugError?.message,
      idError: idError?.message,
    });
  }

  return byId;
}`;

const newFunction = `async function getArticleBySlugOrId(slugOrId: string) {
  const supabase = createSupabaseServerClient();

  // Primero intenta por slug (SEO)
  const { data: bySlug } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slugOrId)
    .maybeSingle();

  if (bySlug) return bySlug;

  // Solo buscar por ID si es un UUID válido
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
  
  if (isValidUUID) {
    const { data: byId } = await supabase
      .from('news')
      .select('*')
      .eq('id', slugOrId)
      .maybeSingle();
    
    return byId;
  }

  return null;
}`;

if (content.includes(oldFunction)) {
  content = content.replace(oldFunction, newFunction);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Función actualizada correctamente');
} else {
  console.log('⚠️ No se encontró la función exacta');
}
