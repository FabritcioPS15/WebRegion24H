import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface SubscriptionFormProps {
    className?: string;
    variant?: 'footer' | 'article';
}

export default function SubscriptionForm({ className, variant = 'footer' }: SubscriptionFormProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const { error } = await supabase
                .from('subscriptions')
                .insert([{ email }]);

            if (error) {
                if (error.code === '23505') {
                    setStatus('error');
                    setMessage('Este correo ya está suscrito.');
                } else {
                    throw error;
                }
            } else {
                setStatus('success');
                setEmail('');
                setMessage('¡Gracias por suscribirte!');
            }
        } catch (err: any) {
            console.error('Subscription error:', err);
            setStatus('error');
            setMessage('Hubo un error. Inténtalo de nuevo.');
        }
    };

    const isFooter = variant === 'footer';

    return (
        <div className={className}>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder={isFooter ? "Email corporativo" : "tu@email.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading' || status === 'success'}
                    className={`w-full px-6 py-4 bg-white/5 border focus:outline-none focus:border-brand tracking-widest text-[10px] font-bold ${isFooter
                            ? 'text-white border-white/10'
                            : 'text-white border-white/20'
                        }`}
                    required
                />
                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${isFooter
                            ? 'bg-brand text-white hover:bg-brand/80'
                            : 'bg-brand text-white hover:bg-white hover:text-accent font-black tracking-[0.2em]'
                        }`}
                >
                    {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin" /> ENVIANDO...
                        </span>
                    ) : 'SUSCRIBIRME'}
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-[10px] font-bold tracking-widest uppercase ${status === 'error' ? 'text-red-400' : 'text-brand'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
