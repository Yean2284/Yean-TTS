
import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Loader2, Globe, AlertCircle } from 'lucide-react';
import { Language, translations } from '../translations';
import { supabase } from '../lib/supabase';

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
  const [errorMsg, setErrorMsg] = useState('');
  const t = translations[lang].auth;

  // Detecta la URL base actual (incluyendo subcarpetas de GitHub)
  const baseUrl = window.location.href.split('?')[0].replace(/\/$/, "");

  useEffect(() => {
    if (isOpen) {
      console.log("--- CONFIGURACIÓN GOOGLE CLOUD ---");
      console.log("1. Authorized JavaScript Origin:", window.location.origin);
      console.log("2. Authorized Redirect URI: https://oukwektkckchdopbikye.supabase.co/auth/v1/callback");
      console.log("----------------------------------");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      if (mode === 'signUp') {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: baseUrl
          }
        });
        if (error) throw error;
        alert(lang === 'es' ? '¡Registro exitoso! Por favor verifica tu email.' : 'Sign up successful! Please verify your email.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: baseUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Error Google Auth:", err);
      setErrorMsg(err.message || "Error al conectar con Google");
    }
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

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2 flex gap-3 items-center">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

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
              type="submit"
              className="w-full bg-black text-white py-6 rounded-[24px] font-black text-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:bg-gray-400 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (mode === 'signIn' ? t.signIn : t.signUp)}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest"><span className="bg-white px-4 text-gray-300">OR</span></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleAuth}
            className="w-full border-2 border-gray-100 py-5 rounded-[24px] font-bold text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-4 active:scale-95 bg-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t.google}
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
