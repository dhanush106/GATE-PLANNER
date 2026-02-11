import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

// WHY: Reusable KPI card for dashboard metrics
// Minimal, clean design with icon and trend support
const KPICard = ({ title, value, icon: Icon, trend, trendLabel, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "glass-card p-6 relative overflow-hidden group",
                className
            )}
        >
            {/* Subtle Gradient Glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-emerald/5 rounded-full blur-2xl group-hover:bg-accent-emerald/10 transition-colors" />

            <div className="flex justify-between items-start mb-4">
                <h3 className="text-text-secondary text-xs font-bold uppercase tracking-[0.15em]">{title}</h3>
                <div className="p-2 bg-accent-emerald/5 rounded-lg border border-accent-emerald/10 group-hover:border-accent-emerald/30 transition-colors">
                    {Icon && <Icon className="w-5 h-5 text-accent-emerald" />}
                </div>
            </div>

            <div className="flex items-end gap-3">
                <div className="text-4xl font-black text-text-main tracking-tight">{value}</div>
                {trend !== undefined && (
                    <div className={cn(
                        "text-[10px] font-bold mb-2 px-2 py-0.5 rounded-full border",
                        trend > 0
                            ? "text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20"
                            : "text-red-400 bg-red-400/10 border-red-400/20"
                    )}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>

            {trendLabel && (
                <p className="text-text-muted text-[10px] font-medium mt-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-1 h-1 bg-accent-emerald rounded-full"></span>
                    {trendLabel}
                </p>
            )}
        </motion.div>
    );
};

export default KPICard;
