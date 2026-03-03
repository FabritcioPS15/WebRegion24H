/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Supabase Storage public URLs typically look like:
      // https://<project-ref>.supabase.co/storage/v1/object/public/...
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;

