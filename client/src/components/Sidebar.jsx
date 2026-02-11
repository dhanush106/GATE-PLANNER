import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    FileText,
    Trophy,
    LogOut,
    Menu,
    ChevronLeft,
    Flame
} from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Subjects', path: '/subjects', icon: BookOpen },
        { name: 'Revisions', path: '/revisions', icon: Calendar },
        { name: 'PYQs', path: '/pyqs', icon: FileText },
        { name: 'Mocks', path: '/mocks', icon: Trophy },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <aside
            className={cn(
                "h-screen sticky top-0 bg-[#0B0F0E] border-r border-white/5 flex flex-col transition-all duration-300 z-50",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header / Logo */}
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent-emerald rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,156,0.3)]">
                            <Flame className="w-5 h-5 text-black fill-black" />
                        </div>
                        <span className="font-bold text-xl tracking-tighter neon-text">LIFEOS</span>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-accent-emerald transition-colors mx-auto"
                >
                    {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group relative",
                            isActive
                                ? "bg-accent-emerald/10 text-accent-emerald border-l-4 border-accent-emerald"
                                : "text-text-secondary hover:bg-white/5 hover:text-text-main"
                        )}
                        title={isCollapsed ? item.name : ''}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 transition-transform group-hover:scale-110",
                            isCollapsed && "mx-auto"
                        )} />
                        {!isCollapsed && <span className="font-medium">{item.name}</span>}
                        {isActive && !isCollapsed && (
                            <div className="absolute inset-y-0 -left-3 w-1 bg-accent-emerald shadow-[0_0_10px_rgba(0,255,156,0.8)]" />
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-colors text-text-muted hover:text-red-400 hover:bg-red-500/5 group",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
