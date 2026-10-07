import React, { useEffect, useState } from 'react';
import { useApp } from '../../store/AppContext';
import { PhoneOff, Mic, MicOff, Volume2, ShieldCheck, User } from 'lucide-react';

export const CallModal: React.FC = () => {
  const { activeCallingPartner, endCall } = useApp();
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    if (!activeCallingPartner) {
      setSeconds(0);
      return;
    }
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeCallingPartner]);

  if (!activeCallingPartner) return null;

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        id="call-modal-card"
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
      >
        {/* Calling Header */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          QuickGo Secure In-App Call
        </div>

        {/* Partner Avatar with animated wave rings */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full bg-[#FF6B35]/15 animate-ping opacity-75" />
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#FF6B35] shadow-md">
            <img
              src={activeCallingPartner.avatar}
              alt={activeCallingPartner.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-neutral-900 mt-2">{activeCallingPartner.name}</h3>
        <p className="text-xs text-neutral-500 font-medium">{activeCallingPartner.vehicle}</p>

        {/* Timer */}
        <div className="text-2xl font-mono font-bold text-[#FF6B35] my-4 tracking-wider">
          {formatTime(seconds)}
        </div>

        {/* Audio waveforms simulated */}
        <div className="flex items-center gap-1.5 h-6 mb-6">
          {[40, 70, 90, 60, 100, 45, 80, 55, 30].map((height, i) => (
            <div
              key={i}
              className="w-1 bg-[#FF6B35] rounded-full transition-all duration-300 animate-pulse"
              style={{
                height: `${Math.max(20, (height * (seconds % 3 + 1)) / 3)}%`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-1 text-[11px] text-neutral-400 mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
          Number masked for customer privacy
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 w-full">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-all ${
              isMuted
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-200'
            }`}
            title="Mute microphone"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            id="btn-end-call"
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 transition-transform active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-3.5 rounded-full border transition-all ${
              isSpeaker
                ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-200'
            }`}
            title="Toggle Speaker"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
