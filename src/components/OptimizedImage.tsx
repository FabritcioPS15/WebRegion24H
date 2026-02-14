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
        } catch (e) {
            console.error('Error optimizing image URL:', e);
        }

        return url;
    };

    const optimizedUrl = getOptimizedUrl(src);

    return (
        <img
            src={optimizedUrl}
            alt={alt}
            className={className}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
        />
    );
}
