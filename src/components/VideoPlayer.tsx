'use client';

import { useState } from 'react';
import type { Video } from '../types/news';

interface VideoPlayerProps {
  video: Video;
  className?: string;
  autoplay?: boolean;
}

export default function VideoPlayer({ 
  video, 
  className = 'w-full h-full',
  autoplay = false 
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Determinar el tipo de video y la URL del reproductor
  const getEmbedUrl = (url: string) => {
    if (!url) return null;

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0`;
      }
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}`;
      }
    }

    // Si es una URL directa de video, devolverla como está
    if (url.match(/\.(mp4|webm|ogg)$/i) || url.includes('blob:')) {
      return url;
    }

    return null;
  };

  const embedUrl = getEmbedUrl(video.url || '');
  const isDirectVideo = embedUrl && !embedUrl.includes('youtube.com') && !embedUrl.includes('vimeo.com');

  if (!embedUrl) {
    return (
      <div className={`${className} bg-zinc-900 flex items-center justify-center`}>
        <div className="text-center space-y-4 p-6">
          <p className="text-white text-lg font-semibold">Video no disponible</p>
          <p className="text-gray-400 text-sm">No se proporcionó una URL válida para este video.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isDirectVideo ? (
        <video
          controls
          className={className}
          poster={video.thumbnail}
          autoPlay={autoplay}
          onLoadStart={() => setIsLoading(false)}
          onError={() => setError(true)}
        >
          <source src={embedUrl} type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      ) : (
        <div className={`${className} bg-zinc-900 relative`}>
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            title={video.title}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
              <div className="animate-spin">
                <div className="h-12 w-12 border-4 border-gray-600 border-t-brand rounded-full" />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
