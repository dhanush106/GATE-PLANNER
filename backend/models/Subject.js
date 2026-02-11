import mongoose from 'mongoose';

// WHY: Execution-first design. Focus on weightage and target dates.
// Aggregates daily performance counters for quick dashboard view.
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    weightage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
        // WHY: Helps prioritize subjects by marks
    },
    targetDate: {
        type: Date,
        required: true
        // WHY: Deadline for completing the ENTIRE subject
    },
    // WHY: Cumulative counters for instant motivation
    totalPYQs: { type: Number, default: 0 },
    totalProblems: { type: Number, default: 0 },
    totalRevisions: { type: Number, default: 0 },

    // WHY: Calculated fields (cached or aggregated)
    totalTopics: { type: Number, default: 0 },
    completedTopics: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
