
import { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import {
    BarChart2,
    BookOpen,
    RotateCcw,
    CheckCircle2,
    BrainCircuit,
    LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import StudyTimer from './StudyTimer';

// WHY: Main navigation component
// Provides quick access to all core features and shows study timer
const Navbar = () => {
    const logout = useStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/', icon: BarChart2, label: 'Dashboard' },
        { to: '/subjects', icon: BookOpen, label: 'Subjects' },
        { to: '/revisions', icon: RotateCcw, label: 'Revisions' },
        { to: '/mocks', icon: CheckCircle2, label: 'Mocks' },
        { to: '/pyqs', icon: BrainCircuit, label: 'PYQs' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-50">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white">
                        G
                    </div>
                    <span className="font-bold text-lg hidden md:block text-slate-100">
                        GATE <span className="text-blue-500">2026</span>
                    </span>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-1 md:gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-slate-800 text-blue-400"
                                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                                )
                            }
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="hidden lg:block">{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Right Section: Timer & Logout */}
                <div className="flex items-center gap-4">
                    <StudyTimer />

                    <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

                    <button
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-800/50"
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
