'use client'

const useAudioAlert = (): { playEmergencyAlert: () => void } => {
  const playEmergencyAlert = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      console.log('Audio not supported');
    }
  };

  return { playEmergencyAlert };
};

export default useAudioAlert;
