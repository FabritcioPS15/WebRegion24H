import { Mail, Phone, MapPin, Youtube, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const categories = [
    "Información",
    "Nacionales",
    "Internacionales",
    "Economía",
    "Deportes",
    "Cultura",
    "Tecnología",
    "Salud"
  ];

  return (
    <footer className="bg-accent text-white mt-12 border-t-[12px] border-brand">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24"
        >
          <div className="space-y-8">
            <h3 className="text-4xl font-serif font-black tracking-tighter uppercase leading-none">REGIÓN <span className="text-brand">24H</span></h3>
            <p className="text-gray-500 text-xs font-serif italic leading-relaxed max-w-xs">
              "La excelencia en el periodismo es nuestra única brújula. Informando con rigor y elegancia a toda la región."
            </p>
            <div className="flex gap-4">
              {[Youtube, Facebook, Instagram, Twitter].map((Icon, idx) => (
                <div key={idx} className="bg-white/5 p-3 hover:bg-brand transition-all cursor-pointer group text-gray-400">
                  <Icon size={18} className="group-hover:text-white" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-8">Nuestras Secciones</h4>
            <ul className="grid grid-cols-1 gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {categories.map((category, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white hover:pl-2 transition-all duration-300">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-8">Oficina Central</h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <li className="flex items-start gap-4">
                <MapPin size={16} className="text-brand shrink-0" />
                <span className="leading-relaxed">Av. Central de Negocios 1205, Piso 18<br />Lima, Perú</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={16} className="text-brand shrink-0" />
                <span>+51 9580 777 827</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={16} className="text-brand shrink-0" />
                <span>ejecutivo@region24h.pe</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-8">Suscripción Ejecutiva</h4>
            <p className="text-gray-500 text-xs font-serif italic mb-8">
              Reciba nuestro boletín matutino con los hechos que mueven el mundo.
            </p>
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email corporativo"
                className="w-full px-6 py-4 bg-white/5 text-white border border-white/10 focus:outline-none focus:border-brand tracking-widest text-[10px] font-bold"
              />
              <button className="bg-brand text-white px-6 py-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-brand-dark transition-all transform active:scale-[0.98] shadow-2xl">
                Suscribirse
              </button>
            </div>
          </div>
        </motion.div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 text-center md:text-left">
            © 2025 REGIÓN 24H • PERIODISMO DE ALTURA INDEPENDIENTE
          </div>
          <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
            <a href="#" className="hover:text-brand transition-colors">Términos Legales</a>
            <a href="#" className="hover:text-brand transition-colors">Privacidad</a>
            <a href="#" className="hover:text-brand transition-colors">Política de Calidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
