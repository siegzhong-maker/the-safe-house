
import React, { useState, useEffect } from 'react';
import { SOUL_TRAITS } from '../constants';

interface SnowFlake {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  isSpecial: boolean;
  traitIndex?: number;
}

const SnowField: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<SnowFlake[]>([]);
  const [activeTrait, setActiveTrait] = useState<string | null>(null);

  useEffect(() => {
    const flakes = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * -20,
      isSpecial: Math.random() > 0.75,
      traitIndex: Math.floor(Math.random() * SOUL_TRAITS.length)
    }));
    setSnowflakes(flakes);
  }, []);

  const handleTraitClick = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setActiveTrait(text);
    setTimeout(() => setActiveTrait(null), 4000);
  };

  return (
    // 容器保持透明，z-20 确保雪花在内容上方可点，但 pointer-events-none 允许点击穿透到不带 pointer-events-auto 的区域
    <div className="fixed inset-0 z-20 overflow-hidden pointer-events-none">
      {/* 移除了之前的 -z-10 bg-gradient 盒子，因为它会遮挡 App.tsx 中的内容 */}
      
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute pointer-events-auto cursor-pointer flex items-center justify-center"
          style={{
            top: '-10%',
            left: `${flake.x}%`,
            width: flake.isSpecial ? '44px' : `${flake.size}px`,
            height: flake.isSpecial ? '44px' : `${flake.size}px`,
            animation: `fall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
          onClick={(e) => flake.isSpecial && flake.traitIndex !== undefined && handleTraitClick(e, SOUL_TRAITS[flake.traitIndex])}
        >
          <div 
            className={`rounded-full bg-white transition-shadow ${
              flake.isSpecial 
                ? 'shadow-[0_0_12px_4px_rgba(255,255,255,0.6)] opacity-90 scale-125' 
                : 'opacity-30'
            }`}
            style={{
              width: `${flake.size}px`,
              height: `${flake.size}px`,
            }}
          />
        </div>
      ))}

      {/* Trait Toast */}
      {activeTrait && (
        <div className="fixed top-1/4 left-0 right-0 z-[100] flex justify-center px-8 pointer-events-none">
          <div className="bg-amber-900/80 backdrop-blur-3xl border border-amber-200/30 px-8 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float-up max-w-xs text-center">
            <p className="text-amber-100 text-base font-serif italic tracking-wider leading-relaxed">
              ✨ {activeTrait}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) translateX(0) rotate(0); }
          25% { transform: translateY(25vh) translateX(20px) rotate(90deg); }
          50% { transform: translateY(50vh) translateX(-20px) rotate(180deg); }
          75% { transform: translateY(75vh) translateX(20px) rotate(270deg); }
          100% { transform: translateY(110vh) translateX(0) rotate(360deg); }
        }
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          15% { opacity: 1; transform: translateY(0) scale(1); }
          85% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-20px) scale(0.95); }
        }
        .animate-float-up {
          animation: floatUp 4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default SnowField;
