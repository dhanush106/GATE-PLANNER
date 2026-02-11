// WHY: Date utilities are critical for a date-driven system
// All date operations should use these helpers to ensure consistency

/**
 * Get the start of today (00:00:00)
 * WHY: Used for filtering today's tasks, revisions, and study sessions
 */
export const getTodayStart = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

/**
 * Get the end of today (23:59:59)
 * WHY: Used for filtering today's data with inclusive end time
 */
export const getTodayEnd = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today;
};

/**
 * Add days to a date
 * WHY: Used for scheduling revisions (+7 days, +30 days)
 */
export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

/**
 * Calculate days between two dates
 * WHY: Used for GATE countdown and streak calculations
 */
export const daysBetween = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    return Math.round(Math.abs((date1 - date2) / oneDay));
};

/**
 * Calculate study streak from study sessions
 * WHY: Motivational metric - shows consecutive days of study
 * @param {Array} sessions - Array of study session objects with date field
 */
export const calculateStreak = (sessions) => {
    if (!sessions || sessions.length === 0) return 0;

    // Sort sessions by date (most recent first)
    const sortedSessions = sessions.sort((a, b) => new Date(b.date) - new Date(a.date));

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);

        const dayDiff = daysBetween(currentDate, sessionDate);

        if (dayDiff === 0 || dayDiff === 1) {
            streak++;
            currentDate = sessionDate;
        } else {
            break; // Streak broken
        }
    }

    return streak;
};

/**
 * Get days until GATE exam
 * WHY: Core motivational metric for countdown
 */
export const getDaysUntilGATE = () => {
    const gateDate = new Date(process.env.GATE_EXAM_DATE);
    const today = new Date();
    return daysBetween(today, gateDate);
};

/**
 * Format date to YYYY-MM-DD
 * WHY: Consistent date formatting for storage and comparison
 */
export const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
