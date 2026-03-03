import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-black text-accent mb-4">
          Artículo no encontrado
        </h1>
        <Link
          href="/"
          className="text-brand hover:underline font-black uppercase tracking-widest text-xs"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

