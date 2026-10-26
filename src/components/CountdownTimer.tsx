import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'webkilat_countdown_target_v1';
const DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  }>({ hours: 5, minutes: 59, seconds: 59, totalSeconds: 21599 });

  useEffect(() => {
    let targetTime: number;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        targetTime = parseInt(saved, 10);
        // If expired or invalid, reset to 6 hours
        if (isNaN(targetTime) || targetTime <= Date.now()) {
          targetTime = Date.now() + DURATION_MS;
          localStorage.setItem(STORAGE_KEY, targetTime.toString());
        }
      } else {
        targetTime = Date.now() + DURATION_MS;
        localStorage.setItem(STORAGE_KEY, targetTime.toString());
      }
    } catch {
      targetTime = Date.now() + DURATION_MS;
    }

    const update = () => {
      const diff = Math.max(0, targetTime - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds, totalSeconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

interface CountdownDisplayProps {
  variant?: 'compact' | 'badge' | 'card' | 'hero';
  className?: string;
}

export const CountdownDisplay: React.FC<CountdownDisplayProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { hours, minutes, seconds } = useCountdown();

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1.5 font-mono text-xs font-black ${className}`}>
        <span className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold">{pad(hours)}j</span>
        <span className="text-rose-500 font-bold">:</span>
        <span className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold">{pad(minutes)}m</span>
        <span className="text-rose-500 font-bold">:</span>
        <span className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold">{pad(seconds)}d</span>
      </div>
    );
  }

  if (variant === 'hero' || variant === 'card') {
    return (
      <div className={`flex items-center gap-2 font-mono ${className}`}>
        <div className="flex flex-col items-center">
          <div className="w-11 sm:w-13 h-11 sm:h-12 bg-slate-950 text-yellow-400 font-black text-lg sm:text-xl rounded-xl flex items-center justify-center shadow-md border border-slate-800">
            {pad(hours)}
          </div>
          <span className="text-[10px] text-slate-500 font-sans mt-1 uppercase font-semibold">Jam</span>
        </div>
        <span className="text-xl font-bold text-slate-700 -mt-4">:</span>
        <div className="flex flex-col items-center">
          <div className="w-11 sm:w-13 h-11 sm:h-12 bg-slate-950 text-yellow-400 font-black text-lg sm:text-xl rounded-xl flex items-center justify-center shadow-md border border-slate-800">
            {pad(minutes)}
          </div>
          <span className="text-[10px] text-slate-500 font-sans mt-1 uppercase font-semibold">Menit</span>
        </div>
        <span className="text-xl font-bold text-slate-700 -mt-4">:</span>
        <div className="flex flex-col items-center">
          <div className="w-11 sm:w-13 h-11 sm:h-12 bg-slate-950 text-rose-400 font-black text-lg sm:text-xl rounded-xl flex items-center justify-center shadow-md border border-slate-800 animate-pulse">
            {pad(seconds)}
          </div>
          <span className="text-[10px] text-slate-500 font-sans mt-1 uppercase font-semibold">Detik</span>
        </div>
      </div>
    );
  }

  // Default compact
  return (
    <div className={`inline-flex items-center gap-1 font-mono text-xs font-bold ${className}`}>
      <span className="bg-slate-900 text-yellow-300 px-1.5 py-0.5 rounded text-[11px]">{pad(hours)}</span>
      <span>:</span>
      <span className="bg-slate-900 text-yellow-300 px-1.5 py-0.5 rounded text-[11px]">{pad(minutes)}</span>
      <span>:</span>
      <span className="bg-slate-900 text-rose-400 px-1.5 py-0.5 rounded text-[11px]">{pad(seconds)}</span>
    </div>
  );
};
