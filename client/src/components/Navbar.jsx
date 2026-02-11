import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    RotateCcw,
    FileText,
    History,
    LogOut,
    Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import useStore from '../store/useStore';

const Navbar = () => {
    const navigate = useNavigate();
    const logout = useStore(state => state.logout);
    const userName = useStore(state => state.userName);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Subjects', path: '/subjects', icon: BookOpen },
        { label: 'Revisions', path: '/revisions', icon: RotateCcw },
        { label: 'Mocks', path: '/mocks', icon: FileText },
        { label: 'PYQs', path: '/pyqs', icon: History },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl border-b border-white/5 shadow-2xl" />

            <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Brand/Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-emerald-500 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
                        <Zap className="w-5 h-5 text-black fill-current" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-white bg-clip-text">
                        GATE<span className="text-emerald-500">2026</span>
                    </span>
                </Link>

                {/* Main Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Aspirant</span>
                        <span className="text-sm text-white font-medium">{userName}</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
