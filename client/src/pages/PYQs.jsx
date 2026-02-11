import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BrainCircuit, Plus, Filter, CheckCircle2, XCircle, HelpCircle
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import Modal from '../components/Modal';
import ProgressBar from '../components/ProgressBar';

// WHY: PYQ (Previous Year Questions) tracker
// Critical for GATE rank. Tracks attempted questions per subject/video.
const PYQs = () => {
    const [pyqs, setPyqs] = useState([]);
    const [stats, setStats] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [videos, setVideos] = useState([]); // Actually topics now
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filters
    const [filterSubject, setFilterSubject] = useState('');

    // Form State
    const [newPYQ, setNewPYQ] = useState({
        subject: '',
        video: '',
        year: '', // e.g., 2024
        questionIdentifier: '', // e.g., Q15
        status: 'Attempted',
        notes: ''
    });

    // Derived state for filtered videos (topics) in form
    const formVideos = videos.filter(v => v.subject._id === newPYQ.subject);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pyqsRes, subjectsRes, videosRes, statsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/pyqs/video/all'), // Hack: need all PYQs endpoint or ignore
                axios.get('http://localhost:5000/api/subjects'),
                axios.get('http://localhost:5000/api/topics'), // Changed from videos
                axios.get('http://localhost:5000/api/pyqs/stats')
            ]);

            setSubjects(subjectsRes.data.data);
            setVideos(videosRes.data.data);
            setStats(statsRes.data.data);

            if (subjectsRes.data.data.length > 0) {
                const firstSubId = subjectsRes.data.data[0]._id;
                setFilterSubject(firstSubId);
                const listRes = await axios.get(`http://localhost:5000/api/pyqs/subject/${firstSubId}`);
                setPyqs(listRes.data.data);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectFilterChange = async (subjectId) => {
        setFilterSubject(subjectId);
        if (subjectId) {
            try {
                const res = await axios.get(`http://localhost:5000/api/pyqs/subject/${subjectId}`);
                setPyqs(res.data.data);
            } catch (error) { console.error(error); }
        } else {
            setPyqs([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/pyqs', newPYQ);
            setIsModalOpen(false);
            setNewPYQ({ subject: '', video: '', year: '', questionIdentifier: '', status: 'Attempted', notes: '' });
            // Refresh stats and list
            const statsRes = await axios.get('http://localhost:5000/api/pyqs/stats');
            setStats(statsRes.data.data);
            if (filterSubject === newPYQ.subject) {
                const listRes = await axios.get(`http://localhost:5000/api/pyqs/subject/${filterSubject}`);
                setPyqs(listRes.data.data);
            }
        } catch (error) {
            console.error("Error creating PYQ:", error);
        }
    };

    if (loading) return <div className="text-white p-8">Loading PYQs...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-emerald-500" />
                    PYQ Tracker
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" /> Log Question
                </button>
            </div>

            {/* STATS SUMMARY */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-500 text-xs uppercase">Total Attempted</div>
                        <div className="text-3xl font-bold text-white">{stats.totalAttempted}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-500 text-xs uppercase">Solved Correctly</div>
                        <div className="text-3xl font-bold text-emerald-500">{stats.totalSolved}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-slate-500 text-xs uppercase">Win Rate</div>
                        <div className="text-3xl font-bold text-blue-500">
                            {stats.totalAttempted > 0 ? Math.round((stats.totalSolved / stats.totalAttempted) * 100) : 0}%
                        </div>
                    </div>
                </div>
            )}

            {/* FILTERS & LIST */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select
                        value={filterSubject}
                        onChange={(e) => handleSubjectFilterChange(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                        {subjects.map(s => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-3">
                    {pyqs.map((pyq) => (
                        <div key={pyq._id} className="flex justify-between items-center bg-slate-950/50 border border-slate-800 p-4 rounded-lg">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                                        {pyq.year}
                                    </span>
                                    <span className="text-sm font-medium text-slate-200">{pyq.questionIdentifier}</span>
                                    <span className="text-xs text-slate-500">• {pyq.video?.title || 'Unknown Topic'}</span>
                                </div>
                                {pyq.notes && <p className="text-xs text-slate-500 italic mt-1">{pyq.notes}</p>}
                            </div>

                            <div className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1.5",
                                pyq.status === 'Solved' && "bg-emerald-900/30 text-emerald-400",
                                pyq.status === 'Wrong' && "bg-red-900/30 text-red-400",
                                pyq.status === 'Attempted' && "bg-blue-900/30 text-blue-400"
                            )}>
                                {pyq.status === 'Solved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                {pyq.status === 'Wrong' && <XCircle className="w-3.5 h-3.5" />}
                                {pyq.status === 'Attempted' && <HelpCircle className="w-3.5 h-3.5" />}
                                {pyq.status}
                            </div>
                        </div>
                    ))}
                    {pyqs.length === 0 && (
                        <div className="text-center py-8 text-slate-500 italic">
                            No PYQs logged for this subject yet.
                        </div>
                    )}
                </div>
            </div>

            {/* ADD PYQ MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Log PYQ Attempt"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
                        <select
                            required
                            value={newPYQ.subject}
                            onChange={(e) => setNewPYQ({ ...newPYQ, subject: e.target.value, video: '' })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Topic</label>
                        <select
                            required
                            disabled={!newPYQ.subject}
                            value={newPYQ.video}
                            onChange={(e) => setNewPYQ({ ...newPYQ, video: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                        >
                            <option value="">Select Topic</option>
                            {formVideos.map(v => (
                                <option key={v._id} value={v._id}>{v.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Year</label>
                            <input
                                type="number"
                                placeholder="2024"
                                required
                                value={newPYQ.year}
                                onChange={(e) => setNewPYQ({ ...newPYQ, year: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Question ID</label>
                            <input
                                type="text"
                                placeholder="Q15"
                                required
                                value={newPYQ.questionIdentifier}
                                onChange={(e) => setNewPYQ({ ...newPYQ, questionIdentifier: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Result</label>
                        <div className="flex gap-4">
                            {['Solved', 'Wrong', 'Attempted'].map(status => (
                                <label key={status} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status}
                                        checked={newPYQ.status === status}
                                        onChange={(e) => setNewPYQ({ ...newPYQ, status: e.target.value })}
                                        className="text-blue-600 focus:ring-blue-500 bg-slate-950 border-slate-800"
                                    />
                                    <span className="text-slate-300 text-sm">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Notes (Optional)</label>
                        <textarea
                            value={newPYQ.notes}
                            onChange={(e) => setNewPYQ({ ...newPYQ, notes: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 h-20"
                            placeholder="What did you learn?"
                        />
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
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                        >
                            Log PYQ
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PYQs;
