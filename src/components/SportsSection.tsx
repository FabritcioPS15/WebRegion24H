import { Calendar, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SportsSection() {
  const sports = [
    {
      title: "Final de temporada: el equipo local se prepara para el campeonato",
      date: "23 de enero de 2025",
      time: "20:00",
      image: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Nuevo récord en atletismo regional establecido",
      date: "22 de enero de 2025",
      time: "18:30",
      image: "https://images.pexels.com/photos/2524739/pexels-photo-2524739.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Inauguración del complejo deportivo municipal",
      date: "21 de enero de 2025",
      time: "16:00",
      image: "https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-100">
      <div className="flex items-center gap-6 mb-16">
        <h2 className="text-sm font-black text-accent uppercase tracking-[0.5em] border-l-4 border-brand pl-6">Crónica Deportiva</h2>
        <div className="flex-1 h-[1px] bg-gray-100"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {sports.map((item, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer border-b border-gray-50 pb-8"
          >
            <div className="relative h-64 overflow-hidden mb-6 bg-accent border border-gray-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-1000 grayscale-[40%] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-0 right-0">
                <div className="bg-brand text-white p-3 shadow-2xl">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-[9px] font-black text-brand uppercase tracking-widest gap-2">
                <Calendar className="h-4 w-4" />
                <span>{item.date} • {item.time}</span>
              </div>
              <h3 className="font-serif font-black text-2xl text-accent mb-3 line-clamp-2 leading-tight group-hover:text-brand transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 text-xs font-serif italic py-1 line-clamp-2">
                Análisis detallado de la jornada deportiva y sus implicaciones en la tabla regional.
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
