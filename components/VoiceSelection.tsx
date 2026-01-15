
import React, { useState, useMemo } from 'react';
import { Search, Play, ChevronDown, CheckCircle2, Loader2, Globe, Crown } from 'lucide-react';
import { Voice, VoiceSettings, UserTier } from '../types';
import { generateSpeech } from '../services/geminiTTS';
import { Language } from '../translations';

interface VoiceSelectionProps {
  onSelect: (voice: Voice) => void;
  selectedVoiceId?: string;
  userTier?: UserTier;
  lang: Language;
}

const GEMINI_VOICES: Voice[] = [
  { id: 'gemini-Kore', name: 'Kore (Multilingual)', gender: 'Female', language: 'Multilingual', country: 'Global', isPremium: true },
  { id: 'gemini-Puck', name: 'Puck (Multilingual)', gender: 'Male', language: 'Multilingual', country: 'Global', isPremium: true },
  { id: 'gemini-Charon', name: 'Charon (Natural)', gender: 'Male', language: 'English', country: 'USA' },
  { id: 'gemini-Fenrir', name: 'Fenrir (Deep)', gender: 'Male', language: 'English', country: 'UK' },
  { id: 'gemini-Zephyr', name: 'Zephyr (Bright)', gender: 'Female', language: 'English', country: 'Canada' },
  { id: 'gemini-Kore-ES', name: 'Kore (Español)', gender: 'Female', language: 'Spanish', country: 'Spain', isPremium: true },
  { id: 'gemini-Puck-MX', name: 'Puck (Latino)', gender: 'Male', language: 'Spanish', country: 'Mexico', isPremium: true },
  { id: 'gemini-Zephyr-AR', name: 'Zephyr (Argentina)', gender: 'Female', language: 'Spanish', country: 'Argentina' },
  { id: 'gemini-Charon-CO', name: 'Charon (Colombia)', gender: 'Male', language: 'Spanish', country: 'Colombia' },
  { id: 'gemini-Kore-FR', name: 'Kore (Français)', gender: 'Female', language: 'French', country: 'France', isPremium: true },
  { id: 'gemini-Puck-DE', name: 'Puck (Deutsch)', gender: 'Male', language: 'German', country: 'Germany' },
  { id: 'gemini-Zephyr-JP', name: 'Zephyr (Japanese)', gender: 'Female', language: 'Japanese', country: 'Japan', isPremium: true },
  { id: 'gemini-Fenrir-IT', name: 'Fenrir (Italiano)', gender: 'Male', language: 'Italian', country: 'Italy' },
  { id: 'gemini-Charon-PT', name: 'Charon (Português)', gender: 'Male', language: 'Portuguese', country: 'Brazil' },
  { id: 'gemini-Zephyr-PT', name: 'Zephyr (Portugal)', gender: 'Female', language: 'Portuguese', country: 'Portugal', isPremium: true },
  { id: 'gemini-Puck-PT', name: 'Puck (Brasil)', gender: 'Male', language: 'Portuguese', country: 'Brazil', isPremium: true },
];

const VoiceSelection: React.FC<VoiceSelectionProps> = ({ onSelect, selectedVoiceId, userTier = 'Free', lang }) => {
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('All');
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const languages = useMemo(() => ['All', ...Array.from(new Set(GEMINI_VOICES.map(v => v.language)))], []);

  const filteredVoices = useMemo(() => GEMINI_VOICES.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(search.toLowerCase());
    const matchesLang = langFilter === 'All' || voice.language === langFilter;
    return matchesSearch && matchesLang;
  }), [search, langFilter]);

  const handlePreview = async (e: React.MouseEvent, voice: Voice) => {
    e.stopPropagation();
    if (previewingId) return;
    setPreviewingId(voice.id);
    try {
      const previewText = lang === 'es' ? `Hola, soy ${voice.name}.` : lang === 'pt' ? `Olá, eu sou ${voice.name}.` : `Hi, I'm ${voice.name}.`;
      const audioUrl = await generateSpeech(previewText, voice, { pitch: 0, speed: 0, volume: 100, rememberSettings: false });
      const audio = new Audio(audioUrl);
      audio.onended = () => setPreviewingId(null);
      await audio.play();
    } catch { setPreviewingId(null); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
        <div className="flex items-center gap-3">
          <Globe className="text-black" size={28} />
          <h2 className="text-3xl font-black tracking-tight text-black">{lang === 'es' ? 'Selección de Voz' : lang === 'pt' ? 'Seleção de Voz' : 'Voice Selection'}</h2>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={lang === 'es' ? 'Buscar voces...' : lang === 'pt' ? 'Pesquisar vozes...' : 'Search voices...'} 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-100 rounded-2xl font-medium focus:border-black outline-none shadow-sm text-black bg-white" 
            />
          </div>
          <div className="relative flex-1 md:w-56">
            <select 
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="w-full pl-5 pr-10 py-3.5 border-2 border-gray-100 rounded-2xl text-base font-bold appearance-none bg-white focus:border-black outline-none transition-all shadow-sm text-black"
            >
              {languages.map(l => <option key={l} value={l} className="text-black">{l === 'All' ? (lang === 'es' ? 'Todos' : lang === 'pt' ? 'Todos' : 'All') : l}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1">
        {filteredVoices.map((voice) => (
          <div key={voice.id} onClick={() => onSelect(voice)} className={`group relative p-6 border-2 rounded-3xl cursor-pointer transition-all hover:scale-[1.02] bg-white ${selectedVoiceId === voice.id ? 'border-black shadow-xl ring-2 ring-black/5' : 'border-gray-50'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-1">
                <h3 className="font-black text-xl text-gray-900 leading-tight">{voice.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-gray-100 text-[10px] font-black uppercase text-gray-600 rounded-lg">{voice.gender}</span>
                  <span className="px-3 py-1 bg-black/5 text-[10px] font-black uppercase text-black rounded-lg">{voice.language}</span>
                  {voice.isPremium && <span className="px-3 py-1 bg-yellow-400 text-[10px] font-black uppercase text-black rounded-lg flex items-center gap-1"><Crown size={10}/> Premium</span>}
                </div>
              </div>
              <button onClick={(e) => handlePreview(e, voice)} className="p-3.5 rounded-2xl bg-white border hover:bg-black hover:text-white transition-all text-black group-hover:text-inherit">
                {previewingId === voice.id ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} className="fill-current" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceSelection;
