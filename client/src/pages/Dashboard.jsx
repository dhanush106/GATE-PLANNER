import { useEffect, useState } from 'react';
import api from '../lib/api';
import {
    CheckCircle2,
    RotateCcw,
    BookOpen,
    BrainCircuit,
    Trophy,
    TrendingUp,
    AlertCircle,
    Clock,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import KPICard from '../components/KPICard';
import ProgressBar from '../components/ProgressBar';
import HeatmapSection from '../components/HeatmapSection';
import ProgressGraphs from '../components/ProgressGraphs';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/dashboard');
                setData(res.data.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Initializing Command Center...</p>
            </div>
        </div>
    );

    if (!data) return <div className="text-destructive p-8 bg-destructive/10 rounded-2xl border border-destructive/20">Failed to load dashboard data. Please check connection.</div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10 pb-12"
        >
            {/* HEADER SECTION */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <motion.div variants={itemVariants} className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                            {format(new Date(data.today), 'EEEE, MMMM do')}
                        </h1>
                    </motion.div>
                    <motion.p variants={itemVariants} className="text-muted-foreground font-medium max-w-md">
                        "Consistency is the code to your rank." Ready to optimize today's performance?
                    </motion.p>
                </div>

                <motion.div
                    variants={itemVariants}
                    className="relative group overflow-hidden bg-primary/10 border border-primary/20 px-8 py-5 rounded-2xl transition-all hover:bg-primary/15"
                >
                    <div className="absolute top-0 right-0 p-1">
                        <ArrowRight className="w-4 h-4 text-primary/40 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-4xl font-black text-primary tracking-tighter">{data.daysUntilGATE}</div>
                    <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Days to GATE 2026</div>
                </motion.div>
            </header>

            {/* KPI GRID */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Topics Completed"
                    value={data.kpis.videosCompleted}
                    icon={BookOpen}
                />
                <KPICard
                    title="Revisions Done"
                    value={data.kpis.revisionsCompleted}
                    icon={RotateCcw}
                />
                <KPICard
                    title="PYQs Solved"
                    value={data.kpis.pyqsSolved}
                    icon={BrainCircuit}
                />
                <KPICard
                    title="Problems Solved"
                    value={data.kpis.problemsSolved}
                    icon={CheckCircle2}
                />
            </section>

            {/* MID SECTION - ANALYTICS & FOCUS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: VISUALIZATIONS */}
                <div className="lg:col-span-8 space-y-8">
                    <motion.div variants={itemVariants} className="bento-card">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" /> Activity Heatmap
                        </h2>
                        <HeatmapSection data={data.heatmapData} />
                    </motion.div>

                    <motion.div variants={itemVariants} className="bento-card">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" /> Progress Analytics
                        </h2>
                        <ProgressGraphs problemsData={data.problemsByDay} subjectData={data.subjectProgress} />
                    </motion.div>
                </div>

                {/* RIGHT: METRICS & FOCUS */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Focus Card */}
                    <motion.div variants={itemVariants} className="bento-card border-primary/20 bg-primary/[0.02]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black tracking-tight">Today's Focus</h2>
                            <span className="text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded-lg">
                                {data.studyMetrics.dailyCompletion}%
                            </span>
                        </div>

                        <ProgressBar value={data.studyMetrics.dailyCompletion} showLabel={false} className="h-3 mb-8" />

                        <div className="space-y-6">
                            {/* Topics */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary" /> Planned Topics
                                </h3>
                                {(!data.todayActions.topics || data.todayActions.topics.length === 0) ? (
                                    <p className="text-muted-foreground text-sm italic py-4 text-center border border-dashed border-border rounded-xl">No topics scheduled.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {data.todayActions.topics.slice(0, 3).map((topic) => (
                                            <li key={topic._id} className="group flex justify-between items-center bg-secondary/30 p-4 rounded-xl border border-border hover:border-primary/30 transition-all">
                                                <div>
                                                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{topic.name}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{topic.subject?.name}</p>
                                                </div>
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    topic.isCompleted ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-primary animate-pulse shadow-glow"
                                                )} />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="h-px bg-border" />

                            {/* Weak Topics */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-destructive" /> Improvement Areas
                                </h3>
                                <ul className="space-y-3">
                                    {data.todayActions.weakTopics.slice(0, 2).map((topic) => (
                                        <li key={topic._id} className="flex justify-between items-center bg-destructive/5 p-4 rounded-xl border border-destructive/10">
                                            <div>
                                                <p className="text-sm font-bold">{topic.name}</p>
                                                <p className="text-[10px] text-destructive/70 font-bold uppercase">{topic.subject?.name}</p>
                                            </div>
                                            <TrendingUp className="w-4 h-4 text-destructive/40" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        <motion.div variants={itemVariants} className="bento-card py-4 bg-orange-500/[0.03] border-orange-500/10">
                            <div className="flex items-center gap-4">
                                <TrendingUp className="w-8 h-8 text-orange-500" />
                                <div>
                                    <div className="text-2xl font-black text-orange-500">{data.studyMetrics.consistencyStreak}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Day Streak</div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="bento-card py-4 bg-blue-500/[0.03] border-blue-500/10">
                            <div className="flex items-center gap-4">
                                <Clock className="w-8 h-8 text-blue-500" />
                                <div>
                                    <div className="text-2xl font-black text-blue-500">{data.studyMetrics.todayStudyHours}h</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Study Today</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
