
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

/**
 * CONFIGURACIÓN DE STRIPE REAL
 * ----------------------------
 * 1. Pega tu pk_... en STRIPE_PUBLISHABLE_KEY
 * 2. Pega tus price_... en STRIPE_PRICE_IDS
 */
const STRIPE_PUBLISHABLE_KEY = 'pk_test_REEMPLAZAR_POR_TU_CLAVE_PUBLISHABLE'; 

const STRIPE_PRICE_IDS = {
  'Pro': 'price_REEMPLAZAR_POR_ID_API_DE_YEANPRO', // El que empieza por price_...
  'Business': 'price_REEMPLAZAR_POR_ID_API_DE_BUSINESS',
  'Free': ''
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, tier, price, lang, onSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const t = translations[lang].checkout;

  if (!isOpen) return null;

  const handleStripeCheckout = async () => {
    setStatus('processing');
    
    // Cargamos la instancia de Stripe
    const stripe = (window as any).Stripe ? (window as any).Stripe(STRIPE_PUBLISHABLE_KEY) : null;
    
    if (!stripe) {
      alert("Error: No se pudo cargar Stripe. Revisa tu conexión.");
      setStatus('idle');
      return;
    }

    try {
      // En una integración real, aquí harías un fetch a tu backend (Supabase Edge Function)
      // pasándole el priceId correspondiente: STRIPE_PRICE_IDS[tier]
      console.log(`Iniciando checkout para el ID de API: ${STRIPE_PRICE_IDS[tier as keyof typeof STRIPE_PRICE_IDS]}`);
      
      // Simulamos el proceso de redirección y confirmación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus('success');
      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus('idle');
      }, 2000);
      
    } catch (error) {
      console.error("Error en el proceso de pago:", error);
      alert("Hubo un error al procesar el pago.");
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
                <Lock size={12} /> Pago Seguro via Stripe
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black">
              <X size={24} />
            </button>
          </div>

          {status === 'success' ? (
            <div className="py-12 text-center animate-in zoom-in duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 size={64} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-black mb-2 text-black">{t.success}</h3>
              <p className="text-gray-500 font-bold">¡Bienvenido al nivel {tier}!</p>
            </div>
          ) : (
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

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <p className="text-xs text-indigo-600 font-bold leading-relaxed">
                  Estás a un paso de desbloquear todo el poder de Yean. Serás redirigido a la pasarela oficial de Stripe.
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
                    {t.processing}
                  </>
                ) : (
                  <>
                    <CreditCard size={24} />
                    {lang === 'es' ? 'Proceder al Pago' : 'Proceed to Payment'}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
