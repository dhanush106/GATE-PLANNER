import { useNavigate } from 'react-router-dom';
import {
    LogOut,
    Sun,
    Moon,
    User,
    Bell
} from 'lucide-react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';

const TopNav = () => {
    const navigate = useNavigate();
    const { logout, userName, isDarkMode, toggleTheme } = useStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header
            className="fixed top-0 right-0 left-0 md:left-64 h-16 z-30 glass transition-all duration-300"
            style={{ borderBottom: '1px solid var(--glass-border)' }}
        >
            <div className="h-full px-4 md:px-8 flex items-center justify-between">

                {/* Mobile Brand */}
                <div className="flex items-center md:hidden">
                    <span className="text-lg font-black tracking-tighter" style={{ color: 'var(--foreground)' }}>
                        GATE<span style={{ color: 'var(--primary)' }}>2026</span>
                    </span>
                </div>

                {/* Desktop left — breadcrumb placeholder */}
                <div className="hidden md:flex items-center gap-4" />

                {/* Right Side Actions */}
                <div className="flex items-center gap-2">

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
                                style={{ color: 'var(--muted-foreground)' }}
                            >
                                Aspirant
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
                            style={{ color: 'var(--muted-foreground)' }}
                        >
                            <User className="w-4.5 h-4.5" />
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
        </header>
    );
};

export default TopNav;
