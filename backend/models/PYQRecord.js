import mongoose from 'mongoose';
import { PYQ_STATUS } from '../config/constants.js';

// WHY: PYQ (Previous Year Questions) tracking is critical for GATE preparation
// Each PYQ record tracks a specific question attempt
const pyqRecordSchema = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
        // WHY: Which topic this PYQ belongs to
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
        // WHY: Subject for aggregated statistics
    },
    year: {
        type: Number,
        required: true
        // WHY: Which GATE year (e.g., 2023, 2024, 2025)
    },
    questionIdentifier: {
        type: String,
        required: true
        // WHY: Question number or identifier (e.g., "Q15", "Q23")
    },
    status: {
        type: String,
        enum: Object.values(PYQ_STATUS),
        default: PYQ_STATUS.ATTEMPTED
        // WHY: Attempted, Solved, or Wrong
    },
    dateAttempted: {
        type: Date,
        default: Date.now
        // WHY: When was this PYQ attempted
    },
    notes: {
        type: String,
        default: ''
        // WHY: Notes about the solution or mistakes
    }
}, {
    timestamps: true
});

// WHY: Indexes for efficient queries by topic, subject, and year
pyqRecordSchema.index({ topic: 1 });
pyqRecordSchema.index({ subject: 1 });
pyqRecordSchema.index({ year: 1 });
pyqRecordSchema.index({ status: 1 });

const PYQRecord = mongoose.model('PYQRecord', pyqRecordSchema);

export default PYQRecord;
