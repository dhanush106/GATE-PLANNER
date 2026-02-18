import { useState, useEffect, useMemo } from 'react';
import api from '../lib/api';
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

            const res = await api.get(`/api/revisions/range?startDate=${start}&endDate=${end}`);
            setRevisions(res.data.data);
        } catch (error) {
            console.error("Error fetching revisions:", error);
        } finally {
            setLoading(false);
        }
    };

    const markComplete = async (id) => {
        try {
            await api.put(`/api/revisions/${id}/complete`);
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
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 pb-12">

            {/* LEFT: CALENDAR PANEL */}
            <div className="w-full lg:w-[420px] shrink-0 flex flex-col bg-card border border-border rounded-[2rem] p-4 sm:p-8 shadow-sm relative overflow-hidden h-fit">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/50 to-transparent" />

                {/* Header */}
                <div className="flex justify-between items-center mb-4 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-3">
                        <RotateCcw className="w-6 h-6 text-primary" />
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 mb-4">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                        <div key={d} className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
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
                                    "h-10 w-full rounded-xl flex items-center justify-center text-xs font-bold transition-all relative group",
                                    !isCurrentMonth && "opacity-10",
                                    isSelected
                                        ? "bg-primary text-primary-foreground shadow-glow scale-110 z-10"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                                    isToday(day) && !isSelected && "border border-primary/30 text-primary"
                                )}
                            >
                                {format(day, 'd')}
                                {hasRevisions && !isSelected && (
                                    <div className={cn(
                                        "absolute bottom-1 w-1 h-1 rounded-full",
                                        isAllDone ? "bg-emerald-500" : "bg-primary/70"
                                    )} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: REVISIONS LIST PANEL */}
            <div className="flex-1 flex flex-col bg-card border border-border rounded-[2rem] p-4 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="mb-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                                {format(selectedDate, 'EEEE, MMMM do')}
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                                {totalCount === 0 ? "No Revisions Due" : `${completedCount}/${totalCount} Completed`}
                            </h1>
                        </div>
                        {totalCount > 0 && (
                            <div className="hidden sm:block text-right">
                                <div className="text-5xl font-black text-primary/10 select-none">{progress}%</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {selectedDayRevisions.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <div className="p-6 bg-secondary rounded-full mb-6">
                                <BrainCircuit className="w-12 h-12 text-primary/40" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Clear Schedule</h3>
                            <p className="text-muted-foreground max-w-xs text-sm">
                                No revisions scheduled for this date. Topics you complete will appear here automatically based on spaced repetition.
                            </p>
                        </div>
                    ) : (
                        selectedDayRevisions.map(rev => (
                            <div
                                key={rev._id}
                                className={cn(
                                    "group p-6 rounded-2xl border transition-all flex items-center justify-between gap-6",
                                    rev.completed
                                        ? "bg-emerald-500/5 border-emerald-500/10 opacity-60"
                                        : "bg-secondary/30 border-border hover:border-primary/30 hover:bg-secondary/50"
                                )}
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={cn(
                                            "text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider border",
                                            rev.revisionNumber === 1
                                                ? "bg-primary/10 text-primary border-primary/20"
                                                : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                                        )}>
                                            Rev #{rev.revisionNumber}
                                        </span>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">{rev.subject?.name}</span>
                                    </div>
                                    <h3 className={cn(
                                        "text-lg font-bold transition-colors truncate",
                                        rev.completed ? "text-emerald-600 line-through" : "text-foreground group-hover:text-primary"
                                    )}>
                                        {rev.topic?.name || rev.topic?.title || "Unknown Topic"}
                                    </h3>
                                </div>

                                {!rev.completed ? (
                                    <button
                                        onClick={() => markComplete(rev._id)}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground p-3.5 rounded-2xl transition-all shadow-glow hover:scale-105 active:scale-95 shrink-0"
                                        title="Mark as Revised"
                                    >
                                        <CheckCircle2 className="w-6 h-6" />
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 font-bold text-emerald-500 text-sm shrink-0">
                                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <span className="hidden sm:inline">Done</span>
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
