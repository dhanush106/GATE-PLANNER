import mongoose from 'mongoose';

// WHY: Mock test tracking is critical for performance analysis
// Detailed mistake breakdown helps identify weak areas
const mockTestSchema = new mongoose.Schema({
    testDate: {
        type: Date,
        required: true,
        default: Date.now
        // WHY: When was this mock test taken
    },
    subjectsCovered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
        // WHY: Which subjects were in this mock (can be multiple)
    }],
    totalMarks: {
        type: Number,
        required: true
        // WHY: Maximum marks for this test
    },
    marksObtained: {
        type: Number,
        required: true
        // WHY: Actual marks scored
    },
    accuracy: {
        type: Number,
        // WHY: Percentage accuracy (calculated or entered)
    },
    timeTaken: {
        type: Number,
        required: true
        // WHY: Time taken in minutes
    },
    // WHY: Detailed mistake breakdown for analysis
    mistakeBreakdown: {
        conceptual: {
            type: Number,
            default: 0
            // WHY: Mistakes due to concept gaps
        },
        silly: {
            type: Number,
            default: 0
            // WHY: Careless mistakes
        },
        timePressure: {
            type: Number,
            default: 0
            // WHY: Mistakes due to time constraints
        }
    }
}, {
    timestamps: true
});

// WHY: Index for efficient date-based queries and trend analysis
mockTestSchema.index({ testDate: 1 });

// WHY: Calculate accuracy if not provided
mockTestSchema.pre('save', function (next) {
    if (!this.accuracy && this.totalMarks > 0) {
        this.accuracy = (this.marksObtained / this.totalMarks) * 100;
    }
    next();
});

const MockTest = mongoose.model('MockTest', mockTestSchema);

export default MockTest;
