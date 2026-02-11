import mongoose from 'mongoose';

// WHY: Micro-execution unit assigned to a specific DATE.
// This is NOT a chapter list. This is a daily plan.
const topicSchema = new mongoose.Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    assignedDate: {
        type: Date,
        required: true
        // WHY: Every topic MUST have a date. No "someday" pile.
    },
    isCompleted: {
        type: Boolean,
        default: false
        // WHY: Binary status. Did you do it today? Yes/No.
    },
    // Tracking fields (for Dashboard & Stats)
    problemsSolved: { type: Number, default: 0 },
    pyqsAttempted: { type: Number, default: 0 },
    pyqsSolved: { type: Number, default: 0 }
}, {
    timestamps: true
});

// WHY: Efficiently query calendar for a range
topicSchema.index({ assignedDate: 1 });
topicSchema.index({ subject: 1 });

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;
