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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    Mock Analysis
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" /> Log Mock Test
                </button>
            </div>

            {/* TREND CHART */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" /> Performance Trend
                </h2>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mocksData.trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#94a3b8' }}
                                tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            />
                            <YAxis tick={{ fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                itemStyle={{ color: '#f8fafc' }}
                                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                            />
                            <Line
                                type="monotone"
                                dataKey="marks"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Marks"
                            />
                            <Line
                                type="monotone"
                                dataKey="accuracy"
                                stroke="#10b981"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                name="Accuracy %"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* MOCK LIST */}
            <div className="grid grid-cols-1 gap-4">
                {mocksData.mocks.map((mock) => (
                    <div key={mock._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                                <div className="text-slate-500 text-sm mb-1">{formatDate(mock.testDate)}</div>
                                <div className="text-xl font-bold text-white mb-2">
                                    {mock.subjectsCovered.length > 0
                                        ? mock.subjectsCovered.map(s => s.name).join(', ')
                                        : 'Full Length Mock'}
                                </div>

                                {/* Mistakes */}
                                <div className="flex gap-4 mt-3">
                                    <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded">
                                        <AlertOctagon className="w-3 h-3" />
                                        Conceptual: {mock.mistakeBreakdown.conceptual}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-900/20 px-2 py-1 rounded">
                                        <AlertOctagon className="w-3 h-3" />
                                        Silly: {mock.mistakeBreakdown.silly}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">{mock.marksObtained}</div>
                                    <div className="text-xs text-slate-500 uppercase">Marks</div>
                                </div>
                                <div className="text-center">
                                    <div className={cn(
                                        "text-3xl font-bold",
                                        mock.accuracy > 80 ? "text-emerald-500" : mock.accuracy > 50 ? "text-blue-500" : "text-amber-500"
                                    )}>
                                        {Math.round(mock.accuracy)}%
                                    </div>
                                    <div className="text-xs text-slate-500 uppercase">Accuracy</div>
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
