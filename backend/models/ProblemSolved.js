import mongoose from 'mongoose';

// WHY: Track practice problems solved per video/subject
// This is separate from PYQs - these are general practice problems
const problemSolvedSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
        // WHY: Optional - problems can be linked to a specific video
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
        // WHY: Every problem belongs to a subject
    },
    dateSolved: {
        type: Date,
        default: Date.now,
        required: true
        // WHY: Date-driven tracking for daily problem count
    },
    problemCount: {
        type: Number,
        default: 1,
        min: 1
        // WHY: Can log multiple problems in one entry (batch entry)
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        // WHY: Optional difficulty tracking for analysis
    }
}, {
    timestamps: true
});

// WHY: Indexes for efficient queries by date, subject, and video
problemSolvedSchema.index({ dateSolved: 1 });
problemSolvedSchema.index({ subject: 1 });
problemSolvedSchema.index({ video: 1 });

const ProblemSolved = mongoose.model('ProblemSolved', problemSolvedSchema);

export default ProblemSolved;
