import mongoose from 'mongoose';

// WHY: Granular history tracking.
// Allows generating "Activity Heatmaps" and specific day history.
const dailyStatsSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    date: {
        type: Date,
        required: true
        // WHY: Normalized to start of day (midnight)
    },
    problemsSolved: { type: Number, default: 0 },
    pyqsSolved: { type: Number, default: 0 },
    revisionsDone: { type: Number, default: 0 }
    // WHY: Stores delta for that specific day
}, {
    timestamps: true
});

// WHY: Ensure one entry per subject per day
dailyStatsSchema.index({ subject: 1, date: 1 }, { unique: true });

const DailyStats = mongoose.model('DailyStats', dailyStatsSchema);
export default DailyStats;
