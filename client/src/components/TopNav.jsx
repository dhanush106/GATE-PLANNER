import { useNavigate } from 'react-router-dom';
import {
    LogOut,
    Sun,
    Moon,
    User,
    Bell,
    Eye,
    Menu
} from 'lucide-react';
import useStore from '../store/useStore';
import useViewer from '../lib/useViewer';
import { motion } from 'framer-motion';

const TopNav = () => {
    const navigate = useNavigate();
    const { logout, userName, isDarkMode, toggleTheme, toggleMobileSidebar } = useStore();
    const isViewer = useViewer();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <header
                className="fixed top-0 right-0 left-0 md:left-64 z-30 glass transition-all duration-300"
                style={{ borderBottom: '1px solid var(--glass-border)' }}
            >
                {/* Main nav row */}
                <div className="h-16 px-4 md:px-8 flex items-center justify-between gap-3">

                    {/* Left: Hamburger (mobile) + Brand (mobile) */}
                    <div className="flex items-center gap-3">
                        {/* Hamburger — mobile only */}
                        <button
                            onClick={toggleMobileSidebar}
                            className="neuo-btn p-2.5 md:hidden"
                            title="Open menu"
                            style={{ color: 'var(--muted-foreground)' }}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Mobile Brand */}
                        <span className="text-lg font-black tracking-tighter md:hidden" style={{ color: 'var(--foreground)' }}>
                            GATE<span style={{ color: 'var(--primary)' }}>2026</span>
                        </span>

                        {/* Desktop left spacer */}
                        <div className="hidden md:flex items-center gap-4" />
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">

                        {/* Viewer badge (desktop) */}
                        {isViewer && (
                            <div
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                                style={{
                                    background: 'rgba(245, 158, 11, 0.12)',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                    color: '#f59e0b',
                                }}
                            >
                                <Eye className="w-3.5 h-3.5" />
                                View Only
                            </div>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="neuo-btn p-2.5"
                            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            style={{ color: 'var(--muted-foreground)' }}
                        >
                            <motion.div
                                key={isDarkMode ? 'dark' : 'light'}
                                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                transition={{ duration: 0.25 }}
                            >
                                {isDarkMode
                                    ? <Sun className="w-4.5 h-4.5" />
                                    : <Moon className="w-4.5 h-4.5" />
                                }
                            </motion.div>
                        </button>

                        {/* Notifications */}
                        <button
                            className="neuo-btn p-2.5"
                            title="Notifications"
                            style={{ color: 'var(--muted-foreground)' }}
                        >
                            <Bell className="w-4.5 h-4.5" />
                        </button>

                        {/* Divider */}
                        <div
                            className="h-8 w-px mx-1 hidden md:block"
                            style={{ background: 'var(--glass-border)' }}
                        />

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-1">
                            <div className="hidden sm:flex flex-col items-end">
                                <span
                                    className="text-[10px] font-bold uppercase tracking-widest leading-tight"
                                    style={{ color: isViewer ? '#f59e0b' : 'var(--muted-foreground)' }}
                                >
                                    {isViewer ? 'Viewer' : 'Owner'}
                                </span>
                                <span
                                    className="text-sm font-bold truncate max-w-[120px]"
                                    style={{ color: 'var(--foreground)' }}
                                >
                                    {userName}
                                </span>
                            </div>
                            <div
                                className="neuo-btn p-2.5 cursor-pointer"
                                style={{ color: isViewer ? '#f59e0b' : 'var(--muted-foreground)' }}
                            >
                                {isViewer ? <Eye className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="neuo-btn p-2.5"
                            title="Logout"
                            style={{ color: 'var(--muted-foreground)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--destructive)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-foreground)'}
                        >
                            <LogOut className="w-4.5 h-4.5" />
                        </button>
                    </div>
                </div>

                {/* Viewer banner strip */}
                {isViewer && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 py-1.5 text-xs font-semibold"
                        style={{
                            background: 'linear-gradient(90deg, rgba(245,158,11,0.08), rgba(245,158,11,0.14), rgba(245,158,11,0.08))',
                            borderTop: '1px solid rgba(245,158,11,0.2)',
                            color: '#d97706',
                            letterSpacing: '0.04em',
                        }}
                    >
                        <Eye className="w-3 h-3" />
                        <span className="hidden sm:inline">Read-only access — You are viewing Dhanush's GATE 2026 preparation</span>
                        <span className="sm:hidden">View-only mode</span>
                    </motion.div>
                )}
            </header>
        </>
    );
};

export default TopNav;
