
import { GoogleGenAI, Modality } from "@google/genai";
import { Voice, VoiceSettings } from "../types";

/**
 * Decodes base64 string to Uint8Array.
 */
function decodeBase64(base64: string): Uint8Array {
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error("Error decoding base64 audio:", e);
    throw new Error("Invalid audio data format");
  }
}

/**
 * Wraps raw PCM data (16-bit Mono @ 24kHz) into a WAV container.
 */
function pcmToWav(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  new Uint8Array(buffer, 44).set(pcmData);

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Splits text into chunks of roughly equal size, respecting word boundaries.
 * TTS models perform better and faster with shorter chunks (~500-1000 chars).
 */
function chunkText(text: string, maxChunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  let currentPos = 0;

  while (currentPos < text.length) {
    let endPos = currentPos + maxChunkSize;
    if (endPos >= text.length) {
      chunks.push(text.substring(currentPos));
      break;
    }

    // Find the last space within the chunk to avoid cutting words
    const lastSpace = text.lastIndexOf(' ', endPos);
    if (lastSpace > currentPos) {
      endPos = lastSpace;
    }

    chunks.push(text.substring(currentPos, endPos).trim());
    currentPos = endPos + 1;
  }

  return chunks.filter(c => c.length > 0);
}

/**
 * High-performance speech generation using parallel chunking.
 */
export async function generateSpeech(
  text: string, 
  voice: Voice, 
  settings: VoiceSettings,
  onProgress?: (progress: number) => void
): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });
  const internalVoice = voice.id.replace('gemini-', '').split('-')[0];
  const speed = settings.speed === 0 ? 'normal' : settings.speed > 0 ? 'fast' : 'slow';
  const pitch = settings.pitch === 0 ? 'natural' : settings.pitch > 0 ? 'high' : 'low';

  // 1. Chunk text for faster processing
  const chunks = chunkText(text, 800);
  const totalChunks = chunks.length;
  let completedChunks = 0;

  // 2. Process chunks in parallel (limit concurrency to avoid API rate limits if necessary)
  // Here we use Promise.all for maximum speed for the user.
  const audioParts = await Promise.all(chunks.map(async (chunk) => {
    const instruction = voice.language === 'Spanish' 
      ? `TTS ESPAÑOL, VELOCIDAD:${speed}, TONO:${pitch}. TEXTO: ${chunk}`
      : `TTS ${voice.language.toUpperCase()}, SPEED:${speed}, PITCH:${pitch}. TEXT: ${chunk}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: instruction }] }],
        config: {
          // Fix: Use Modality.AUDIO instead of string literal
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: internalVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("Missing audio data");

      completedChunks++;
      if (onProgress) onProgress(Math.floor((completedChunks / totalChunks) * 100));

      return decodeBase64(base64Audio);
    } catch (error: any) {
      console.error(`Chunk generation failed:`, error);
      throw new Error(`Failed to generate part of the audio: ${error.message}`);
    }
  }));

  // 3. Merge PCM parts
  const totalLength = audioParts.reduce((acc, part) => acc + part.length, 0);
  const mergedPcm = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of audioParts) {
    mergedPcm.set(part, offset);
    offset += part.length;
  }

  // 4. Return as WAV URL
  const wavBlob = pcmToWav(mergedPcm, 24000);
  return URL.createObjectURL(wavBlob);
}
