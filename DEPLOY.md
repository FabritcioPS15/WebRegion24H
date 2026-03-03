# DEPLOYMENT GUIDE - Vercel y Hostinger

## 1. DEPLOY EN VERCEL (Recomendado para Next.js)

### Paso 1: Preparar Variables de Entorno
Copia el archivo `.env.example` a `.env.local` y configura tus variables:

```bash
cp .env.example .env.local
```

**Variables necesarias:**
```
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key (opcional)
SUPABASE_ARTICLES_TABLE=news
```

### Paso 2: Deploy en Vercel

**Opción A: CLI de Vercel (más rápido)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login y deploy
vercel login
vercel
```

**Opción B: Dashboard de Vercel (web)**
1. Ve a https://vercel.com/new
2. Importa tu repositorio de GitHub
3. Selecciona el proyecto
4. Vercel detectará automáticamente Next.js
5. Configura las variables de entorno en el panel
6. Deploy!

### Paso 3: Configurar Variables en Vercel Dashboard
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega todas las variables del `.env.example`

---

## 2. DEPLOY EN HOSTINGER

### Opción A: Hostinger con Node.js (si tu plan lo soporta)

1. **Conectar tu repositorio:**
   - En el panel de Hostinger, ve a "Git"
   - Conecta tu repositorio de GitHub
   - Selecciona la rama principal

2. **Configurar Build:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: 18.x o superior

3. **Variables de Entorno:**
   - En el panel de Hostinger, ve a "Advanced" → "Environment Variables"
   - Agrega todas las variables del `.env.example`

### Opción B: Export Estático (para hosting compartido)

Si tu plan de Hostinger no soporta Node.js, usa export estático:

1. **Modificar next.config.mjs:**
```javascript
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};
```

2. **Build local:**
```bash
npm run build
```

3. **Subir a Hostinger:**
   - Sube la carpeta `dist` (o `.next/static` si usaste export) via FTP o File Manager
   - O conecta tu repo y configura el deploy

---

## CHECKLIST PRE-DEPLOY

- [ ] Verificar todas las variables de entorno
- [ ] Probar build local: `npm run build`
- [ ] Verificar que no haya errores de TypeScript: `npm run typecheck`
- [ ] Revisar que las imágenes externas estén permitidas en next.config.mjs
- [ ] Confirmar conexión a Supabase funciona

---

## COMANDOS ÚTILES

```bash
# Verificar build local
npm run build

# Verificar tipos
npm run typecheck

# Preview del build
npm start

# Deploy a Vercel (producción)
vercel --prod
```
