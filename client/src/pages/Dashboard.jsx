import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    CheckCircle2,
    RotateCcw,
    BookOpen, // Changed from Youtube
    BrainCircuit,
    Trophy,
    TrendingUp,
    AlertCircle,
    Clock,
    Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import KPICard from '../components/KPICard';
import ProgressBar from '../components/ProgressBar';
import HeatmapSection from '../components/HeatmapSection';
import ProgressGraphs from '../components/ProgressGraphs';
import { cn } from '../lib/utils';

// WHY: Main Dashboard view - the command center
// Shows all critical metrics, today's tasks, and motivational elements
const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard');
                setData(res.data.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-white p-8">Loading dashboard...</div>;
    if (!data) return <div className="text-white p-8">Failed to load dashboard data.</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-blue-500" />
                        {format(new Date(data.today), 'EEEE, MMMM do, yyyy')}
                    </h1>
                    <p className="text-slate-400 mt-2">
                        "Consistency is the code to your rank."
                    </p>
                </div>

                <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/50 px-6 py-4 rounded-xl text-center min-w-[200px]">
                    <div className="text-4xl font-bold text-blue-400">{data.daysUntilGATE}</div>
                    <div className="text-slate-400 text-xs uppercase tracking-widest mt-1">Days to GATE 2026</div>
                </div>
            </div>

            import HeatmapSection from '../components/HeatmapSection';
            import ProgressGraphs from '../components/ProgressGraphs';

            // ... (existing imports)

            // ... inside Dashboard component ...
            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* ... existing KPICards ... */}
                <KPICard
                    title="Topics Completed"
                    value={data.kpis.videosCompleted}
                    icon={BookOpen}
                    className="border-blue-900/50"
                />
                <KPICard
                    title="Revisions Done"
                    value={data.kpis.revisionsCompleted}
                    icon={RotateCcw}
                    className="border-purple-900/50"
                />
                <KPICard
                    title="PYQs Solved"
                    value={data.kpis.pyqsSolved}
                    icon={BrainCircuit}
                    className="border-emerald-900/50"
                />
                <KPICard
                    title="Problems Solved"
                    value={data.kpis.problemsSolved}
                    icon={CheckCircle2}
                    className="border-amber-900/50"
                />
            </div>

            {/* NEW: VISUALIZATIONS SECTION */}
            <div className="space-y-8">
                <HeatmapSection data={data.heatmapData} />
                <ProgressGraphs problemsData={data.problemsByDay} subjectData={data.subjectProgress} />
            </div>

            {/* MID SECTION - METRICS & ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Study Metrics & Motivation */}
                <div className="space-y-6">
                    {/* Consistency Streak */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Consistency Streak
                        </h3>
                        <div className="flex items-end gap-3">
                            <div className="text-5xl font-bold text-orange-500">{data.studyMetrics.consistencyStreak}</div>
                            <div className="text-slate-500 mb-1.5">days without break</div>
                        </div>
                    </div>

                    {/* Study Hours */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Study Hours
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-2xl font-bold text-white">{data.studyMetrics.todayStudyHours}</div>
                                <div className="text-slate-500 text-xs">Today</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{data.studyMetrics.cumulativeStudyHours}</div>
                                <div className="text-slate-500 text-xs">Total</div>
                            </div>
                        </div>
                    </div>

                    {/* Best Mock */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-emerald-500" /> Best Mock Score
                        </h3>
                        <div className="flex items-end gap-3">
                            <div className="text-4xl font-bold text-emerald-500">{data.motivation.bestMockScore}%</div>
                            <div className="text-slate-500 mb-1.5">accuracy</div>
                        </div>
                    </div>
                </div>

                {/* MIDDLE & RIGHT COLUMNS: Action Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Today's Tasks & Revisions */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Today's Focus</h2>
                            <div className="text-slate-400 text-sm">
                                {data.studyMetrics.dailyCompletion}% Completed
                            </div>
                        </div>

                        <ProgressBar value={data.studyMetrics.dailyCompletion} showLabel={false} className="mb-8" />

                        <div className="space-y-6">
                            {/* Topics Section - Replaces Revisions as primary if we want, or keep both */}
                            <div>
                                <h3 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-400" />
                                    Topics Planned for Today ({data.todayActions.topics ? data.todayActions.topics.length : 0})
                                </h3>

                                {(!data.todayActions.topics || data.todayActions.topics.length === 0) ? (
                                    <p className="text-slate-500 text-sm italic">No topics scheduled. Plan some in Subjects!</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {data.todayActions.topics.map((topic) => (
                                            <li key={topic._id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-slate-500 text-xs font-mono bg-slate-900 px-1.5 rounded">
                                                            {format(new Date(topic.assignedDate), 'h:mm a')}
                                                        </span>
                                                        <p className="text-slate-200 text-sm font-medium">{topic.name}</p>
                                                    </div>
                                                    <a href={`/subjects/${topic.subject?._id}`} className="text-blue-500 hover:text-blue-400 text-xs hover:underline">
                                                        {topic.subject?.name}
                                                    </a>
                                                </div>
                                                <span className={cn(
                                                    "text-xs px-2 py-1 rounded",
                                                    topic.isCompleted ? "bg-emerald-900/30 text-emerald-400" : "bg-blue-900/30 text-blue-400"
                                                )}>
                                                    {topic.isCompleted ? 'Completed' : 'Planned'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="h-px bg-slate-800"></div>

                            {/* Revisions Section */}
                            <div>
                                <h3 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4 text-purple-400" />
                                    Revisions Due ({data.todayActions.revisionsCount})
                                </h3>

                                {data.todayActions.revisions.length === 0 ? (
                                    <p className="text-slate-500 text-sm italic">No revisions scheduled for today.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {data.todayActions.revisions.map((rev) => (
                                            <li key={rev._id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                                                <div>
                                                    <p className="text-slate-200 text-sm font-medium">{rev.topic ? rev.topic.name : 'Unknown Topic'}</p>
                                                    {/* Updated to use topic */}
                                                    <p className="text-slate-500 text-xs">{rev.subject?.name}</p>
                                                </div>
                                                <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded">
                                                    Rev #{rev.revisionNumber}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="h-px bg-slate-800"></div>

                            {/* Weak Topics Section */}
                            <div>
                                <h3 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                    Weak Topics to Review
                                </h3>

                                {data.todayActions.weakTopics.length === 0 ? (
                                    <p className="text-slate-500 text-sm italic">No weak topics identified. Keep it up!</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {data.todayActions.weakTopics.slice(0, 3).map((topic) => (
                                            <li key={topic._id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                                                <div>
                                                    <p className="text-slate-200 text-sm font-medium">{topic.name}</p>
                                                    <p className="text-slate-500 text-xs">{topic.subject?.name}</p>
                                                </div>
                                                <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded">
                                                    Conf: {topic.confidenceLevel}/5
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
