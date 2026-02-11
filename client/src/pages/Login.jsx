import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Lock, ArrowRight } from 'lucide-react';

// WHY: Simple code-based login page
// Focuses on speed and minimal distraction
const Login = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const login = useStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(code);
        if (success) {
            navigate('/');
        } else {
            setError('Incorrect access code');
            setCode('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                        <Lock className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">GATE 2026</h1>
                    <p className="text-slate-400">Enter access code to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setError('');
                            }}
                            placeholder="Access Code"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-center tracking-widest text-lg"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
                    >
                        Enter System
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-600 uppercase tracking-widest">
                        Discipline • Consistency • Execution
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
