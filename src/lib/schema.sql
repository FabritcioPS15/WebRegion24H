-- Create News table
CREATE TABLE news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  image TEXT NOT NULL,
  author TEXT NOT NULL,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  breaking BOOLEAN DEFAULT false,
  links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ... rest of existing tables ...

-- INSTRUCCIONES PARA SUPABASE STORAGE:
-- 1. Ve a 'Storage' en tu panel de Supabase.
-- 2. Crea un nuevo Bucket llamado 'media'.
-- 3. Asegúrate de que el bucket sea 'Public'.
-- 4. En 'Policies', agrega una política que permita 'Public Access' (SELECT) para todos.
-- 5. Agrega una política que permita 'Insert/Update/Delete' para todos (puedes restringirlo después).

-- Add status column to address visibility and future approval flow
ALTER TABLE news ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('published', 'hidden', 'draft', 'pending')) DEFAULT 'published';
ALTER TABLE podcasts ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('published', 'hidden', 'draft', 'pending')) DEFAULT 'published';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('published', 'hidden', 'draft', 'pending')) DEFAULT 'published';

-- Create Podcasts table
CREATE TABLE podcasts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  image TEXT NOT NULL,
  live BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Videos table
CREATE TABLE videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  duration TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Optional but recommended)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Read only for anon)
CREATE POLICY "Public Read Access" ON news FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON podcasts FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON videos FOR SELECT USING (true);

-- Create policies for insert/update/delete (You might want to restrict this later)
CREATE POLICY "All Access for Everyone" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All Access for Everyone" ON podcasts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "All Access for Everyone" ON videos FOR ALL USING (true) WITH CHECK (true);

-- CONFIGURACIÓN AUTOMÁTICA PARA EL BUCKET 'media'
-- Habilitar el bucket si no existe (opcional si ya lo creó)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;

-- Políticas de Almacenamiento (Storage)
-- Estas políticas permiten que cualquier usuario suba y vea archivos en el bucket 'media'

-- 1. Permitir ver archivos (SELECT)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'media');

-- 2. Permitir subir archivos (INSERT)
CREATE POLICY "Insert Access" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'media');

-- 3. Permitir actualizar archivos (UPDATE)
CREATE POLICY "Update Access" 
ON storage.objects FOR UPDATE 
TO public 
USING (bucket_id = 'media');

-- 4. Permitir borrar archivos (DELETE)
CREATE POLICY "Delete Access" 
ON storage.objects FOR DELETE 
TO public 
USING (bucket_id = 'media');

-- DATOS INICIALES DE EJEMPLO (SEED DATA)
-- Puedes copiar y pegar esto en el SQL Editor para repoblar tu sitio

-- SOLUCIÓN AL ERROR: Si te sale error de que la columna "links" no existe, ejecuta esto primero:
-- ALTER TABLE news ADD COLUMN IF NOT EXISTS links JSONB DEFAULT '[]'::jsonb;

-- Noticias
INSERT INTO news (title, subtitle, content, category, date, time, image, author, tags, featured, breaking, links) VALUES
('Avances en Energías Renovables', 'Instalan primer parque eólico en la zona norte', 'Este proyecto proveerá energía limpia a más de 20,000 hogares, marcando un hito en la sostenibilidad regional.', 'Medio Ambiente', '25 de enero de 2025', '08:45', 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Elena Ruiz', ARRAY['energía', 'viento', 'sostenible'], false, false, '[]'),
('Copa Regional: Resultados Finales', 'El equipo local se corona campeón tras infartante final', 'En una jornada histórica para el deporte regional, se definieron los ganadores del torneo anual.', 'Deportes', '26 de enero de 2025', '18:20', 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Pedro Gómez', ARRAY['deportes', 'fútbol', 'final'], false, false, '[{"label": "Galería de fotos", "url": "#"}]'),
('Feria Tecnológica atrae a miles', 'Jóvenes presentan innovaciones en robótica y software', 'La feria regional se convirtió en el epicentro de la tecnología, mostrando el talento de los estudiantes.', 'Tecnología', '27 de enero de 2025', '14:00', 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Andrés Vera', ARRAY['tecnología', 'innovación', 'feria'], false, false, '[]'),
('Estrategias para el Sector Agrícola', 'Expertos proponen nuevas técnicas de riego tecnificado', 'Buscando optimizar el recurso hídrico, se presentaron soluciones innovadoras para los agricultores.', 'Región', '28 de enero de 2025', '07:30', 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Redacción NOTICIAS 24H', ARRAY['agricultura', 'riego', 'producción'], false, false, '[]');

-- Podcasts
INSERT INTO podcasts (title, description, duration, image, live) VALUES
('Hablemos de Economía', 'Entrevistas con especialistas sobre la situación financiera actual.', '32:15', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80', false),
('Cultura en Red', 'Todo sobre las expresiones artísticas y culturales de nuestra tierra.', '28:40', 'https://images.unsplash.com/photo-1514525253344-f814d8742985?w=800&q=80', false);

-- Videos
INSERT INTO videos (title, description, thumbnail, duration, category) VALUES
('Documental: Patrimonio Regional', 'Un viaje visual por los lugares más emblemáticos de nuestra región.', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', '18:10', 'Cultura');

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public to subscribe (Insert)
CREATE POLICY "Allow public subscription" ON subscriptions FOR INSERT WITH CHECK (true);

-- Allow viewing subscribers (Select)
CREATE POLICY "Allow public read access" ON subscriptions FOR SELECT USING (true);
