import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

interface ProcessProps {
  isOpen: boolean;
  totalTimeMs: number;
  cocktailName: string;
  onClose: () => void;
}

const Process = ({ isOpen, totalTimeMs, cocktailName, onClose } : ProcessProps) => {
    const [progress, setProgress] = useState(0);
    const radius = 90;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    useEffect(() => {
        if (!isOpen) return;

        const startTime = Date.now();
        const endTime = startTime + totalTimeMs;

        const interval = setInterval(() => {
          const now = Date.now();
          const elapsed = now - startTime;
          const nextProgress = (elapsed / totalTimeMs) * 100;

          if (nextProgress >= 100) {
            setProgress(100);
            clearInterval(interval);
            setTimeout(onClose, 2000); 
          } else {
            setProgress(nextProgress);
          }
        }, 50); // Interval of 50ms for smoother progress updates

        return () => clearInterval(interval);
    }, [isOpen, totalTimeMs, onClose]);
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl p-8 flex flex-col items-center z-[9999]">
        
        <DialogHeader className="items-center text-center w-full">
          <DialogTitle className="text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {cocktailName || "Zubereitung"}
          </DialogTitle>
        </DialogHeader>

        <p className="text-purple-400/80 text-sm uppercase tracking-widest font-mono mt-2 mb-6 animate-pulse">
          {progress >= 100 ? "Fertig! Bitte nimm dein Glas" : "Getränk wird zubereitet..."}
        </p>
        
        <div className="relative flex items-center justify-center w-52 h-52">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" /> 
                <stop offset="50%" stopColor="#ec4899" /> 
                <stop offset="100%" stopColor="#34d399" />  
              </linearGradient>
            </defs>
            

            <circle
              stroke="#0f172a"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            
            <circle
              stroke="url(#progressGradient)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ 
                strokeDashoffset, 
                transition: 'stroke-dashoffset 0.05s linear' 
              }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          <div className="absolute text-4xl font-black font-mono bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
            {Math.round(progress)}%
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
export default Process
