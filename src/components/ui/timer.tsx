import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
    durationMinutes: number;
    onExpire: () => void;
    className?: string;
}

export function Timer({ durationMinutes, onExpire, className }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60); // in seconds
    const [isWarning, setIsWarning] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            onExpire();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1;

                // Warning at 5 minutes
                if (newTime === 300 && !isWarning) {
                    setIsWarning(true);
                }

                if (newTime <= 0) {
                    clearInterval(interval);
                    onExpire();
                    return 0;
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, onExpire, isWarning]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const isLowTime = timeLeft <= 300; // 5 minutes or less

    return (
        <div className={cn(
            "flex items-center gap-3 p-4 rounded-xl transition-all",
            isLowTime ? "bg-red-50 border-2 border-red-200" : "bg-brand-50 border-2 border-brand-100",
            className
        )}>
            {isLowTime ? (
                <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
            ) : (
                <Clock className="w-5 h-5 text-brand-600" />
            )}
            <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Time Remaining</p>
                <p className={cn(
                    "text-2xl font-black tabular-nums",
                    isLowTime ? "text-red-600" : "text-gray-900"
                )}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
            </div>
            {isLowTime && (
                <p className="text-xs font-bold text-red-600 ml-auto">
                    Hurry up!
                </p>
            )}
        </div>
    );
}
