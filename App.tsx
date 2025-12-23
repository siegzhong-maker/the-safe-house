
import React, { useState, useRef, useEffect } from 'react';
import Anchor from './components/Anchor';
import Evidence from './components/Evidence';
import SignalButton from './components/SignalButton';
import SnowField from './components/SnowField';

const App: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false); // 默认不静音，允许播放
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 创建音频对象
    const audio = new Audio('/the-safe-house/M500004QArdZ2RgR0C.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    // 尝试自动播放（先静音播放以绕过浏览器限制，然后立即取消静音）
    audio.muted = true;
    const playPromise = audio.play().then(() => {
      // 播放成功后立即取消静音
      audio.muted = false;
    }).catch((error) => {
      // 如果自动播放被阻止，取消静音状态，用户可以通过按钮手动播放
      audio.muted = false;
      console.log('Auto-play prevented:', error);
    });

    // 清理函数
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 监听 isMuted 状态变化，控制音频播放/暂停
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.pause();
    } else {
      // 确保取消静音状态
      audioRef.current.muted = false;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Play failed:', error);
        });
      }
    }
  }, [isMuted]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden flex flex-col items-center">
      {/* 全局底层背景渐变 */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 z-0" />

      {/* 雪花层 - 置于背景之上，内容之下/之间 */}
      <SnowField />

      {/* Audio Control */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 rounded-full bg-slate-900/40 backdrop-blur-md border border-slate-800/50 text-amber-200/70 hover:text-amber-200 transition-colors"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeDasharray="5 5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-md px-6 py-12 flex flex-col items-center space-y-16 pb-40">
        
        {/* Header / Intro */}
        <header className="text-center space-y-3 animate-fade-in">
          <div className="flex justify-center space-x-2 mb-2 opacity-80">
             <span className="text-xl">🎄</span>
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-[0.25em] text-amber-50/90">
            THE SAFE HOUSE
          </h1>
          <p className="text-slate-400 text-xs tracking-[0.4em] uppercase opacity-60">
            一份永不落幕的陪伴
          </p>
        </header>

        {/* Module 1: The Anchor */}
        <section className="w-full animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Anchor />
        </section>

        {/* Module 2: The Letter */}
        <section className="w-full relative animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="text-center mb-8 relative">
            <h2 className="text-xl font-serif tracking-[0.3em] text-amber-100/90">我想对你说</h2>
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mx-auto mt-3" />
            <span className="absolute -top-4 -right-2 text-2xl opacity-20 rotate-12">❄️</span>
          </div>
          <Evidence />
        </section>

        <div className="h-10" />
      </main>

      {/* Module 3: The Signal */}
      <SignalButton />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default App;
