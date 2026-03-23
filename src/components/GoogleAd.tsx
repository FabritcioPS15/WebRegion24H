import { motion } from 'framer-motion';

interface GoogleAdProps {
    slot?: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    className?: string;
    label?: string;
}

export default function GoogleAd({ className = "", label = "Publicidad" }: GoogleAdProps) {
    return (
        <div className={`my-8 ${className}`}>
            <div className="flex items-center gap-4 mb-4">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">{label}</span>
                <div className="flex-1 h-[1px] bg-gray-100"></div>
            </div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="relative bg-gray-50 border border-gray-100 min-h-[100px] md:min-h-[250px] flex items-center justify-center overflow-hidden group"
            >
                {/* Placeholder design */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent opacity-50"></div>
                
                <div className="relative z-10 text-center space-y-2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                        <span className="text-brand font-black text-lg">$</span>
                    </div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Espacio reservado para AdSense</p>
                </div>

                {/* Actual AdSense Slot (Commented out for now) */}
                {/* 
                <ins className="adsbygoogle"
                     style={{ display: 'block' }}
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                     data-ad-slot={slot}
                     data-ad-format={format}
                     data-full-width-responsive="true"></ins>
                <script>
                     (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
                */}
            </motion.div>
        </div>
    );
}
