// WHY: Centralized constants for hardcoded subjects and configuration
// This ensures consistency across the application and makes it easy to modify

export const GATE_SUBJECTS = [
  'Engineering Mathematics',
  'Probability & Statistics',
  'Discrete Mathematics',
  'Database Management Systems (DBMS)',
  'Data Structures',
  'Algorithms',
  'Data Analytics'
];

// WHY: Revision schedule constants define when revisions should be triggered
// Based on spaced repetition principles: first revision after 7 days, second after 30 days
export const REVISION_SCHEDULE = {
  FIRST_REVISION_DAYS: 7,
  SECOND_REVISION_DAYS: 30
};

// WHY: Video status constants to ensure consistency across the application
export const VIDEO_STATUS = {
  NOT_STARTED: 'Not Started',
  WATCHING: 'Watching',
  COMPLETED: 'Completed',
  REVISED: 'Revised',
  WEAK: 'Weak'
};

// WHY: PYQ status constants for tracking question attempt outcomes
export const PYQ_STATUS = {
  ATTEMPTED: 'Attempted',
  SOLVED: 'Solved',
  WRONG: 'Wrong'
};

// WHY: Mock test mistake types for detailed performance analysis
export const MISTAKE_TYPES = {
  CONCEPTUAL: 'Conceptual',
  SILLY: 'Silly',
  TIME_PRESSURE: 'Time Pressure'
};
