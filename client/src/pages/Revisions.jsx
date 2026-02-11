import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, Calendar,
    AlertTriangle, ArrowRight, BrainCircuit
} from 'lucide-react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths,
    addDays
} from 'date-fns';
import { cn } from '../lib/utils';

// WHY: Revisions Manager with Calendar View
// Allows visualization of spaced repetition schedule
const Revisions = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [revisions, setRevisions] = useState([]); // List of revisions for the selected range/month
    const [loading, setLoading] = useState(false);

    // Fetch revisions for the entire month view to populate calendar indicators
    useEffect(() => {
        fetchRevisionsForMonth();
    }, [currentMonth]);

    const fetchRevisionsForMonth = async () => {
        setLoading(true);
        try {
            const start = startOfWeek(startOfMonth(currentMonth)).toISOString();
            const end = endOfWeek(endOfMonth(currentMonth)).toISOString();

            const res = await axios.get(`http://localhost:5000/api/revisions/range?startDate=${start}&endDate=${end}`);
            setRevisions(res.data.data);
        } catch (error) {
            console.error("Error fetching revisions:", error);
        } finally {
            setLoading(false);
        }
    };

    const markComplete = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/revisions/${id}/complete`);
            // Optimistic update
            setRevisions(prev => prev.map(r => r._id === id ? { ...r, completed: true } : r));
        } catch (error) {
            console.error("Error completing revision:", error);
        }
    };

    // Memoize Calendar Helpers
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentMonth]);

    // Map revisions to dates for O(1) lookup
    const revisionsByDate = useMemo(() => {
        const map = {};
        revisions.forEach(rev => {
            const dateKey = format(new Date(rev.scheduledDate), 'yyyy-MM-dd');
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(rev);
        });
        return map;
    }, [revisions]);

    const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
    const selectedDayRevisions = revisionsByDate[selectedDateKey] || [];

    // Calculate stats for the selected day
    const completedCount = selectedDayRevisions.filter(r => r.completed).length;
    const totalCount = selectedDayRevisions.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="h-[calc(100vh-6rem)] bg-[#050505] flex gap-6 p-6 animate-in fade-in duration-500 overflow-hidden">

            {/* LEFT: CALENDAR PANEL */}
            <div className="w-[420px] flex flex-col bg-[#111] border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent" />

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <RotateCcw className="w-6 h-6 text-purple-500" />
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 mb-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                        <div key={d} className="text-center text-xs font-bold text-slate-600 mb-2">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2 flex-1 content-start overflow-y-auto custom-scrollbar">
                    {calendarDays.map((day) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const dayRevisions = revisionsByDate[dateKey] || [];
                        const hasRevisions = dayRevisions.length > 0;
                        const isAllDone = hasRevisions && dayRevisions.every(r => r.completed);
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentMonth);

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "h-10 w-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all relative group",
                                    !isCurrentMonth && "opacity-20",
                                    isSelected
                                        ? "bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(147,51,234,0.4)] scale-110"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white",
                                    isToday(day) && !isSelected && "border border-purple-500/30 text-purple-400"
                                )}
                            >
                                {format(day, 'd')}
                                {hasRevisions && !isSelected && (
                                    <div className={cn(
                                        "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                                        isAllDone ? "bg-emerald-500" : "bg-purple-500/70"
                                    )} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: REVISIONS LIST PANEL */}
            <div className="flex-1 flex flex-col bg-[#111] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="mb-8 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-slate-500 text-sm font-medium mb-1">{format(selectedDate, 'EEEE, MMMM do, yyyy')}</div>
                            <h1 className="text-4xl font-bold text-white">
                                {totalCount === 0 ? "No Revisions Due" : `${completedCount}/${totalCount} Completed`}
                            </h1>
                        </div>
                        {totalCount > 0 && (
                            <div className="text-right">
                                <div className="text-4xl font-black text-purple-500/20">{progress}%</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar z-10">
                    {selectedDayRevisions.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600">
                            <BrainCircuit className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-xl font-medium">Clear Mind</p>
                            <p className="text-sm mt-2">No revisions scheduled for this date.</p>
                            <p className="text-xs text-slate-700 mt-4">Completion of topics creates spaced repetition tasks here automatically.</p>
                        </div>
                    ) : (
                        selectedDayRevisions.map(rev => (
                            <div
                                key={rev._id}
                                className={cn(
                                    "group p-5 rounded-2xl border transition-all flex items-center justify-between gap-4",
                                    rev.completed
                                        ? "bg-emerald-900/10 border-emerald-500/20 opacity-60"
                                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                )}
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                                            rev.revisionNumber === 1 ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                                        )}>
                                            Rev #{rev.revisionNumber}
                                        </span>
                                        <span className="text-xs text-slate-500">{rev.subject?.name}</span>
                                    </div>
                                    <h3 className={cn(
                                        "text-lg font-bold transition-colors",
                                        rev.completed ? "text-emerald-400 line-through" : "text-white"
                                    )}>
                                        {rev.topic?.name || rev.topic?.title || "Unknown Topic"}
                                    </h3>
                                </div>

                                {!rev.completed ? (
                                    <button
                                        onClick={() => markComplete(rev._id)}
                                        className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:scale-105 active:scale-95"
                                        title="Mark as Revised"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <div className="text-emerald-500 flex items-center gap-2 font-medium text-sm">
                                        <CheckCircle2 className="w-5 h-5" /> Done
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Revisions;
