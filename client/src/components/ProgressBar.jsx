import { cn } from '../lib/utils';

// WHY: Reusable progress bar for visual tracking
// Supports size variants and color coding
const ProgressBar = ({ value, max = 100, size = "md", showLabel = true, className }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    // Determine color based on percentage
    let colorClass = "bg-blue-600";
    if (percentage >= 80) colorClass = "bg-emerald-500";
    else if (percentage >= 40) colorClass = "bg-blue-500";
    else colorClass = "bg-amber-500";

    const heightClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-4" : "h-2.5";

    return (
        <div className={cn("w-full", className)}>
            {showLabel && (
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={cn("w-full bg-slate-800 rounded-full overflow-hidden", heightClass)}>
                <div
                    className={cn("h-full rounded-full transition-all duration-500 ease-out", colorClass)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
