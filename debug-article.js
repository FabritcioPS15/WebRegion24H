const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ARTICLE_ID = 'bd1bdb27-0ddf-41fe-ba14-4c63c463b590';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan variables de entorno');
  console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ configurada' : '❌ no configurada');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_KEY ? '✅ configurada' : '❌ no configurada');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function debug() {
  console.log('🔍 Buscando artículo con ID:', ARTICLE_ID);
  console.log('');

  try {
    // 1. Verificar si la tabla existe y obtener todas las columnas
    console.log('📋 Buscando en tabla "news"...');
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', ARTICLE_ID);

    if (error) {
      console.error('❌ Error en la consulta:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('❌ No se encontró artículo con ese ID');
      
      // Listar artículos existentes para verificar
      console.log('');
      console.log('📊 Artículos disponibles en la tabla:');
      const { data: allArticles, error: allError } = await supabase
        .from('news')
        .select('id, title, created_at')
        .limit(5);
      
      if (allError) {
        console.error('Error al listar artículos:', allError);
      } else {
        if (!allArticles || allArticles.length === 0) {
          console.log('   → No hay artículos en la tabla');
        } else {
          allArticles.forEach((article) => {
            console.log(`   • ID: ${article.id}`);
            console.log(`     Título: ${article.title}`);
            console.log(`     Creado: ${article.created_at}`);
          });
        }
      }
    } else {
      console.log('✅ Artículo encontrado!');
      console.log('');
      console.log('Detalles del artículo:');
      const article = data[0];
      Object.entries(article).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

debug();
