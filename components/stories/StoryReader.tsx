"use client";

import { useState, useEffect } from "react";
import { Volume2, Pause } from "lucide-react";
import { speakText, stopSpeech } from "@/lib/text-to-speech/tts";

interface StoryReaderProps {
  narrative: string;
  title?: string;
}

export function StoryReader({ narrative, title }: StoryReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      speakText(narrative);
      setIsPlaying(true);
    }
  };

  // Only render on client side
  if (!isMounted) {
    return null;
  }

  // Check if browser supports Web Speech API
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  return (
    <button
      onClick={toggleAudio}
      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
      title={isPlaying ? "Pause reading" : "Read story aloud"}
    >
      {isPlaying ? (
        <>
          <Pause size={16} />
          Pause
        </>
      ) : (
        <>
          <Volume2 size={16} />
          Read Aloud
        </>
      )}
    </button>
  );
}
