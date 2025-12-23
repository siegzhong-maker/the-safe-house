
import React, { useState } from 'react';
import ChristmasTree from './ChristmasTree';

const SignalButton: React.FC = () => {
  const [showTree, setShowTree] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSignal = () => {
    setIsTransitioning(true);
    // 添加一个短暂的延迟，让按钮的点击动画完成
    setTimeout(() => {
      setShowTree(true);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <>
      <div className={`fixed bottom-10 left-0 right-0 px-6 z-40 flex justify-center transition-opacity duration-500 ${showTree ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={handleSignal}
          disabled={isTransitioning}
          className="group relative w-full max-w-xs overflow-hidden rounded-2xl p-[1px] shadow-[0_10px_40px_-10px_rgba(245,158,11,0.5)] transition-all active:scale-95 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 animate-shimmer" />
          <div className="relative flex items-center justify-center bg-slate-950 py-4 px-8 rounded-[15px] transition-colors group-hover:bg-slate-900">
             <span className="text-white font-medium tracking-[0.2em] text-sm">
                点亮圣诞
             </span>
          </div>
        </button>
      </div>

      {showTree && <ChristmasTree onClose={() => setShowTree(false)} />}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
      `}</style>
    </>
  );
};

export default SignalButton;
