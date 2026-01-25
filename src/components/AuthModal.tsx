import { useState } from 'react';
import { X, Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple password check (in production, this should be more secure)
    if (password === 'admin123') {
      setTimeout(() => {
        onSuccess();
        setPassword('');
        setIsLoading(false);
        onClose();
      }, 500);
    } else {
      setError('Contraseña incorrecta');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-accent/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white p-10 w-full max-w-md shadow-2xl border-2 border-accent relative z-10"
          >
            <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent p-2">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-accent tracking-tighter uppercase">
                    Editor Login
                  </h2>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">SISTEMA INTERNO v2.0</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-brand transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                  Contraseña de Seguridad
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-5 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand transition-all font-black text-accent tracking-widest"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="absolute right-5 top-5 h-5 w-5 text-gray-300" />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-brand/5 border-l-4 border-brand text-brand text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex flex-col gap-4 pt-2">
                <button
                  type="submit"
                  className="w-full py-5 bg-accent text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-brand transition-all disabled:opacity-50 shadow-xl shadow-accent/10 flex items-center justify-center gap-3 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Verificar Acceso
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-accent transition-all"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>

            <div className="mt-10 pt-6 border-t border-gray-50 text-center">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Credenciales de Acceso Provisionales</p>
              <code className="text-xs bg-gray-100 text-accent px-4 py-2 font-black border border-gray-200">admin123</code>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
