
import React, { useState } from 'react';
import { Download, Play, Music, Trash2, Pause } from 'lucide-react';
import { GeneratedAudio } from '../types';

interface GeneratedAudiosListProps {
  history: GeneratedAudio[];
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

const GeneratedAudiosList: React.FC<GeneratedAudiosListProps> = ({ history, onDelete, onDeleteAll }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const handlePlay = (audio: GeneratedAudio) => {
    if (playingId === audio.id) {
      audioInstance?.pause();
      setPlayingId(null);
      return;
    }

    if (audioInstance) {
      audioInstance.pause();
    }

    const newAudio = new Audio(audio.audioUrl);
    newAudio.onended = () => setPlayingId(null);
    newAudio.play();
    setAudioInstance(newAudio);
    setPlayingId(audio.id);
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-20 bg-white border rounded-2xl shadow-sm">
        <div className="flex justify-center mb-4 text-gray-100">
          <Music size={80} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">No Audios Generated Yet</h3>
        <p className="text-gray-500 mt-2 max-w-xs mx-auto">Generate high-quality AI speech and it will appear here for you to download and manage.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-bold">Generated Audios</h2>
        <button 
          onClick={onDeleteAll}
          className="p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded-xl shadow-sm" 
          title="Delete All Audios"
        >
          <Trash2 size={22}/>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-10">
        {history.map((audio) => (
          <div key={audio.id} className="bg-white border-2 border-gray-50 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-5 flex-1 overflow-hidden">
              <button 
                onClick={() => handlePlay(audio)}
                className="bg-black p-4 rounded-xl text-white hover:bg-gray-800 transition-colors shadow-lg active:scale-95 shrink-0"
              >
                {playingId === audio.id ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
              </button>
              <div className="overflow-hidden">
                <h4 className="font-bold text-lg text-gray-800 truncate" title={audio.text}>{audio.text}</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-1 font-medium">
                  <span className="text-black uppercase tracking-wider">{audio.voiceName}</span>
                  <span className="hidden sm:inline opacity-50">•</span>
                  <span>{audio.date}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href={audio.audioUrl} 
                download={`speechma-${audio.id}.wav`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all font-bold text-sm border-2 border-transparent hover:border-gray-200"
              >
                <Download size={18} /> Download
              </a>
              <button 
                onClick={() => onDelete(audio.id)}
                className="p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors rounded-xl border-2 border-transparent hover:border-red-100"
                title="Delete Audio"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedAudiosList;
