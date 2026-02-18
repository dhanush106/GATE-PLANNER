import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CheckCircle2, Plus, TrendingUp, AlertOctagon
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Modal from '../components/Modal';
import { formatDate } from '../lib/utils';

// WHY: Mock Tests page with performance tracking
// Shows trend graph and detailed list of past mocks
const Mocks = () => {
    const [mocksData, setMocksData] = useState({ mocks: [], trendData: [] });
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newMock, setNewMock] = useState({
        subjectsCovered: [],
        totalMarks: 100,
        marksObtained: '',
        timeTaken: 180, // Default 3 hours
        mistakeBreakdown: {
            conceptual: 0,
            silly: 0,
            timePressure: 0
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [mocksRes, subjectsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/mocks'),
                axios.get('http://localhost:5000/api/subjects')
            ]);
            setMocksData(mocksRes.data.data);
            setSubjects(subjectsRes.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Calculate accuracy
            const accuracy = (parseFloat(newMock.marksObtained) / parseFloat(newMock.totalMarks)) * 100;

            const payload = {
                ...newMock,
                accuracy: accuracy,
                // If no subjects selected, assume full mock (send empty or handle in backend)
                // For now, let's require at least one subject or handle it? 
                // If empty, backend might just store empty array which is fine for Full Mock
            };

            await axios.post('http://localhost:5000/api/mocks', payload);
            setIsModalOpen(false);
            setNewMock({
                subjectsCovered: [],
                totalMarks: 100,
                marksObtained: '',
                timeTaken: 180,
                mistakeBreakdown: { conceptual: 0, silly: 0, timePressure: 0 }
            });
            fetchData();
        } catch (error) {
            console.error("Error creating mock:", error);
        }
    };

    const handleSubjectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setNewMock({ ...newMock, subjectsCovered: selectedOptions });
    };

    if (loading) return <div className="text-white p-8">Loading mocks...</div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <CheckCircle2 className="w-8 h-8 text-primary" />
                        </div>
                        Mock Analysis
                    </h1>
                    <p className="text-muted-foreground font-medium mt-3 max-w-lg">
                        Track your performance trends and identify conceptual gaps to optimize your GATE rank.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3.5 rounded-2xl flex items-center gap-2 font-black shadow-glow transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Log Mock Test
                </button>
            </header>

            {/* TREND CHART */}
            <div className="bento-card relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-32 h-32 text-primary" />
                </div>
                <h2 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary" /> Performance Trend
                </h2>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mocksData.trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10, fontWeight: 700 }}
                                tickFormatter={(date) => format(new Date(date), 'MMM d')}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10, fontWeight: 700 }}
                                axisLine={false}
                                tickLine={false}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-card)',
                                    borderColor: 'var(--color-border)',
                                    borderRadius: '1rem',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    color: 'var(--color-foreground)'
                                }}
                                cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="marks"
                                stroke="var(--color-primary)"
                                strokeWidth={4}
                                dot={{ fill: 'var(--color-primary)', r: 4, strokeWidth: 2, stroke: 'var(--color-card)' }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                                name="Marks"
                            />
                            <Line
                                type="monotone"
                                dataKey="accuracy"
                                stroke="#10b981"
                                strokeWidth={3}
                                strokeDasharray="6 6"
                                dot={false}
                                name="Accuracy %"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* MOCK LIST */}
            <div className="grid grid-cols-1 gap-6">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Recent Sessions</h2>
                {mocksData.mocks.map((mock) => (
                    <div key={mock._id} className="bento-card group">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                        {format(new Date(mock.testDate), 'EEEE, MMMM do')}
                                    </div>
                                    <div className="text-2xl font-black tracking-tight text-foreground">
                                        {mock.subjectsCovered.length > 0
                                            ? mock.subjectsCovered.map(s => s.name).join(', ')
                                            : 'Full Length Mock'}
                                    </div>
                                </div>

                                {/* Mistakes */}
                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
                                        <AlertOctagon className="w-3 h-3" />
                                        Conceptual: {mock.mistakeBreakdown.conceptual}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                                        <AlertOctagon className="w-3 h-3" />
                                        Silly: {mock.mistakeBreakdown.silly}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                                        <AlertOctagon className="w-3 h-3" />
                                        Time: {mock.mistakeBreakdown.timePressure}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-10 bg-secondary/30 p-6 rounded-3xl border border-border">
                                <div className="text-center">
                                    <div className="text-4xl font-black tracking-tighter text-foreground">{mock.marksObtained}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Score</div>
                                </div>
                                <div className="w-px h-10 bg-border" />
                                <div className="text-center">
                                    <div className={cn(
                                        "text-4xl font-black tracking-tighter",
                                        mock.accuracy > 80 ? "text-emerald-500" : mock.accuracy > 50 ? "text-primary" : "text-amber-500"
                                    )}>
                                        {Math.round(mock.accuracy)}%
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Accuracy</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {mocksData.mocks.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No mock tests recorded yet. Start testing to improve!
                    </div>
                )}
            </div>

            {/* ADD MOCK MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Log Mock Test Result"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                        {/* Defaulting to today in backend if not sent, but maybe add date picker later */}
                        <div className="text-slate-300 text-sm italic">(Defaults to Today)</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Marks Obtained</label>
                            <input
                                type="number"
                                required
                                value={newMock.marksObtained}
                                onChange={(e) => setNewMock({ ...newMock, marksObtained: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Total Marks</label>
                            <input
                                type="number"
                                required
                                value={newMock.totalMarks}
                                onChange={(e) => setNewMock({ ...newMock, totalMarks: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Subjects (Ctrl+Click to select multiple)</label>
                        <select
                            multiple
                            value={newMock.subjectsCovered}
                            onChange={handleSubjectChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 h-32"
                        >
                            {subjects.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                        <div className="text-xs text-slate-500 mt-1">Leave empty for Full Mock Test</div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 mt-4">
                        <div className="text-sm font-medium text-slate-400 mb-3">Mistake Breakdown</div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Conceptual</label>
                                <input
                                    type="number"
                                    value={newMock.mistakeBreakdown.conceptual}
                                    onChange={(e) => setNewMock({ ...newMock, mistakeBreakdown: { ...newMock.mistakeBreakdown, conceptual: parseInt(e.target.value) || 0 } })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Silly</label>
                                <input
                                    type="number"
                                    value={newMock.mistakeBreakdown.silly}
                                    onChange={(e) => setNewMock({ ...newMock, mistakeBreakdown: { ...newMock.mistakeBreakdown, silly: parseInt(e.target.value) || 0 } })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Time Pressure</label>
                                <input
                                    type="number"
                                    value={newMock.mistakeBreakdown.timePressure}
                                    onChange={(e) => setNewMock({ ...newMock, mistakeBreakdown: { ...newMock.mistakeBreakdown, timePressure: parseInt(e.target.value) || 0 } })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                        >
                            Save Result
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Mocks;
