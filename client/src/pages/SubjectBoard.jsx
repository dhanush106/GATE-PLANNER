import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ChevronLeft, ChevronRight, Plus, CheckSquare, Square,
    Calendar as CalendarIcon, Target, AlertTriangle, Flame,
    TrendingUp, ArrowLeft, Pencil, Trash2
} from 'lucide-react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths,
    parseISO, isPast, startOfDay, subDays
} from 'date-fns';
import { cn } from '../lib/utils';
import Modal from '../components/Modal';

// WHY: High-Performance Calendar with Lookup Map (O(1) access)
const SubjectBoard = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subject, setSubject] = useState(null);
    const [topics, setTopics] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newTopicName, setNewTopicName] = useState('');
    const [editingTopic, setEditingTopic] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [subRes, topicsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/subjects/${id}`),
                axios.get(`http://localhost:5000/api/topics?subject=${id}`)
            ]);
            setSubject(subRes.data.data);
            setTopics(topicsRes.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // PERFORMANCE: Memoize Topic Lookup Map
    const topicsByDate = useMemo(() => {
        const map = {};
        topics.forEach(topic => {
            const dateKey = format(new Date(topic.assignedDate), 'yyyy-MM-dd');
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(topic);
        });
        return map;
    }, [topics]);

    // PERFORMANCE: Memoize Calendar Grid
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentMonth]);

    // HEATMAP GENERATION (Last 14 days for compact view)
    const heatmapDays = useMemo(() => {
        if (!subject?.heatmap) return [];
        const today = new Date();
        const days = [];
        for (let i = 13; i >= 0; i--) {
            const d = subDays(today, i);
            const dateStr = format(d, 'yyyy-MM-dd');
            const entry = subject.heatmap.find(h => format(new Date(h.date), 'yyyy-MM-dd') === dateStr);
            days.push({
                date: d,
                count: entry ? entry.count : 0
            });
        }
        return days;
    }, [subject]);

    // Derived State for Selected Date
    const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
    const selectedDayTopics = topicsByDate[selectedDateKey] || [];

    // Handlers
    const createTopic = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/topics', {
                subject: id,
                name: newTopicName,
                assignedDate: selectedDate
            });
            setIsCreateModalOpen(false);
            setNewTopicName('');
            fetchData();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleUpdateTopic = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/api/topics/${editingTopic._id}`, {
                name: editingTopic.name
            });
            setIsEditModalOpen(false);
            setEditingTopic(null);
            fetchData();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTopic = async (e, topicId) => {
        e.stopPropagation();
        if (window.confirm("Delete this task?")) {
            try {
                await axios.delete(`http://localhost:5000/api/topics/${topicId}`);
                fetchData();
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    const openEditModal = (e, topic) => {
        e.stopPropagation();
        setEditingTopic(topic);
        setIsEditModalOpen(true);
    };

    const toggleTopic = async (topic) => {
        const updatedTopics = topics.map(t =>
            t._id === topic._id ? { ...t, isCompleted: !t.isCompleted } : t
        );
        setTopics(updatedTopics);

        try {
            await axios.patch(`http://localhost:5000/api/topics/${topic._id}`, {
                isCompleted: !topic.isCompleted
            });
        } catch (error) {
            console.error("Error updating task:", error);
            fetchData();
        }
    };

    if (loading) return <div className="h-screen bg-[#050505] text-white flex items-center justify-center">Loading Engine...</div>;
    if (!subject) return <div className="h-screen bg-[#050505] text-white flex items-center justify-center">Subject Not Found</div>;

    return (
        <div className="h-[calc(100vh-6rem)] bg-[#050505] flex gap-6 p-6 animate-in fade-in duration-500 overflow-hidden">

            {/* LEFT: CALENDAR PANEL */}
            <div className="w-[420px] flex flex-col bg-[#111] border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-6 z-10">
                    <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 mb-2 z-10">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                        <div key={d} className="text-center text-xs font-bold text-slate-600 mb-2">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2 z-10 flex-1 content-start">
                    {calendarDays.map((day) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const hasTopics = topicsByDate[dateKey]?.length > 0;
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
                                        ? "bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white",
                                    isToday(day) && !isSelected && "border border-emerald-500/30 text-emerald-400"
                                )}
                            >
                                {format(day, 'd')}
                                {hasTopics && !isSelected && (
                                    <div className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* REAL-TIME DASHBOARD (Streak & Heatmap) */}
                <div className="mt-auto pt-6 border-t border-white/5 z-10">
                    <div className="flex justify-between items-end mb-3">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <Flame className={cn("w-5 h-5", subject.streak > 0 ? "fill-emerald-500 animate-pulse" : "text-slate-600")} />
                            <div>
                                <div className="text-xl font-bold leading-none">{subject.streak || 0} Days</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Current Streak</div>
                            </div>
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Consistency</div>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="flex gap-1 justify-between">
                        {heatmapDays.map((day, idx) => (
                            <div
                                key={idx}
                                title={`${format(day.date, 'MMM d')}: ${day.count} activities`}
                                className={cn(
                                    "h-8 flex-1 rounded-sm transition-all hover:scale-110",
                                    day.count === 0 ? "bg-white/5" :
                                        day.count < 3 ? "bg-emerald-900/40 border border-emerald-500/20" :
                                            day.count < 6 ? "bg-emerald-600/60 border border-emerald-400/30 shadow-[0_0_5px_rgba(16,185,129,0.2)]" :
                                                "bg-emerald-400 border border-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: TASKS PANEL */}
            <div className="flex-1 flex flex-col bg-[#111] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <button onClick={() => navigate('/subjects')} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="mb-8 z-10">
                    <div className="text-slate-500 text-sm font-medium mb-1">{format(selectedDate, 'EEEE, MMMM do, yyyy')}</div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">
                        {subject.name}
                    </h1>
                </div>

                <div className="mb-8 z-10">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        <span>Subject Completion</span>
                        <span>{subject.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000"
                            style={{ width: `${subject.progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar z-10 mb-20">
                    {selectedDayTopics.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600">
                            <Target className="w-12 h-12 mb-4 opacity-20" />
                            <p>No tasks assigned for this day.</p>
                            <p className="text-sm">Click "+ Add Task" to schedule.</p>
                        </div>
                    ) : (
                        selectedDayTopics.map(topic => (
                            <div
                                key={topic._id}
                                onClick={() => toggleTopic(topic)}
                                className={cn(
                                    "group p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 relative overflow-hidden",
                                    topic.isCompleted
                                        ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                    topic.isCompleted ? "bg-emerald-500 border-emerald-500 text-black scale-110" : "border-slate-500 group-hover:border-emerald-400"
                                )}>
                                    {topic.isCompleted && <CheckSquare className="w-4 h-4" />}
                                </div>

                                <span className={cn(
                                    "text-lg font-medium transition-colors flex-1",
                                    topic.isCompleted ? "text-emerald-100 line-through opacity-70" : "text-white group-hover:text-emerald-50"
                                )}>
                                    {topic.name}
                                </span>

                                {/* Edit/Delete Actions */}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => openEditModal(e, topic)}
                                        className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                                    >
                                        <Pencil className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteTopic(e, topic._id)}
                                        className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="absolute bottom-6 left-8 right-8 z-20">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> ADD TASK
                    </button>
                </div>
            </div>

            {/* Create Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="New Task">
                <form onSubmit={createTopic} className="space-y-4">
                    <input
                        autoFocus
                        required
                        type="text"
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:ring-2 focus:ring-emerald-500/50 outline-none"
                        placeholder="What needs to be done?"
                    />
                    <button type="submit" className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl">
                        Schedule
                    </button>
                    <p className="text-center text-slate-500 text-xs mt-2">
                        Assigned to {format(selectedDate, 'MMMM do')}
                    </p>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
                <form onSubmit={handleUpdateTopic} className="space-y-4">
                    <input
                        autoFocus
                        required
                        type="text"
                        value={editingTopic?.name || ''}
                        onChange={(e) => setEditingTopic({ ...editingTopic, name: e.target.value })}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:ring-2 focus:ring-emerald-500/50 outline-none"
                    />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl">
                        Update Task
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default SubjectBoard;
