import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

// WHY: Reusable KPI card for dashboard metrics
// Minimal, clean design with icon and trend support
const KPICard = ({ title, value, icon: Icon, trend, trendLabel, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-all",
                className
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
                {Icon && <Icon className="w-5 h-5 text-blue-500/80" />}
            </div>

            <div className="flex items-end gap-2">
                <div className="text-3xl font-bold text-slate-100">{value}</div>
                {trend && (
                    <div className={cn(
                        "text-xs font-medium mb-1.5 px-1.5 py-0.5 rounded",
                        trend > 0 ? "text-emerald-400 bg-emerald-900/20" : "text-red-400 bg-red-900/20"
                    )}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </div>
                )}
            </div>

            {trendLabel && (
                <p className="text-slate-500 text-xs mt-1">{trendLabel}</p>
            )}
        </motion.div>
    );
};

export default KPICard;
