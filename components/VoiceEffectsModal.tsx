
import React, { useState } from 'react';
import { X, Sliders, RotateCcw } from 'lucide-react';
import { VoiceSettings } from '../types';

interface VoiceEffectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onSave: (settings: VoiceSettings) => void;
  onInsertPause: (type: 'short' | 'medium' | 'long') => void;
}

const VoiceEffectsModal: React.FC<VoiceEffectsModalProps> = ({ isOpen, onClose, settings, onSave, onInsertPause }) => {
  const [localSettings, setLocalSettings] = useState<VoiceSettings>(settings);

  if (!isOpen) return null;

  const resetToDefault = () => {
    setLocalSettings({
      pitch: 0,
      speed: 0,
      volume: 100,
      rememberSettings: false
    });
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <Sliders size={20} />
            <h2>Voice Effects</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Pauses Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Insert Pauses</label>
            <div className="flex gap-2">
              <button 
                onClick={() => onInsertPause('short')}
                className="flex-1 py-2 border rounded-md hover:bg-gray-50 flex items-center justify-center gap-1 text-sm font-medium"
              >
                <span className="w-1.5 h-3 bg-gray-300 rounded-sm"></span> Short
              </button>
              <button 
                onClick={() => onInsertPause('medium')}
                className="flex-1 py-2 border rounded-md hover:bg-gray-50 flex items-center justify-center gap-1 text-sm font-medium"
              >
                <span className="w-1.5 h-3 bg-gray-500 rounded-sm"></span> Medium
              </button>
              <button 
                onClick={() => onInsertPause('long')}
                className="flex-1 py-2 border rounded-md hover:bg-gray-50 flex items-center justify-center gap-1 text-sm font-medium"
              >
                <span className="w-1.5 h-3 bg-black rounded-sm"></span> Long
              </button>
            </div>
          </div>

          {/* Sliders Section */}
          <div className="space-y-6">
            {/* Pitch */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <label>Pitch</label>
                <span className="text-xs text-gray-500">{localSettings.pitch}</span>
              </div>
              <input 
                type="range" min="-20" max="20" 
                value={localSettings.pitch}
                onChange={(e) => setLocalSettings({...localSettings, pitch: parseInt(e.target.value)})}
                className="w-full accent-black h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
              />
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <label>Speed</label>
                <span className="text-xs text-gray-500">{localSettings.speed}</span>
              </div>
              <input 
                type="range" min="-10" max="10" 
                value={localSettings.speed}
                onChange={(e) => setLocalSettings({...localSettings, speed: parseInt(e.target.value)})}
                className="w-full accent-black h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
              />
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <label>Volume</label>
                <span className="text-xs text-gray-500">{localSettings.volume}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={localSettings.volume}
                onChange={(e) => setLocalSettings({...localSettings, volume: parseInt(e.target.value)})}
                className="w-full accent-black h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4">
            <button 
              onClick={resetToDefault}
              className="text-sm flex items-center gap-1 text-gray-500 hover:text-black transition-colors"
            >
              <RotateCcw size={14} /> Default
            </button>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" id="remember" 
                checked={localSettings.rememberSettings}
                onChange={(e) => setLocalSettings({...localSettings, rememberSettings: e.target.checked})}
                className="rounded border-gray-300 text-black focus:ring-black" 
              />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember settings</label>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-md"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceEffectsModal;
