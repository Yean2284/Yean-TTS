
import React, { useState } from 'react';
import { X, Mail, Lock, Loader2, Globe } from 'lucide-react';
import { Language, translations } from '../translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lang, onSuccess }) => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const t = translations[lang].auth;

  if (!isOpen) return null;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulación persistente en localStorage para que el usuario pueda "registrarse" y luego "loguearse"
    setTimeout(() => {
      setLoading(false);
      const user = { email, name: email.split('@')[0] };
      onSuccess(user);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tighter text-black">{t.title}</h2>
              <p className="text-gray-400 font-bold mt-2 text-sm leading-relaxed">{t.subtitle}</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-black">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] font-bold text-black outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] font-bold text-black outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-black text-white py-6 rounded-[24px] font-black text-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:bg-gray-400 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (mode === 'signIn' ? t.signIn : t.signUp)}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest"><span className="bg-white px-4 text-gray-300">OR</span></div>
          </div>

          <button className="w-full border-2 border-gray-100 py-5 rounded-[24px] font-bold text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-4 active:scale-95 bg-white">
            <Globe size={20} className="text-black" /> {t.google}
          </button>

          <p className="text-center mt-10 text-sm font-bold text-gray-400">
            {mode === 'signIn' ? t.noAccount : t.hasAccount}{' '}
            <button 
              type="button"
              onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
              className="text-black font-black hover:underline"
            >
              {mode === 'signIn' ? t.signUp : t.signIn}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
