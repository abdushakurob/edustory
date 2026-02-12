"use client";

import { useState, useRef } from "react";
import { Volume2, Pause, Square, Loader, ChevronDown } from "lucide-react";

const VOICES = [
  { name: "Idera", desc: "Melodic, gentle", gender: "Female" },
  { name: "Emma", desc: "Authoritative, deep", gender: "Female" },
  { name: "Zainab", desc: "Soothing, gentle", gender: "Female" },
  { name: "Wura", desc: "Young, sweet", gender: "Female" },
  { name: "Chinenye", desc: "Engaging, warm", gender: "Female" },
  { name: "Regina", desc: "Mature, warm", gender: "Female" },
  { name: "Adaora", desc: "Warm, engaging", gender: "Female" },
  { name: "Mary", desc: "Energetic, youthful", gender: "Female" },
  { name: "Remi", desc: "Melodious, warm", gender: "Female" },
  { name: "Osagie", desc: "Smooth, calm", gender: "Male" },
  { name: "Jude", desc: "Warm, confident", gender: "Male" },
  { name: "Tayo", desc: "Upbeat, energetic", gender: "Male" },
  { name: "Femi", desc: "Rich, reassuring", gender: "Male" },
  { name: "Umar", desc: "Calm, smooth", gender: "Male" },
  { name: "Nonso", desc: "Bold, resonant", gender: "Male" },
  { name: "Adam", desc: "Deep, clear", gender: "Male" },
];

interface StoryReaderProps {
  narrative: string;
  title?: string;
}

export function StoryReader({ narrative }: StoryReaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("Idera");
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const cleanNarrative = (text: string) => {
    // Strip markdown formatting for TTS
    return text
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/>\s/g, "")
      .replace(/[-*+]\s/g, "")
      .replace(/\d+\.\s/g, "")
      .trim();
  };

  const handlePlay = async () => {
    setError(null);

    // If already loaded and paused, just resume
    if (audioRef.current && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanNarrative(narrative),
          voice: selectedVoice,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate audio");
      }

      const audioBlob = await response.blob();

      // Clean up previous audio
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setError("Audio playback failed");
        setIsPlaying(false);
      };

      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate audio");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleVoiceChange = (voice: string) => {
    setSelectedVoice(voice);
    setShowVoicePicker(false);
    // Reset audio when voice changes so it regenerates
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setIsPlaying(false);
  };

  const currentVoice = VOICES.find((v) => v.name === selectedVoice);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Voice Picker */}
      <div className="relative">
        <button
          onClick={() => setShowVoicePicker(!showVoicePicker)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/60 border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-white/80 transition-colors"
        >
          <span className="text-xs text-neutral-400">🎙️</span>
          <span className="font-medium">{selectedVoice}</span>
          <ChevronDown size={14} className="text-neutral-400" />
        </button>

        {showVoicePicker && (
          <div className="absolute top-full left-0 mt-1 w-64 max-h-72 overflow-y-auto bg-white rounded-xl border border-neutral-200 shadow-xl z-50">
            <div className="p-2">
              <p className="text-xs text-neutral-400 font-medium px-2 py-1 uppercase tracking-wider">
                Female Voices
              </p>
              {VOICES.filter((v) => v.gender === "Female").map((voice) => (
                <button
                  key={voice.name}
                  onClick={() => handleVoiceChange(voice.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedVoice === voice.name
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                >
                  <span className="font-medium">{voice.name}</span>
                  <span className="text-neutral-400 ml-1.5">
                    — {voice.desc}
                  </span>
                </button>
              ))}

              <p className="text-xs text-neutral-400 font-medium px-2 py-1 mt-2 uppercase tracking-wider">
                Male Voices
              </p>
              {VOICES.filter((v) => v.gender === "Male").map((voice) => (
                <button
                  key={voice.name}
                  onClick={() => handleVoiceChange(voice.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedVoice === voice.name
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                >
                  <span className="font-medium">{voice.name}</span>
                  <span className="text-neutral-400 ml-1.5">
                    — {voice.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Play/Pause Button */}
      {isLoading ? (
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm opacity-80"
        >
          <Loader size={16} className="animate-spin" />
          Generating...
        </button>
      ) : isPlaying ? (
        <div className="flex items-center gap-1">
          <button
            onClick={handlePause}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
          >
            <Pause size={16} />
            Pause
          </button>
          <button
            onClick={handleStop}
            className="inline-flex items-center p-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-600 rounded-lg transition-colors"
            title="Stop"
          >
            <Square size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={handlePlay}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
        >
          <Volume2 size={16} />
          Listen
        </button>
      )}

      {/* Error */}
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
