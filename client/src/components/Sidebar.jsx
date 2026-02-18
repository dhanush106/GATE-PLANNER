import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    RotateCcw,
    FileText,
    History,
    Zap,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Subjects', path: '/subjects', icon: BookOpen },
        { label: 'Revisions', path: '/revisions', icon: RotateCcw },
        { label: 'Mocks', path: '/mocks', icon: FileText },
        { label: 'PYQs', path: '/pyqs', icon: History },
    ];

    return (
        <aside
            className={cn(
                "relative z-40 flex flex-col h-screen glass transition-all duration-300 ease-in-out md:flex",
                isCollapsed ? "w-20" : "w-64"
            )}
            style={{ borderRight: '1px solid var(--glass-border)' }}
        >
            {/* Header */}
            <div
                className="flex items-center h-16 px-5"
                style={{ borderBottom: '1px solid var(--glass-border)' }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="neuo-card flex items-center justify-center shrink-0"
                        style={{
                            width: 38, height: 38,
                            borderRadius: 'var(--radius-md)',
                            background: `linear-gradient(135deg, rgba(var(--primary-rgb), 0.85), rgba(var(--primary-rgb), 0.6))`,
                            border: `1px solid rgba(var(--primary-rgb), 0.4)`,
                        }}
                    >
                        <Zap className="w-4.5 h-4.5" style={{ color: 'var(--primary-foreground)' }} fill="currentColor" />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                key="logo-text"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.2 }}
                                className="text-xl font-black tracking-tighter truncate"
                                style={{ color: 'var(--foreground)' }}
                            >
                                GATE<span style={{ color: 'var(--primary)' }}>2026</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => cn(
                            "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                            isCollapsed && "justify-center",
                            isActive
                                ? "neuo-inset"
                                : "hover:bg-[rgba(var(--primary-rgb),0.06)]"
                        )}
                        style={({ isActive }) => ({
                            color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110")}
                                    style={{ color: isActive ? 'var(--primary)' : 'inherit' }}
                                />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            key={`label-${item.path}`}
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -6 }}
                                            transition={{ duration: 0.18 }}
                                            className="truncate"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="neuo-btn absolute -right-3.5 top-20 p-1.5 hidden md:flex items-center justify-center"
                style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    color: 'var(--muted-foreground)',
                }}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {isCollapsed
                    ? <ChevronRight size={13} />
                    : <ChevronLeft size={13} />
                }
            </button>

            {/* Footer Status */}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        key="footer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-3 m-3"
                    >
                        <div
                            className="neuo-inset flex items-center gap-3 px-4 py-3"
                            style={{ borderRadius: 'var(--radius-md)' }}
                        >
                            <div
                                className="w-2 h-2 rounded-full animate-glow-pulse shrink-0"
                                style={{ background: 'var(--primary)', boxShadow: 'var(--glow-sm)' }}
                            />
                            <span className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                                System Online
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </aside>
    );
};

export default Sidebar;
