import React, { useState, useEffect } from 'react';

export default function VoiceBriefingBar({ textSummary, soundEnabled }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSpeech, setHasSpeech] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSpeech(true);
    }
  }, []);

  const handleToggleVoice = () => {
    if (!hasSpeech) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // Stop any pending
      const utterance = new SpeechSynthesisUtterance(textSummary);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      // Pick a clean english voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Siri'))
      );
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="voice-briefing-bar">
      <div className="voice-left">
        <div className={`voice-avatar ${isPlaying ? 'speaking' : ''}`}>
          <i className="fa-solid fa-headset"></i>
          {isPlaying && (
            <div className="soundwave">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
        <div className="voice-copy">
          <div className="voice-label">
            <span className="ai-tag">AI Voice Concierge</span>
            <span>Audio Away Summary</span>
          </div>
          <p className="voice-text">"{textSummary}"</p>
        </div>
      </div>
      <div className="voice-right">
        <button
          className={`btn-voice ${isPlaying ? 'active' : ''}`}
          onClick={handleToggleVoice}
          title={isPlaying ? 'Pause Voice Briefing' : 'Play AI Voice Briefing'}
        >
          <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          <span>{isPlaying ? 'Pause Briefing' : 'Play Voice Summary'}</span>
        </button>
      </div>
    </div>
  );
}
