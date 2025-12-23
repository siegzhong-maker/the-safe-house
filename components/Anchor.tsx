
import React, { useState, useEffect } from 'react';
import { START_DATE } from '../constants';
import { RelationshipDuration } from '../types';

const Anchor: React.FC = () => {
  const [duration, setDuration] = useState<RelationshipDuration>({
    years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - START_DATE.getTime();
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const years = Math.floor(days / 365.25);

      setDuration({
        years,
        // 这里改为显示总天数，不再取模 365，这样 2024-09-07 到现在会显示 470+ 天
        days: days, 
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
        totalSeconds: seconds
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="grid grid-cols-4 gap-4 w-full px-4">
        <TimeUnit value={duration.days} label="DAYS" />
        <TimeUnit value={duration.hours} label="HRS" />
        <TimeUnit value={duration.minutes} label="MINS" />
        <TimeUnit value={duration.seconds} label="SECS" />
      </div>

      <div className="pt-4 space-y-4">
        <p className="text-sm text-slate-400 font-light tracking-wide px-8 leading-relaxed">
          “无论世界怎么变，这个数字一直在增加。我就在这里，稳稳的。”
        </p>
        <div className="h-px w-12 bg-amber-200/20 mx-auto" />
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 shadow-inner">
    <span className="text-2xl font-mono font-medium text-amber-200 tabular-nums">
      {/* 移除 padStart(2, '0') 因为天数可能会变成 3 位或更多位 */}
      {value}
    </span>
    <span className="text-[10px] text-slate-500 tracking-tighter mt-1">{label}</span>
  </div>
);

export default Anchor;
