import mongoose from 'mongoose';

// WHY: Detailed execution history for strict accountability
// Tracks every single action taken on a specific topic
const topicProgressSchema = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
        unique: true // One progress record per topic (extended stats)
    },
    // REVISION TRACKING
    revisionCount: { type: Number, default: 0 },
    lastRevisionDate: { type: Date },
    nextRevisionDate: { type: Date },

    // PROBLEM SOLVING TRACKING
    problemsSolved: { type: Number, default: 0 },
    lastPracticeDate: { type: Date },

    // PYQ TRACKING
    pyqsAttempted: { type: Number, default: 0 },
    pyqsSolved: { type: Number, default: 0 },
    pyqsWrong: { type: Number, default: 0 },

    // LEARNING TRACKING
    lastStudiedDate: { type: Date },

    // HISTORY LOG (Optional expansion for detailed audit trail)
    auditLog: [{
        action: String, // 'Revision', 'Problem', 'PYQ'
        date: { type: Date, default: Date.now },
        details: String
    }]
}, {
    timestamps: true
});

const TopicProgress = mongoose.model('TopicProgress', topicProgressSchema);

export default TopicProgress;
