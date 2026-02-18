import { useState, useEffect } from 'react';
import api from '../lib/api';
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
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filters
    const [filterSubject, setFilterSubject] = useState('');

    // Form State
    const [newPYQ, setNewPYQ] = useState({
        subject: '',
        topic: '',
        year: '',
        questionIdentifier: '',
        status: 'Attempted',
        notes: ''
    });

    // Derived state for filtered topics in form
    const formTopics = topics.filter(t => t.subject?._id === newPYQ.subject);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pyqsRes, subjectsRes, topicsRes, statsRes] = await Promise.all([
                api.get('/api/pyqs/video/all'),
                api.get('/api/subjects'),
                api.get('/api/topics'),
                api.get('/api/pyqs/stats')
            ]);

            setSubjects(subjectsRes.data.data);
            setTopics(topicsRes.data.data);
            setStats(statsRes.data.data);

            if (subjectsRes.data.data.length > 0) {
                const firstSubId = subjectsRes.data.data[0]._id;
                setFilterSubject(firstSubId);
                const listRes = await api.get(`/api/pyqs/subject/${firstSubId}`);
                setPyqs(listRes.data.data);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectFilterChange = async (subject) => {
        setFilterSubject(subject);
        if (subject) {
            try {
                const res = await api.get(`/api/pyqs/subject/${subject}`);
                setPyqs(res.data.data);
            } catch (error) { console.error(error); }
        } else {
            setPyqs([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/pyqs', newPYQ);
            setIsModalOpen(false);
            setNewPYQ({ subject: '', topic: '', year: '', questionIdentifier: '', status: 'Attempted', notes: '' });
            // Refresh stats and list
            const statsRes = await api.get('/api/pyqs/stats');
            setStats(statsRes.data.data);
            if (filterSubject === newPYQ.subject) {
                const listRes = await api.get(`/api/pyqs/subject/${filterSubject}`);
                setPyqs(listRes.data.data);
            }
        } catch (error) {
            console.error("Error creating PYQ:", error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]" style={{ color: 'var(--foreground)' }}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading PYQs...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <BrainCircuit className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                        </div>
                        PYQ Tracker
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Track previous year questions by subject and topic.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-black shadow-glow transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Log Question
                </button>
            </header>

            {/* STATS SUMMARY */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bento-card">
                        <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-2">Total Attempted</div>
                        <div className="text-3xl font-black">{stats.totalAttempted}</div>
                    </div>
                    <div className="bento-card">
                        <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-2">Solved Correctly</div>
                        <div className="text-3xl font-black text-emerald-500">{stats.totalSolved}</div>
                    </div>
                    <div className="bento-card col-span-2 sm:col-span-1">
                        <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-2">Win Rate</div>
                        <div className="text-3xl font-black text-primary">
                            {stats.totalAttempted > 0 ? Math.round((stats.totalSolved / stats.totalAttempted) * 100) : 0}%
                        </div>
                    </div>
                </div>
            )}

            {/* FILTERS & LIST */}
            <div className="bento-card">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                    <select
                        value={filterSubject}
                        onChange={(e) => handleSubjectFilterChange(e.target.value)}
                        className="flex-1 min-w-0 neuo-input px-3 py-2 text-sm"
                        style={{ color: 'var(--foreground)' }}
                    >
                        {subjects.map(s => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-3">
                    {pyqs.map((pyq) => (
                        <div
                            key={pyq._id}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-secondary/30 border border-border p-4 rounded-xl hover:border-primary/20 transition-all"
                        >
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="text-xs font-bold bg-secondary text-foreground px-2 py-0.5 rounded-lg border border-border">
                                        {pyq.year}
                                    </span>
                                    <span className="text-sm font-bold truncate">{pyq.questionIdentifier}</span>
                                    <span className="text-xs text-muted-foreground truncate">• {pyq.topic?.name || 'Unknown Topic'}</span>
                                </div>
                                {pyq.notes && <p className="text-xs text-muted-foreground italic mt-1">{pyq.notes}</p>}
                            </div>

                            <div className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 shrink-0 self-start sm:self-center",
                                pyq.status === 'Solved' && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                                pyq.status === 'Wrong' && "bg-destructive/10 text-destructive border border-destructive/20",
                                pyq.status === 'Attempted' && "bg-primary/10 text-primary border border-primary/20"
                            )}>
                                {pyq.status === 'Solved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                {pyq.status === 'Wrong' && <XCircle className="w-3.5 h-3.5" />}
                                {pyq.status === 'Attempted' && <HelpCircle className="w-3.5 h-3.5" />}
                                {pyq.status}
                            </div>
                        </div>
                    ))}
                    {pyqs.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground italic">
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
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Subject</label>
                        <select
                            required
                            value={newPYQ.subject}
                            onChange={(e) => setNewPYQ({ ...newPYQ, subject: e.target.value, video: '' })}
                            className="w-full neuo-input px-3 py-2.5 text-sm"
                            style={{ color: 'var(--foreground)' }}
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Topic</label>
                        <select
                            required
                            disabled={!newPYQ.subject}
                            value={newPYQ.topic}
                            onChange={(e) => setNewPYQ({ ...newPYQ, topic: e.target.value })}
                            className="w-full neuo-input px-3 py-2.5 text-sm disabled:opacity-50"
                            style={{ color: 'var(--foreground)' }}
                        >
                            <option value="">Select Topic</option>
                            {formTopics.map(t => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Year</label>
                            <input
                                type="number"
                                placeholder="2024"
                                required
                                value={newPYQ.year}
                                onChange={(e) => setNewPYQ({ ...newPYQ, year: e.target.value })}
                                className="w-full neuo-input px-3 py-2.5 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Question ID</label>
                            <input
                                type="text"
                                placeholder="Q15"
                                required
                                value={newPYQ.questionIdentifier}
                                onChange={(e) => setNewPYQ({ ...newPYQ, questionIdentifier: e.target.value })}
                                className="w-full neuo-input px-3 py-2.5 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Result</label>
                        <div className="flex flex-wrap gap-3">
                            {['Solved', 'Wrong', 'Attempted'].map(status => (
                                <label key={status} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status}
                                        checked={newPYQ.status === status}
                                        onChange={(e) => setNewPYQ({ ...newPYQ, status: e.target.value })}
                                        className="accent-primary"
                                    />
                                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Notes (Optional)</label>
                        <textarea
                            value={newPYQ.notes}
                            onChange={(e) => setNewPYQ({ ...newPYQ, notes: e.target.value })}
                            className="w-full neuo-input px-3 py-2.5 text-sm h-20 resize-none"
                            placeholder="What did you learn?"
                        />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="neuo-btn px-4 py-2.5 text-sm font-semibold w-full sm:w-auto"
                            style={{ color: 'var(--muted-foreground)' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="neuo-btn-primary px-6 py-2.5 text-sm font-black w-full sm:w-auto"
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
