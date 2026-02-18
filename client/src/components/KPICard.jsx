import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, icon: Icon, trend, trendLabel, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn("neuo-card group relative overflow-hidden p-6", className)}
        >
            {/* Ambient glow blob */}
            <div
                className="absolute -right-6 -top-6 w-28 h-28 rounded-full transition-all duration-500 group-hover:scale-125"
                style={{
                    background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.08) 0%, transparent 70%)',
                    filter: 'blur(16px)',
                }}
            />

            {/* Header row */}
            <div className="relative flex justify-between items-start mb-5">
                <h3
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'var(--muted-foreground)' }}
                >
                    {title}
                </h3>
                <div
                    className="neuo-btn p-2.5 group-hover:scale-105 transition-transform duration-300"
                    style={{ borderRadius: 'var(--radius-md)' }}
                >
                    {Icon && (
                        <Icon
                            className="w-4.5 h-4.5 transition-colors duration-300"
                            style={{ color: 'var(--muted-foreground)' }}
                        />
                    )}
                </div>
            </div>

            {/* Value row */}
            <div className="relative flex items-end justify-between">
                <div>
                    <div
                        className="text-4xl font-black tracking-tight"
                        style={{ color: 'var(--foreground)' }}
                    >
                        {value}
                    </div>
                    {trendLabel && (
                        <p
                            className="text-[10px] font-semibold mt-1.5 uppercase tracking-widest"
                            style={{ color: 'var(--muted-foreground)' }}
                        >
                            {trendLabel}
                        </p>
                    )}
                </div>
                {trend != null && (
                    <div
                        className="text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{
                            color: trend > 0 ? '#10b981' : '#ef4444',
                            background: trend > 0
                                ? 'rgba(16, 185, 129, 0.1)'
                                : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${trend > 0 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                        }}
                    >
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default KPICard;
