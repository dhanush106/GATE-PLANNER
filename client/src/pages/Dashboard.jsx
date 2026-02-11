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

    if (loading) return <div className="min-h-screen bg-base-bg text-accent-emerald flex items-center justify-center font-bold tracking-widest animate-pulse uppercase">Initializing Core Engine...</div>;
    if (!data) return <div className="min-h-screen bg-base-bg text-red-500 flex items-center justify-center uppercase font-black">Connection Failure. Terminal Offline.</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER SECTION */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-text-main tracking-tighter flex items-center gap-4 uppercase italic">
                        Command <span className="text-accent-emerald drop-shadow-[0_0_10px_rgba(0,255,156,0.3)]">Center</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <Calendar className="w-4 h-4 text-accent-emerald" />
                        <p className="text-text-secondary text-sm font-bold uppercase tracking-[0.2em]">
                            {format(new Date(data.today), 'EEEE, MMMM do, yyyy')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="bg-card-bg border border-accent-emerald/20 px-8 py-5 rounded-2xl text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-accent-emerald/50" />
                        <div className="text-4xl font-black text-accent-emerald drop-shadow-[0_0_15px_rgba(0,255,156,0.4)]">{data.daysUntilGATE}</div>
                        <div className="text-text-muted text-[10px] uppercase font-bold tracking-[0.3em] mt-1">Days to GATE Hub</div>
                    </div>

                    <div className="hidden lg:block glass-card px-8 py-5 rounded-2xl text-center">
                        <div className="text-4xl font-black text-text-main group-hover:neon-text transition-all italic">{data.studyMetrics.consistencyStreak}</div>
                        <div className="text-text-muted text-[10px] uppercase font-bold tracking-[0.3em] mt-1 flex items-center gap-2">
                            <Flame className="w-3 h-3 text-orange-500" /> Current Streak
                        </div>
                    </div>
                </div>
            </div>

            {/* TOP KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Execution Units"
                    value={data.kpis.videosCompleted}
                    icon={BookOpen}
                    trend={+12}
                    trendLabel="vs last week"
                />
                <KPICard
                    title="Revision Cycles"
                    value={data.kpis.revisionsCompleted}
                    icon={RotateCcw}
                    trend={+5}
                    trendLabel="Optimizing recall"
                />
                <KPICard
                    title="Pattern Mastery"
                    value={data.kpis.pyqsSolved}
                    icon={BrainCircuit}
                    trend={+24}
                    trendLabel="PYQ progress"
                />
                <KPICard
                    title="Problem Volume"
                    value={data.kpis.problemsSolved}
                    icon={CheckCircle2}
                    trend={+18}
                    trendLabel="Daily solve rate"
                />
            </div>

            {/* MAIN DASHBOARD GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CALENDAR & FOCUS (2 COLUMNS) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 h-full min-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-text-main italic uppercase tracking-tight">Today's <span className="text-accent-emerald">Directives</span></h2>
                            <div className="flex items-center gap-4">
                                <span className="text-text-muted text-xs font-bold uppercase tracking-widest">{data.studyMetrics.dailyCompletion}% SYNC</span>
                                <div className="w-32 h-2 bg-black/40 rounded-full border border-white/5 overflow-hidden">
                                    <div
                                        className="h-full bg-accent-emerald shadow-[0_0_10px_rgba(0,255,156,0.5)] transition-all duration-1000"
                                        style={{ width: `${data.studyMetrics.dailyCompletion}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 flex-1">
                            {/* Priority Tasks */}
                            <section>
                                <h3 className="text-text-secondary text-[10px] uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-accent-emerald rounded-full"></div>
                                    Primary Execution ({data.todayActions.topics?.length || 0})
                                </h3>

                                {(!data.todayActions.topics || data.todayActions.topics.length === 0) ? (
                                    <div className="bg-black/20 border border-dashed border-white/5 rounded-2xl p-8 text-center">
                                        <p className="text-text-muted text-sm italic">Tactical silence. Schedule directives in Subjects.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {data.todayActions.topics.map((topic) => (
                                            <div key={topic._id} className="bg-[#182320]/50 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-accent-emerald/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-black/40 rounded-lg flex items-center justify-center text-accent-emerald font-black text-xs">
                                                        {format(new Date(topic.assignedDate), 'HH:mm')}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-text-main font-bold text-sm tracking-tight">{topic.name || topic.title}</h4>
                                                        <p className="text-accent-emerald/60 text-[10px] uppercase font-black">{topic.subject?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="status-badge status-watching">ACTIVE</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Revision Queue */}
                            <section>
                                <h3 className="text-text-secondary text-[10px] uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                    Memory Refresh ({data.todayActions.revisionsCount})
                                </h3>
                                <div className="space-y-3">
                                    {data.todayActions.revisions.map((rev) => (
                                        <div key={rev._id} className="bg-black/20 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-purple-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <RotateCcw className="w-4 h-4 text-purple-500" />
                                                <span className="text-text-main text-sm font-medium">{rev.topic?.name || 'Critical Retrieval'}</span>
                                            </div>
                                            <div className="status-badge status-revised italic">Rev #{rev.revisionNumber}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR ANALYTICS (1 COLUMN) */}
                <div className="space-y-8">
                    {/* STUDY TIMER INTEGRATION MOCKUP */}
                    <div className="glass-card p-8 bg-gradient-to-br from-accent-emerald/5 to-transparent border-accent-emerald/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Focus Session</h3>
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        </div>
                        <div className="text-center py-4">
                            <div className="text-6xl font-black text-text-main tracking-tighter tabular-nums mb-2">
                                {data.studyMetrics.todayStudyHours}<span className="text-accent-emerald">h</span>
                            </div>
                            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Logged today</p>
                        </div>
                        <button className="w-full bg-accent-emerald text-black font-black uppercase py-4 rounded-xl mt-6 shadow-[0_0_20px_rgba(0,255,156,0.3)] hover:translate-y-[-2px] hover:shadow-[0_0_30px_rgba(0,255,156,0.5)] transition-all active:scale-[0.98]">
                            Engage Focus Mode
                        </button>
                    </div>

                    {/* INSIGHTS */}
                    <div className="glass-card p-8 bg-[#182320]/20">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 italic">
                            <BrainCircuit className="w-4 h-4 text-accent-emerald" /> AI Insights
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-1 h-12 bg-accent-emerald/40 rounded-full" />
                                <div>
                                    <p className="text-xs text-text-main font-bold">Peak Performance Node</p>
                                    <p className="text-[10px] text-text-muted mt-1 leading-relaxed">Your retention rate peaks between <span className="text-accent-emerald">05:00 - 08:00 AM</span>. Prioritize new concepts then.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1 h-12 bg-red-500/40 rounded-full" />
                                <div>
                                    <p className="text-xs text-text-main font-bold">Consistency Warning</p>
                                    <p className="text-[10px] text-text-muted mt-1 leading-relaxed">Probability of daily target failure increases by <span className="text-red-400">40%</span> if session starts after 2 PM.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HEATMAP SECTION */}
            <HeatmapSection data={data.heatmapData} />

            {/* RANK PROJECTION PLACEHOLDER */}
            <div className="glass-card p-10 bg-gradient-to-r from-[#141C1A] to-[#0B0F0E] relative overflow-hidden">
                <div className="flex justify-between items-center mb-10 z-10 relative">
                    <div>
                        <h2 className="text-3xl font-black text-text-main italic uppercase tracking-tighter">Rank <span className="text-accent-emerald">Matrix</span></h2>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1">Syllabus coverage & trend analysis</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Expected Projection</div>
                        <div className="text-4xl font-black text-accent-emerald drop-shadow-[0_0_15px_rgba(0,255,156,0.4)] tracking-tighter italic">AIR 450 — 820</div>
                    </div>
                </div>

                <div className="h-[200px] w-full bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 relative group cursor-crosshair">
                    <ProgressGraphs problemsData={data.problemsByDay} subjectData={data.subjectProgress} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
