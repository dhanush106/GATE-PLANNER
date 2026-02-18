import { cn } from '../lib/utils';

const ProgressBar = ({ value, max = 100, size = "md", showLabel = true, className }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    // Color based on percentage
    let fillColor, glowColor;
    if (percentage >= 80) {
        fillColor = 'linear-gradient(90deg, #10b981, #34d399)';
        glowColor = 'rgba(16, 185, 129, 0.4)';
    } else if (percentage >= 40) {
        fillColor = 'linear-gradient(90deg, rgba(var(--primary-rgb), 0.9), rgba(var(--primary-rgb), 0.7))';
        glowColor = 'rgba(var(--primary-rgb), 0.35)';
    } else {
        fillColor = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        glowColor = 'rgba(245, 158, 11, 0.4)';
    }

    const heightClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-4" : "h-2.5";

    return (
        <div className={cn("w-full", className)}>
            {showLabel && (
                <div
                    className="flex justify-between text-xs font-semibold mb-1.5"
                    style={{ color: 'var(--muted-foreground)' }}
                >
                    <span>Progress</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            <div
                className={cn("w-full rounded-full overflow-hidden", heightClass)}
                style={{ background: 'var(--muted)', boxShadow: 'var(--neuo-inset)' }}
            >
                <div
                    className={cn("h-full rounded-full transition-all duration-700 ease-out")}
                    style={{
                        width: `${percentage}%`,
                        background: fillColor,
                        boxShadow: percentage > 5 ? `0 0 8px ${glowColor}` : 'none',
                    }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
