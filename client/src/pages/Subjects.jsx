import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// ... (imports remain)
import { BookOpen, Calendar, Plus, Target, Zap, CheckCircle2, Pencil, Trash2, X } from 'lucide-react';
import Modal from '../components/Modal';
import { cn } from '../lib/utils'; // Keep existing

// WHY: Execution-first Dashboard
const Subjects = () => {
    const navigate = useNavigate();
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
            const res = await axios.get('http://localhost:5000/api/subjects');
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
            await axios.post('http://localhost:5000/api/subjects', formData);
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
            await axios.put(`http://localhost:5000/api/subjects/${selectedSubject._id}`, formData);
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
                await axios.delete(`http://localhost:5000/api/subjects/${id}`);
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
            targetDate: subject.targetDate ? new Date(subject.targetDate).toISOString().split('T')[0] : ''
        });
        setIsEditModalOpen(true);
    };

    const quickIncrement = async (e, subjectId, type) => {
        e.stopPropagation();
        setAnimatingId(`${subjectId}-${type}`);

        try {
            const payload = {};
            if (type === 'pyq') payload.pyqCount = 1;
            if (type === 'problem') payload.problemCount = 1;
            if (type === 'revision') payload.revisionCount = 1;

            await axios.patch(`http://localhost:5000/api/subjects/${subjectId}/counters`, payload);
            fetchSubjects();

            setTimeout(() => setAnimatingId(null), 500);
        } catch (error) {
            console.error("Error updating counters:", error);
            setAnimatingId(null);
        }
    };

    if (loading) return <div className="min-h-screen bg-base-bg text-accent-emerald flex items-center justify-center font-black uppercase tracking-[0.4em] animate-pulse">Syncing Syllabus Hub...</div>;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-5xl font-black text-text-main tracking-tighter flex items-center gap-4 uppercase italic">
                        Execution <span className="text-accent-emerald drop-shadow-[0_0_10px_rgba(0,255,156,0.3)]">Engine</span>
                    </h1>
                    <p className="text-text-secondary mt-2 font-bold uppercase tracking-[0.25em] text-xs flex items-center gap-2">
                        <div className="w-2 h-0.5 bg-accent-emerald"></div> Focus on the process. Data doesn't lie.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ name: '', weightage: '', targetDate: '' });
                        setIsCreateModalOpen(true);
                    }}
                    className="bg-accent-emerald hover:bg-accent-hover text-black px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-[0_0_25px_rgba(0,255,156,0.3)] active:scale-95 transition-all uppercase tracking-tighter text-sm italic"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" /> Deploy New Logic
                </button>
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {subjects.map((subject) => (
                    <div
                        key={subject._id}
                        onClick={() => navigate(`/subjects/${subject._id}`)}
                        className="glass-card p-8 group cursor-pointer relative overflow-hidden"
                    >
                        {/* Progress Indicator */}
                        <div className="absolute top-0 left-0 h-1.5 bg-white/5 w-full">
                            <div
                                className="h-full bg-accent-emerald shadow-[0_0_15px_rgba(0,255,156,0.6)] transition-all duration-1000"
                                style={{ width: `${subject.progress}%` }}
                            />
                        </div>

                        {/* Top Line */}
                        <div className="flex justify-between items-start mb-8 pt-4">
                            <div>
                                <h3 className="text-3xl font-black text-text-main group-hover:text-accent-emerald transition-colors tracking-tighter uppercase italic line-clamp-1">
                                    {subject.name}
                                </h3>
                                <div className="flex items-center gap-4 mt-3 text-[10px] uppercase font-black tracking-widest text-text-muted">
                                    <span className="bg-black/40 px-2 py-1 rounded text-accent-emerald border border-white/5">
                                        WT: {subject.weightage}%
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        {subject.targetDate ? format(new Date(subject.targetDate), 'MMM dd, yyyy') : 'NO DATE'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-black text-white/5 group-hover:text-accent-emerald/10 transition-colors italic">
                                    {Math.round(subject.progress)}%
                                </div>
                            </div>
                        </div>

                        {/* Counters Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {[
                                { label: 'PYQ', val: subject.totalPYQs, type: 'pyq', color: 'emerald' },
                                { label: 'Probs', val: subject.totalProblems, type: 'problem', color: 'blue' },
                                { label: 'Revs', val: subject.totalRevisions, type: 'revision', color: 'purple' }
                            ].map((counter) => (
                                <button
                                    key={counter.type}
                                    onClick={(e) => quickIncrement(e, subject._id, counter.type)}
                                    className={cn(
                                        "bg-black/20 border border-white/5 p-4 rounded-2xl transition-all relative group/btn overflow-hidden",
                                        animatingId === `${subject._id}-${counter.type}` && "scale-95 border-accent-emerald"
                                    )}
                                >
                                    <div className="text-[9px] text-text-muted uppercase tracking-widest font-black mb-1">{counter.label}</div>
                                    <div className="text-2xl font-black text-text-main group-hover/btn:neon-text">{counter.val}</div>
                                    <div className="absolute inset-0 bg-accent-emerald/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>

                        {/* Hidden Actions */}
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={(e) => openEditModal(e, subject)}
                                className="p-2.5 bg-white/5 rounded-xl text-text-muted hover:text-white hover:bg-white/10 transition-all"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => handleDelete(e, subject._id)}
                                className="p-2.5 bg-red-500/10 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/20 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals with Premium Styling */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title={<span className="font-black italic uppercase tracking-tighter text-2xl">Initialize <span className="text-accent-emerald">Module</span></span>}
            >
                <form onSubmit={handleCreate} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Directive Name</label>
                        <input
                            required
                            autoFocus
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-text-main focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald/20 outline-none transition-all font-bold placeholder:text-white/10"
                            placeholder="CORE ARCHITECTURE..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Priority (%)</label>
                            <input
                                required
                                type="number"
                                min="1" max="100"
                                value={formData.weightage}
                                onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-text-main focus:border-accent-emerald outline-none font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Final Sync</label>
                            <input
                                required
                                type="date"
                                value={formData.targetDate}
                                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-text-main focus:border-accent-emerald outline-none font-bold"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-accent-emerald hover:bg-accent-hover text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(0,255,156,0.3)] active:scale-[0.98] transition-all mt-4 uppercase italic tracking-tighter"
                    >
                        Activate Deployment
                    </button>
                </form>
            </Modal>

            {/* Edit Modal mirroring Create style */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={<span className="font-black italic uppercase tracking-tighter text-2xl">Reconfigure <span className="text-accent-emerald">Logic</span></span>}
            >
                <form onSubmit={handleEdit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Subject Label</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-text-main focus:border-accent-emerald outline-none font-bold"
                        />
                    </div>
                    {/* ... other fields similar to create ... */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Priority (%)</label>
                            <input
                                required
                                type="number"
                                value={formData.weightage}
                                onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-text-main focus:border-accent-emerald outline-none font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Final Sync</label>
                            <input
                                required
                                type="date"
                                value={formData.targetDate}
                                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-text-main focus:border-accent-emerald outline-none font-bold"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-accent-emerald hover:bg-accent-hover text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(0,255,156,0.2)] active:scale-[0.98] transition-all mt-4 uppercase italic tracking-tighter"
                    >
                        Update Configuration
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Subjects;
