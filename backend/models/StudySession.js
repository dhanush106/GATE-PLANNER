import mongoose from 'mongoose';

// WHY: Study session tracking for time management and streak calculation
// Each session logs study time with optional subject
const studySessionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
        // WHY: When this study session occurred
    },
    startTime: {
        type: Date,
        required: true
        // WHY: Session start time
    },
    endTime: {
        type: Date,
        required: true
        // WHY: Session end time
    },
    duration: {
        type: Number,
        required: true
        // WHY: Duration in minutes (calculated from start/end)
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
        // WHY: Optional - can track general study or subject-specific
    }
}, {
    timestamps: true
});

// WHY: Index for efficient date-based queries (today's study time, streak)
studySessionSchema.index({ date: 1 });

// WHY: Calculate duration if not provided
studySessionSchema.pre('save', function (next) {
    if (!this.duration && this.startTime && this.endTime) {
        const durationMs = this.endTime - this.startTime;
        this.duration = Math.round(durationMs / (1000 * 60)); // Convert to minutes
    }
    next();
});

const StudySession = mongoose.model('StudySession', studySessionSchema);

export default StudySession;
