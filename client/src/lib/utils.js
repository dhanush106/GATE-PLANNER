import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// WHY: Utility for merging Tailwind classes conditionally
// Essential for reusable components with dynamic styles
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// WHY: Format date to readable string
export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// WHY: Format duration (minutes) to hours and minutes
export function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
}
