import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Plus, Target, Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { cn } from '../lib/utils';
import useViewer from '../lib/useViewer';

// WHY: Execution-first Dashboard
const Subjects = () => {
    const navigate = useNavigate();
    const isViewer = useViewer();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Quick Counter Animation State
    const [animatingId, setAnimatingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        weightage: '',
        targetDate: ''
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await api.get('/api/subjects');
            setSubjects(res.data.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/subjects', formData);
            setIsCreateModalOpen(false);
            setFormData({ name: '', weightage: '', targetDate: '' });
            fetchSubjects();
        } catch (error) {
            console.error("Error creating subject:", error);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/subjects/${selectedSubject._id}`, formData);
            setIsEditModalOpen(false);
            setSelectedSubject(null);
            setFormData({ name: '', weightage: '', targetDate: '' });
            fetchSubjects();
        } catch (error) {
            console.error("Error updating subject:", error);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure? This will delete all tasks and stats for this subject.")) {
            try {
                await api.delete(`/api/subjects/${id}`);
                fetchSubjects();
            } catch (error) {
                console.error("Error deleting subject:", error);
            }
        }
    };

    const openEditModal = (e, subject) => {
        e.stopPropagation();
        setSelectedSubject(subject);
        setFormData({
            name: subject.name,
            weightage: subject.weightage,
            targetDate: new Date(subject.targetDate).toISOString().split('T')[0]
        });
        setIsEditModalOpen(true);
    };

    const quickIncrement = async (e, subjectId, type) => {
        e.stopPropagation(); // Prevent card click
        setAnimatingId(`${subjectId}-${type}`);

        try {
            const payload = {};
            if (type === 'pyq') payload.pyqCount = 1;
            if (type === 'problem') payload.problemCount = 1;
            if (type === 'revision') payload.revisionCount = 1;

            await api.patch(`/api/subjects/${subjectId}/counters`, payload);
            fetchSubjects();

            setTimeout(() => setAnimatingId(null), 500);
        } catch (error) {
            console.error("Error updating counters:", error);
            setAnimatingId(null);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>Loading Engine...</div>;

    return (
        <div className="min-h-[calc(100vh-6rem)] bg-[#050505] space-y-6 sm:space-y-8 p-4 sm:p-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-[#111] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-transparent" />
                <div className="z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                        <Target className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500" />
                        Execution Engine
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm sm:text-base">Focus on the process. Data doesn't lie.</p>
                </div>
                {!isViewer && (
                    <button
                        onClick={() => {
                            setFormData({ name: '', weightage: '', targetDate: '' });
                            setIsCreateModalOpen(true);
                        }}
                        className="z-10 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
                    >
                        <Plus className="w-5 h-5" /> Add Subject
                    </button>
                )}
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                    <div
                        key={subject._id}
                        onClick={() => navigate(`/subjects/${subject._id}`)}
                        className="bg-[#111] border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]"
                    >
                        {/* Edit/Delete Actions — hidden for viewers */}
                        {!isViewer && (
                            <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => openEditModal(e, subject)}
                                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, subject._id)}
                                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Progress Bar Background */}
                        <div className="absolute top-0 left-0 h-1 bg-white/5 w-full">
                            <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${subject.progress}%` }} />
                        </div>

                        <div className="flex justify-between items-start mb-6 pt-4">
                            <div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                                    {subject.name}
                                </h3>
                                <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-500">
                                    <span className="bg-[#050505] px-2 py-1 rounded border border-white/10 text-emerald-500">
                                        Weight: {subject.weightage}%
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(subject.targetDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-black text-[#222] group-hover:text-[#333] transition-colors">
                                    {subject.progress}%
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions — click-to-increment for owner, display-only for viewer */}
                        <div className="grid grid-cols-3 gap-3">
                            {[['pyq', 'PYQs', subject.totalPYQs, 'emerald'], ['problem', 'Probs', subject.totalProblems, 'cyan'], ['revision', 'Revs', subject.totalRevisions, 'purple']].map(([type, label, count, color]) => (
                                <div
                                    key={type}
                                    onClick={!isViewer ? (e) => quickIncrement(e, subject._id, type) : undefined}
                                    className={cn(
                                        "relative overflow-hidden bg-[#050505] border border-white/5 p-3 rounded-xl transition-all group/btn",
                                        !isViewer && `hover:bg-${color}-500/10 hover:border-${color}-500/30 cursor-pointer`,
                                        isViewer && 'cursor-default',
                                        animatingId === `${subject._id}-${type}` && `ring-2 ring-${color}-500`
                                    )}
                                >
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">{label}</div>
                                    <div className={`text-xl font-bold text-white ${!isViewer ? `group-hover/btn:text-${color}-400` : ''}`}>{count}</div>
                                    {!isViewer && (
                                        <div className="absolute top-2 right-2 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                                            <Plus className={`w-3 h-3 text-${color}-500`} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="New Execution Plan">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Subject Name</label>
                        <input
                            required
                            autoFocus
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                            placeholder="e.g. Engineering Mathematics"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Weightage (%)</label>
                            <input
                                required
                                type="number"
                                min="1"
                                max="100"
                                value={formData.weightage}
                                onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                                placeholder="15"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Target Date</label>
                            <input
                                required
                                type="date"
                                value={formData.targetDate}
                                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 transition-all mt-4"
                    >
                        Initiate Plan
                    </button>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Execution Plan">
                <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Subject Name</label>
                        <input
                            required
                            autoFocus
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Weightage (%)</label>
                            <input
                                required
                                type="number"
                                min="1"
                                max="100"
                                value={formData.weightage}
                                onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Target Date</label>
                            <input
                                required
                                type="date"
                                value={formData.targetDate}
                                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95 transition-all mt-4"
                    >
                        Update Plan
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Subjects;
