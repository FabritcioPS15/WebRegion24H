const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'articulo', '[id]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const generateStaticParams = `// Generar páginas estáticas para todos los artículos
export async function generateStaticParams() {
  const supabase = createSupabaseServerClient();
  const { data: articles } = await supabase
    .from('news')
    .select('id, slug')
    .or('status.is.null,status.eq.published');

  return (articles || []).map((article) => ({
    id: article.slug || article.id,
  }));
}
`;

// Insert after type Params line
content = content.replace(
  'type Params = { id: string };',
  'type Params = { id: string };\n\n' + generateStaticParams
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ generateStaticParams agregado exitosamente');
