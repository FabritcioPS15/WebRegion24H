import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <h1 className="text-[120px] font-serif font-black text-brand leading-none">
          404
        </h1>
        <h2 className="text-2xl font-serif font-black text-accent mb-6 uppercase tracking-tighter">
          Página no encontrada
        </h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto italic font-serif">
          Lo sentimos, el contenido que busca no está disponible o ha sido movido a una nueva ubicación.
        </p>
        <Link
          href="/"
          className="bg-accent text-white px-10 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-brand transition-all shadow-xl inline-block"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
