
import React, { useState, useEffect, useCallback } from 'react';
import { Mic, Sliders, Play, Download, Trash2, Search, RotateCcw, MonitorPlay, HelpCircle, ChevronDown, Menu, Heart, MessageSquare, Loader2, Crown, Check, Zap, ShieldCheck, Globe, Infinity, ShoppingBag, Youtube, Music, Presentation, Twitter, Mail, User as UserIcon, LogOut } from 'lucide-react';
import { Voice, VoiceSettings, GeneratedAudio, Tab, UserTier, Plan } from './types';
import { translations, Language } from './translations';
import VoiceEffectsModal from './components/VoiceEffectsModal';
import VoiceSelection from './components/VoiceSelection';
import GeneratedAudiosList from './components/GeneratedAudiosList';
import LegalModal from './components/LegalModal';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import { generateSpeech } from './services/geminiTTS';

const INITIAL_SETTINGS: VoiceSettings = {
  pitch: 0,
  speed: 0,
  volume: 100,
  rememberSettings: false
};

const PLANS: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['5,000 characters per gen', 'Standard Voices', 'MP3 Downloads', 'Community Support', 'Commercial License (Personal)'],
    buttonText: 'Current Plan'
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    features: ['20,000 characters per gen', 'Premium AI Voices', 'Full Commercial License', 'Priority Support', 'High Fidelity Audio'],
    buttonText: 'Upgrade to Pro',
    isPopular: true
  },
  {
    name: 'Business',
    price: '$49',
    period: 'per month',
    features: ['Unlimited characters', 'Custom Voice Synthesis', 'API Access', 'Dedicated Account Manager', 'Bulk Generation'],
    buttonText: 'Get Business'
  }
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('es');
  const [activeTab, setActiveTab] = useState<Tab>(Tab.VoiceSelection);
  const [text, setText] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkoutData, setCheckoutData] = useState<{ open: boolean, tier: UserTier, price: string }>({ open: false, tier: 'Free', price: '$0' });
  const [legalModal, setLegalModal] = useState<{ open: boolean; title: string; content: React.ReactNode }>({ open: false, title: '', content: null });
  const [settings, setSettings] = useState<VoiceSettings>(INITIAL_SETTINGS);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [history, setHistory] = useState<GeneratedAudio[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userTier, setUserTier] = useState<UserTier>('Free');

  const t = translations[lang];

  const refreshCaptcha = useCallback(() => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptcha(code);
    setUserCaptcha('');
  }, []);

  useEffect(() => {
    refreshCaptcha();
    setSelectedVoice({ id: 'gemini-Kore', name: 'Kore (Multilingual)', gender: 'Female', language: 'Multilingual', country: 'Global', isPremium: true });
    
    const savedUser = localStorage.getItem('yeantts_user');
    const savedTier = localStorage.getItem('yeantts_tier');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      const userHistory = localStorage.getItem(`yeantts_history_${parsedUser.email}`);
      if (userHistory) setHistory(JSON.parse(userHistory));
    } else {
      const guestHistory = localStorage.getItem('yeantts_history_guest');
      if (guestHistory) setHistory(JSON.parse(guestHistory));
    }

    if (savedTier) setUserTier(savedTier as UserTier);
  }, [refreshCaptcha]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`yeantts_history_${user.email}`, JSON.stringify(history));
    } else {
      localStorage.setItem('yeantts_history_guest', JSON.stringify(history));
    }
  }, [history, user]);

  const handleGenerate = async () => {
    const charLimit = userTier === 'Free' ? 5000 : 20000;
    
    if (userCaptcha !== captcha) {
      alert(lang === 'es' ? 'CAPTCHA inválido.' : 'Invalid CAPTCHA.');
      return;
    }
    if (!text.trim()) {
      alert(lang === 'es' ? 'Por favor ingresa texto.' : 'Please enter text.');
      return;
    }
    if (text.length > charLimit) {
      alert(lang === 'es' ? `Límite excedido (${charLimit}). Actualiza a Pro.` : `Limit exceeded (${charLimit}). Upgrade to Pro.`);
      return;
    }
    if (!selectedVoice) return;

    if (selectedVoice.isPremium && userTier === 'Free') {
      alert(lang === 'es' ? 'Esta voz requiere una cuenta Pro.' : 'This voice requires a Pro account.');
      setActiveTab(Tab.Pricing);
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    try {
      const audioUrl = await generateSpeech(text, selectedVoice, settings, (p) => setProgress(p));
      const newAudio: GeneratedAudio = {
        id: Date.now().toString(),
        text: text.length > 50 ? text.substring(0, 50) + '...' : text,
        voiceName: selectedVoice.name,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioUrl: audioUrl
      };
      setHistory(prev => [newAudio, ...prev]);
      setActiveTab(Tab.GeneratedAudios);
      refreshCaptcha();
    } catch (error: any) {
      console.error(error);
      alert(lang === 'es' ? 'Error al generar audio. Intenta de nuevo.' : 'Failed to generate audio. Try again.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('yeantts_user', JSON.stringify(userData));
    const userHistory = localStorage.getItem(`yeantts_history_${userData.email}`);
    if (userHistory) setHistory(JSON.parse(userHistory));
    else setHistory([]);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('yeantts_user');
    setHistory([]);
    setUserTier('Free');
    localStorage.setItem('yeantts_tier', 'Free');
  };

  const handleUpgradeSuccess = () => {
    setUserTier(checkoutData.tier);
    localStorage.setItem('yeantts_tier', checkoutData.tier);
    setActiveTab(Tab.VoiceSelection);
    // Nota: Aquí se llamaría a Supabase para actualizar el tier en la DB
  };

  const scrollToSection = (id: string) => {
    setActiveTab(Tab.VoiceSelection);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Banner Superior */}
      <div className="bg-black text-white px-4 py-2 flex items-center justify-center text-[10px] sm:text-xs space-x-4">
        <span className="opacity-80 font-medium">{t.hero.banner}</span>
        <button className="bg-white text-black px-2 py-0.5 rounded font-bold flex items-center gap-1 transition-transform active:scale-95">
          <Download size={10} /> {t.hero.download}
        </button>
      </div>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab(Tab.VoiceSelection); window.scrollTo({ top: 0 }); }}>
            <div className="bg-black p-1.5 rounded-lg shadow-lg">
              <Play className="text-white fill-current" size={18} />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase text-black">YEAN</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
             <button onClick={() => scrollToSection('features')} className="text-sm font-bold text-gray-500 hover:text-black transition-colors">{t.nav.features}</button>
             <button onClick={() => setActiveTab(Tab.Pricing)} className={`text-sm font-bold ${activeTab === Tab.Pricing ? 'text-black' : 'text-gray-500'}`}>{t.nav.pricing}</button>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-100 rounded-full text-[10px] font-black hover:bg-gray-50 uppercase tracking-widest transition-all text-black">
                  <Globe size={14} /> {lang}
                </button>
                <div className="absolute right-0 top-full mt-2 bg-white border rounded-xl shadow-2xl hidden group-hover:block w-32 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <button onClick={() => setLang('es')} className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-gray-50 text-black">Español</button>
                  <button onClick={() => setLang('en')} className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-gray-50 text-black">English</button>
                  <button onClick={() => setLang('pt')} className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-gray-50 text-black">Português</button>
                </div>
             </div>

             {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-3 bg-gray-50 border border-gray-100 pl-2 pr-4 py-1.5 rounded-full hover:bg-gray-100 transition-all">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full text-xs font-black">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-xs font-black hidden sm:block text-black">{user.name}</span>
                    <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 bg-white border rounded-2xl shadow-2xl hidden group-hover:block w-48 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b bg-gray-50/50">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan: {userTier}</p>
                    </div>
                    <button onClick={() => setActiveTab(Tab.GeneratedAudios)} className="w-full px-4 py-3 text-left text-xs font-bold hover:bg-gray-50 flex items-center gap-3 text-black">
                      <Music size={14} /> {t.nav.audios}
                    </button>
                    <button onClick={handleLogout} className="w-full px-4 py-3 text-left text-xs font-bold hover:bg-red-50 text-red-500 flex items-center gap-3">
                      <LogOut size={14} /> {t.nav.logout}
                    </button>
                  </div>
                </div>
             ) : (
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-xs font-black hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
                >
                  <UserIcon size={14} /> {t.nav.login}
                </button>
             )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="max-w-6xl mx-auto w-full px-4 mt-8">
        <div className="flex bg-gray-100 p-1 rounded-2xl shadow-inner border border-gray-200/50">
          <button onClick={() => setActiveTab(Tab.VoiceSelection)} className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all ${activeTab === Tab.VoiceSelection ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.nav.selection}
          </button>
          <button onClick={() => setActiveTab(Tab.GeneratedAudios)} className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all ${activeTab === Tab.GeneratedAudios ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.nav.audios} ({history.length})
          </button>
          <button onClick={() => setActiveTab(Tab.Pricing)} className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all ${activeTab === Tab.Pricing ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.nav.pricing}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto w-full px-4 mt-10 pb-32">
        {activeTab === Tab.Pricing ? (
           <div className="animate-in fade-in slide-in-from-bottom-4 py-8">
             <div className="text-center mb-20">
               <h2 className="text-6xl font-black mb-6 tracking-tighter text-black">Upgrade your Plan</h2>
               <p className="text-gray-500 max-w-lg mx-auto text-xl">{t.pricing.subtitle}</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {PLANS.map((plan) => (
                 <div key={plan.name} className={`relative bg-white border-2 rounded-[40px] p-10 flex flex-col transition-all hover:translate-y-[-8px] ${plan.isPopular ? 'border-black shadow-2xl scale-105 z-10' : 'border-gray-100'}`}>
                   {plan.isPopular && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black uppercase px-8 py-2 rounded-full tracking-widest shadow-xl">Most Popular</div>}
                   <h3 className="text-3xl font-black mb-2 text-black">{plan.name}</h3>
                   <div className="flex items-baseline gap-1 mb-10">
                     <span className="text-6xl font-black tracking-tighter text-black">{t.pricing.plans[plan.name as keyof typeof t.pricing.plans].price}</span>
                     <span className="text-gray-400 text-sm font-bold">/{t.pricing.plans[plan.name as keyof typeof t.pricing.plans].period}</span>
                   </div>
                   <ul className="space-y-5 mb-12 flex-1">
                     {plan.features.map(f => (
                       <li key={f} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                         <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div> {f}
                       </li>
                     ))}
                   </ul>
                   <button 
                    disabled={userTier === plan.name}
                    onClick={() => {
                      if (!user) { setAuthModalOpen(true); return; }
                      setCheckoutData({ open: true, tier: plan.name, price: plan.price });
                    }} 
                    className={`w-full py-6 rounded-3xl font-black text-xl transition-all ${plan.isPopular ? 'bg-black text-white hover:bg-gray-800 shadow-xl' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'} disabled:bg-gray-100 disabled:text-gray-400`}
                   >
                     {userTier === plan.name ? t.pricing.plans[plan.name as keyof typeof t.pricing.plans].button : t.pricing.plans[plan.name as keyof typeof t.pricing.plans].button}
                   </button>
                 </div>
               ))}
             </div>
           </div>
        ) : (
          <>
            <div className="bg-white rounded-[48px] border border-gray-100 p-8 sm:p-12 shadow-2xl shadow-gray-200/40 transition-all hover:shadow-gray-200/60">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
                    <Mic className="text-white" size={20} />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter">AI Synthesis</h2>
                </div>
                <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-5 py-2.5 rounded-full text-[10px] font-black uppercase border border-green-100 tracking-[0.2em]">
                  <ShieldCheck size={16} /> {t.hero.license}
                </div>
              </div>

              <div className="relative group">
                <textarea
                  className="w-full h-64 sm:h-80 p-10 border-2 border-gray-50 rounded-[40px] focus:border-black outline-none resize-none bg-[#fafafa] text-2xl leading-relaxed transition-all focus:bg-white text-black"
                  placeholder={t.hero.inputPlaceholder.replace('{limit}', userTier === 'Free' ? '5,000' : '20,000')}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="absolute bottom-10 right-10 text-sm font-black text-gray-400 bg-white/95 px-5 py-2.5 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm">
                  {text.length.toLocaleString()} / {userTier === 'Free' ? '5,000' : '20,000'}
                </div>
              </div>

              <div className="mt-12 flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex flex-wrap items-center gap-6 bg-gray-50 p-3 rounded-[32px] border-2 border-gray-100 w-full lg:w-auto">
                  <div className="px-10 py-5 rounded-2xl font-mono font-black text-5xl tracking-[0.3em] text-black bg-white border shadow-sm select-none">{captcha}</div>
                  <button onClick={refreshCaptcha} className="p-5 bg-white border rounded-2xl hover:bg-gray-50 transition-all text-black shadow-sm active:scale-90"><RotateCcw size={28} /></button>
                  <input 
                    type="text" 
                    placeholder={t.hero.captcha} 
                    value={userCaptcha} 
                    onChange={(e) => setUserCaptcha(e.target.value)} 
                    className="flex-1 min-w-[160px] px-8 py-6 border-2 border-transparent rounded-2xl text-center font-black text-3xl focus:border-black outline-none bg-white text-black shadow-sm" 
                  />
                </div>
                <button className="w-full lg:w-auto flex-1 flex items-center justify-center gap-4 px-10 py-6 bg-white border text-gray-600 rounded-[32px] hover:bg-gray-50 font-black text-xl transition-all shadow-sm">
                  <MonitorPlay size={28} /> {t.hero.videoTutorials}
                </button>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-8">
                <button disabled={isGenerating} onClick={handleGenerate} className="relative overflow-hidden flex-[3] flex items-center justify-center gap-5 bg-black text-white py-8 rounded-[32px] font-black text-3xl hover:bg-gray-800 transition-all disabled:bg-gray-300 shadow-2xl active:scale-[0.98]">
                  {isGenerating && <div className="absolute left-0 bottom-0 h-2 bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />}
                  {isGenerating ? <Loader2 className="animate-spin" size={36} /> : <Zap size={36} className="fill-current" />}
                  {isGenerating ? t.hero.generating.replace('{progress}', progress.toString()) : t.hero.generate}
                </button>
                <button onClick={() => setIsModalOpen(true)} className="flex-1 px-10 py-8 border rounded-[32px] hover:bg-gray-50 transition-all flex items-center justify-center gap-5 text-2xl font-black text-gray-700 active:scale-[0.98] shadow-sm">
                  <Sliders size={32} /> {t.hero.effects}
                </button>
              </div>
            </div>

            <div className="mt-20">
              {activeTab === Tab.VoiceSelection ? (
                <VoiceSelection onSelect={setSelectedVoice} selectedVoiceId={selectedVoice?.id} userTier={userTier} lang={lang} />
              ) : (
                <GeneratedAudiosList history={history} onDelete={(id) => setHistory(h => h.filter(i => i.id !== id))} onDeleteAll={() => setHistory([])} />
              )}
            </div>
          </>
        )}
      </main>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} lang={lang} onSuccess={handleAuthSuccess} />
      <VoiceEffectsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} settings={settings} onSave={setSettings} onInsertPause={(p) => setText(t => t + ` [pause:${p}]`)} />
      <LegalModal isOpen={legalModal.open} onClose={() => setLegalModal(p => ({ ...p, open: false }))} title={legalModal.title} content={legalModal.content} />
      <CheckoutModal isOpen={checkoutData.open} onClose={() => setCheckoutData(p => ({ ...p, open: false }))} tier={checkoutData.tier} price={checkoutData.price} lang={lang} onSuccess={handleUpgradeSuccess} />

      <footer className="bg-white border-t py-24 px-4 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1">
             <div className="flex items-center gap-2 mb-10"><div className="bg-black p-2 rounded-xl"><Play className="text-white fill-current" size={16} /></div><h1 className="text-3xl font-black tracking-tighter text-black">YEAN</h1></div>
             <p className="text-sm text-gray-400 leading-relaxed font-bold">{t.footer.desc}</p>
          </div>
          <div>
            <h4 className="font-black text-sm mb-10 uppercase tracking-[0.3em] text-gray-900">{t.footer.links}</h4>
            <ul className="space-y-5 text-sm font-black text-gray-400">
              <li onClick={() => scrollToSection('features')} className="hover:text-black cursor-pointer transition-colors">{t.nav.features}</li>
              <li onClick={() => setActiveTab(Tab.Pricing)} className="hover:text-black cursor-pointer transition-colors">{t.nav.pricing}</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
