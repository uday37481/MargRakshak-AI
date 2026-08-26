/**
 * Wrapper for Web Speech API to play voice alerts
 */
let isMuted = false;

export const voiceAlert = {
  speak: (text) => {
    if (isMuted) return;
    if (!('speechSynthesis' in window)) {
      console.warn("Web Speech API not supported in this browser.");
      return;
    }

    // Cancel currently active speech to avoid queuing delays
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Use default system voice
    window.speechSynthesis.speak(utterance);
  },
  
  cancel: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  setMute: (mute) => {
    isMuted = mute;
    if (mute) {
      voiceAlert.cancel();
    }
  },

  isMuted: () => isMuted
};
