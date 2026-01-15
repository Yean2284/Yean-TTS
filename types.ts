
export interface Voice {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  language: string;
  country: string;
  previewUrl?: string;
  isPremium?: boolean;
}

export interface VoiceSettings {
  pitch: number;
  speed: number;
  volume: number;
  rememberSettings: boolean;
}

export interface GeneratedAudio {
  id: string;
  text: string;
  voiceName: string;
  date: string;
  audioUrl: string;
}

export enum Tab {
  VoiceSelection = 'VoiceSelection',
  GeneratedAudios = 'GeneratedAudios',
  Pricing = 'Pricing'
}

export type UserTier = 'Free' | 'Pro' | 'Business';

export interface Plan {
  name: UserTier;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}
