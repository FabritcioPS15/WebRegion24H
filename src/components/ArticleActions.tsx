'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Facebook, Link2, Twitter } from 'lucide-react';

export default function ArticleActions({
  articleId,
  title,
  subtitle,
  showSave = true,
  showCount = false,
  count = 23,
}: {
  articleId: string;
  title: string;
  subtitle?: string;
  showSave?: boolean;
  showCount?: boolean;
  count?: number;
}) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_articles') || '[]');
      setIsSaved(Array.isArray(saved) ? saved.includes(articleId) : false);
    } catch {
      setIsSaved(false);
    }
  }, [articleId]);

  const shareData = useMemo(
    () => ({
      title: title || 'Noticias 24H',
      text: subtitle || title || '',
      url: typeof window !== 'undefined' ? window.location.href : '',
    }),
    [title, subtitle],
  );

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('¡Enlace copiado al portapapeles!');
      }
    } catch {
      // no-op
    }
  };

  const handleSave = () => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('saved_articles') || '[]');
      const normalized = Array.isArray(saved) ? saved : [];

      if (isSaved) {
        const updated = normalized.filter((id) => id !== articleId);
        localStorage.setItem('saved_articles', JSON.stringify(updated));
        setIsSaved(false);
      } else {
        localStorage.setItem('saved_articles', JSON.stringify([...normalized, articleId]));
        setIsSaved(true);
      }
    } catch {
      // silent fail
    }
  };

  return (
    <div className="flex items-center gap-4 text-gray-500">
      <button
        type="button"
        className="hover:text-brand transition-colors"
        onClick={handleShare}
        title="Compartir en Facebook"
      >
        <Facebook size={18} />
      </button>
      <button
        type="button"
        className="hover:text-brand transition-colors"
        onClick={handleShare}
        title="Compartir en X"
      >
        <Twitter size={18} />
      </button>
      <button
        type="button"
        className="hover:text-brand transition-colors"
        onClick={handleShare}
        title="Copiar enlace"
      >
        <Link2 size={18} />
      </button>
      {showCount ? <span className="text-xs font-black">{count}</span> : null}
      {showSave ? (
        <button
          type="button"
          className={`hover:text-brand transition-colors ${isSaved ? 'text-brand' : ''}`}
          onClick={handleSave}
          title={isSaved ? 'Guardado' : 'Guardar'}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      ) : null}
    </div>
  );
}
