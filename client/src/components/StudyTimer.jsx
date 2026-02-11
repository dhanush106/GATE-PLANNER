import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Timer } from 'lucide-react';
import { formatDuration } from '../lib/utils';
import { cn } from '../lib/utils';

// WHY: Study timer component for tracking focused work sessions
// Logs session to backend when stopped
const StudyTimer = () => {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive, seconds]);

    const toggleTimer = async () => {
        if (!isActive) {
            // Start Timer
            setIsActive(true);
            setStartTime(new Date());
        } else {
            // Stop Timer & Log Session
            setIsActive(false);

            if (seconds > 60) { // Only log if > 1 minute
                const endTime = new Date();
                try {
                    await fetch('http://localhost:5000/api/study-sessions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            startTime,
                            endTime,
                            duration: Math.round(seconds / 60)
                        })
                    });
                    // Reset after logging
                    setSeconds(0);
                    setStartTime(null);
                } catch (error) {
                    console.error("Failed to log session:", error);
                }
            } else {
                // Reset if < 1 minute (accidental start)
                setSeconds(0);
                setStartTime(null);
            }
        }
    };

    // Format time as HH:MM:SS
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div
            className={cn(
                "flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all duration-300",
                isActive
                    ? "bg-blue-900/20 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    : "bg-slate-900 border-slate-700 hover:border-slate-600"
            )}
        >
            <div className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-red-500 animate-pulse" : "bg-slate-600"
            )}></div>

            <span className="font-mono font-medium text-slate-200 min-w-[3rem] text-center">
                {formatTime(seconds)}
            </span>

            <button
                onClick={toggleTimer}
                className={cn(
                    "p-1 rounded-full transition-colors",
                    isActive
                        ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
                )}
            >
                {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 pl-0.5" />}
            </button>
        </div>
    );
};

export default StudyTimer;
