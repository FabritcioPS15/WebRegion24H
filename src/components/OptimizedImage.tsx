'use client';

// Removed next/image import

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    width?: number;
}

export default function OptimizedImage({
    src,
    alt,
    className = '',
    priority = false,
    width = 800
}: OptimizedImageProps) {

    const getOptimizedUrl = (url: string) => {
        if (!url) return '';

        try {
            // Pexels Optimization
            if (url.includes('images.pexels.com')) {
                const baseUrl = url.split('?')[0];
                return `${baseUrl}?auto=compress&cs=tinysrgb&w=${width}`;
            }

            // Unsplash Optimization
            if (url.includes('images.unsplash.com')) {
                const baseUrl = url.split('?')[0];
                return `${baseUrl}?auto=format&fit=crop&w=${width}&q=80`;
            }

            // Supabase Optimization (if enabled on the project)
            // https://supabase.com/docs/guides/storage/serving/image-transformations
            if (url.includes('.supabase.co/storage/v1/object/public/')) {
                // Check if the URL already has parameters
                const separator = url.includes('?') ? '&' : '?';
                return `${url}${separator}width=${width}&quality=80`;
            }
        } catch (e) {
            console.error('Error optimizing image URL:', e);
        }

        return url;
    };

    const optimizedUrl = getOptimizedUrl(src);

    if (!optimizedUrl) return null;

    return (
        <span className="relative block w-full h-full overflow-hidden">
            <img
                src={optimizedUrl}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${className}`}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
            />
        </span>
    );
}
