
import React from 'react';
import { HEART_MESSAGE } from '../constants';

const Evidence: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 md:p-12">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 blur-3xl rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full -ml-20 -mb-20" />

      {/* Heartfelt Message Box */}
      <div className="relative z-10">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400 blur-xl opacity-20 animate-pulse" />
            <svg className="relative w-8 h-8 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-8">
          {HEART_MESSAGE.split('\n\n').map((paragraph, idx) => (
            <p 
              key={idx} 
              className="text-slate-200 font-serif leading-[2.1] text-[15px] tracking-widest text-justify indent-8 opacity-95 drop-shadow-sm"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-end">
          <p className="text-amber-500/70 font-serif italic text-sm tracking-widest">
            —— 你的避风港
          </p>
          <p className="text-[10px] text-slate-600 mt-2 tracking-[0.3em] uppercase">
            Merry Christmas & Always Here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Evidence;
