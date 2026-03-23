'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

interface LegalPageProps {
  title: string;
  lastUpdated?: string;
  content: React.ReactNode;
}

export default function LegalPage({ title, lastUpdated, content }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="border-b-4 border-brand pb-8 mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-accent tracking-tighter uppercase leading-none">
              {title}
            </h1>
            {lastUpdated && (
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6 italic">
                Última actualización: {lastUpdated}
              </p>
            )}
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
            {content}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

// Content for Terms
export function TermsContent() {
  return (
    <>
      <section>
        <h2 className="text-2xl font-black text-accent uppercase tracking-tight mb-4 not-italic">1. Aceptación de Términos</h2>
        <p>Al acceder y utilizar NOTICIAS 24H, usted acepta cumplir con estos términos legales. Si no está de acuerdo, por favor absténgase de usar nuestro sitio.</p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-accent uppercase tracking-tight mb-4 not-italic">2. Propiedad Intelectual</h2>
        <p>Todo el contenido, incluyendo textos, gráficos y logotipos, es propiedad de NOTICIAS 24H y está protegido por las leyes de derechos de autor internacionales.</p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-accent uppercase tracking-tight mb-4 not-italic">3. Uso de la Información</h2>
        <p>La información proporcionada es para uso personal y no comercial. Queda prohibida la reproducción total o parcial sin autorización previa por escrito.</p>
      </section>
    </>
  );
}

// Content for Privacy
export function PrivacyContent() {
  return (
    <>
      <section>
        <h2 className="text-2xl font-black text-accent uppercase tracking-tight mb-4 not-italic">1. Recopilación de Datos</h2>
        <p>Recopilamos información personal solo cuando es necesario para brindarle nuestros servicios, como su suscripción al boletín informativo.</p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-accent uppercase tracking-tight mb-4 not-italic">2. Uso de Cookies</h2>
        <p>Utilizamos cookies para mejorar su experiencia de navegación y analizar el tráfico de nuestro sitio de manera anónima.</p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-accent uppercase tracking-tight mb-4 not-italic">3. Protección de Información</h2>
        <p>Implementamos medidas de seguridad robustas para proteger sus datos personales contra acceso no autorizado o divulgación.</p>
      </section>
    </>
  );
}

// Content for Quality
export function QualityContent() {
  return (
    <>
      <section>
        <h2 className="text-2xl font-black text-accent uppercase tracking-tight mb-4 not-italic">1. Rigor Periodístico</h2>
        <p>Nos comprometemos a verificar cada noticia con al menos tres fuentes independientes antes de su publicación.</p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-accent uppercase tracking-tight mb-4 not-italic">2. Independencia Editorial</h2>
        <p>Nuestra línea editorial es totalmente independiente de intereses políticos o corporativos, priorizando siempre la verdad.</p>
      </section>
      <section>
        <h2 className="text-2xl font-black text-accent uppercase tracking-tight mb-4 not-italic">3. Excelencia Ejecutiva</h2>
        <p>Buscamos la excelencia no solo en la información, sino en la presentación y el diseño de cada pieza informativa.</p>
      </section>
    </>
  );
}
