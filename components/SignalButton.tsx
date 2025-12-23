
import React, { useState } from 'react';
import { SIGNAL_MESSAGES } from '../constants';

const SignalButton: React.FC = () => {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handleSignal = () => {
    const randomMsg = SIGNAL_MESSAGES[Math.floor(Math.random() * SIGNAL_MESSAGES.length)];
    setActiveMessage(randomMsg);
  };

  return (
    <>
      <div className="fixed bottom-10 left-0 right-0 px-6 z-40 flex justify-center">
        <button
          onClick={handleSignal}
          className="group relative w-full max-w-xs overflow-hidden rounded-2xl p-[1px] shadow-[0_10px_40px_-10px_rgba(245,158,11,0.5)] transition-all active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 animate-shimmer" />
          <div className="relative flex items-center justify-center bg-slate-950 py-4 px-8 rounded-[15px] transition-colors group-hover:bg-slate-900">
             <span className="text-white font-medium tracking-[0.2em] text-sm">
                心情不好 / 需要抱抱
             </span>
          </div>
        </button>
      </div>

      {activeMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="relative bg-slate-900 border border-amber-500/30 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(245,158,11,0.15)] text-center space-y-10 max-w-sm w-full overflow-hidden">
            {/* Decoration Glow */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/10 blur-3xl" />
            
            <div className="relative">
              <span className="text-5xl inline-block animate-bounce-slow">🫂</span>
            </div>
            
            <p className="relative text-amber-50 font-serif text-lg md:text-xl leading-relaxed tracking-wide px-2">
              {activeMessage}
            </p>
            
            <button
              onClick={() => setActiveMessage(null)}
              className="relative w-full py-4 bg-slate-800/50 text-amber-200 rounded-2xl text-xs uppercase tracking-[0.3em] border border-slate-700/50 hover:bg-slate-800 hover:border-amber-500/40 transition-all duration-300"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default SignalButton;
