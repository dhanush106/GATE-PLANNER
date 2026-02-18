import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Lock, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const login = useStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 400)); // brief haptic delay
        const success = login(code);
        if (success) {
            navigate('/');
        } else {
            setError('Incorrect access code');
            setCode('');
        }
        setIsLoading(false);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ background: 'var(--background)' }}
        >
            {/* Ambient orbs */}
            <div style={{
                position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0
            }}>
                <div style={{
                    position: 'absolute', top: '15%', left: '20%',
                    width: 340, height: 340,
                    background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.12) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(40px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '20%', right: '15%',
                    width: 280, height: 280,
                    background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.08) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(50px)'
                }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="glass-card relative z-10 w-full max-w-md p-10"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="neuo-card inline-flex items-center justify-center w-20 h-20 mx-auto mb-6"
                        style={{ borderRadius: '50%' }}
                    >
                        <Zap
                            className="w-9 h-9"
                            style={{ color: 'var(--primary)' }}
                            fill="currentColor"
                        />
                    </motion.div>

                    <h1 className="text-4xl font-black tracking-tight mb-2"
                        style={{ color: 'var(--foreground)' }}>
                        GATE<span style={{ color: 'var(--primary)' }}>2026</span>
                    </h1>
                    <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                        Enter your access code to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <div className="relative">
                            <Lock
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                                style={{ color: 'var(--muted-foreground)' }}
                            />
                            <input
                                type="password"
                                value={code}
                                onChange={(e) => { setCode(e.target.value); setError(''); }}
                                placeholder="••••••••"
                                className="neuo-input w-full pl-11 pr-4 py-4 text-center tracking-[0.3em] text-lg font-bold"
                                autoFocus
                            />
                        </div>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm mt-2.5 text-center font-semibold"
                                style={{ color: 'var(--destructive)' }}
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="neuo-btn-primary w-full py-4 font-bold text-base flex items-center justify-center gap-2.5 group"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Enter System
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-xs uppercase tracking-[0.25em] font-semibold"
                        style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
                        Discipline • Consistency • Execution
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
