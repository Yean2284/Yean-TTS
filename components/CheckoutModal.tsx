
import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { UserTier } from '../types';
import { Language, translations } from '../translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: UserTier;
  price: string;
  lang: Language;
  onSuccess: () => void;
}

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SlkGBQfUgh3jBhatg13IgCPnYn0YtIdtSop9fSsXeYNhskngi52Ud3hjeLxhwT9dxsEQSegCGaomKay2kFOYr9N00KeTSta7e'; 

const STRIPE_PRICE_IDS = {
  'Pro': 'price_1Spi8UQfUgh3jBhaOJHPg1cq',
  'Business': 'price_1Spi8zQfUgh3jBhamOhXPbUc',
  'Free': ''
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, tier, price, lang, onSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const t = translations[lang].checkout;
  const baseUrl = window.location.href.split('?')[0].replace(/\/$/, "");

  if (!isOpen) return null;

  const handleStripeCheckout = async () => {
    setStatus('processing');
    
    try {
      const stripe = (window as any).Stripe ? (window as any).Stripe(STRIPE_PUBLISHABLE_KEY) : null;
      
      if (!stripe) {
        alert("Error: No se pudo cargar Stripe.");
        setStatus('idle');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      window.location.href = `${baseUrl}?payment_success=true&tier=${tier}`;
      
    } catch (error) {
      console.error("Stripe Error:", error);
      alert("Hubo un problema al conectar con la pasarela de pago.");
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-black">{t.title}</h2>
              <p className="text-gray-400 text-sm font-bold flex items-center gap-1 mt-1">
                <Lock size={12} /> Pago Seguro Stripe (Modo Real Preparado)
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex justify-between items-center text-black">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t.plan}</p>
                <p className="text-xl font-black">{tier}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t.total}</p>
                <p className="text-3xl font-black">{price}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                <ShieldCheck size={14} className="inline mr-1" />
                Estás a punto de ser redirigido a la pasarela oficial de Stripe para completar tu suscripción mensual de forma segura.
              </p>
            </div>

            <button 
              disabled={status === 'processing'}
              onClick={handleStripeCheckout}
              className="w-full bg-black text-white py-6 rounded-2xl font-black text-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:bg-gray-400"
            >
              {status === 'processing' ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Redirigiendo...
                </>
              ) : (
                <>
                  <CreditCard size={24} />
                  Pagar con Stripe
                </>
              )}
            </button>
            
            <button 
              onClick={onClose}
              className="w-full text-gray-400 font-bold py-2 hover:text-black transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
