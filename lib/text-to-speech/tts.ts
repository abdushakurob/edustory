// Text-to-Speech utility using Web Speech API
export function speakText(
  text: string,
  options?: { rate?: number; pitch?: number },
): void {
  // Check if browser supports Web Speech API
  const synth = window.speechSynthesis;
  if (!synth) {
    console.error("Speech Synthesis not supported");
    return;
  }

  // Cancel any ongoing speech
  synth.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Set voice properties for natural speech
  utterance.rate = options?.rate || 1; // Speed: 0.5 - 2
  utterance.pitch = options?.pitch || 1; // Pitch: 0 - 2
  utterance.volume = 1;

  // Use English language with natural accent
  const voices = synth.getVoices();
  const englishVoice =
    voices.find(
      (voice) => voice.lang.startsWith("en-") && voice.name.includes("Natural"),
    ) || voices.find((voice) => voice.lang.startsWith("en-"));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  // Speak
  synth.speak(utterance);
}

export function stopSpeech(): void {
  const synth = window.speechSynthesis;
  if (synth) {
    synth.cancel();
  }
}

export function isSpeaking(): boolean {
  const synth = window.speechSynthesis;
  return synth ? synth.speaking : false;
}
