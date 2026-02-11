import mongoose from 'mongoose';

// WHY: Revisions are now linked to Topics
const revisionSchema = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    revisionNumber: {
        type: Number, // 1 for 7 days, 2 for 30 days
        required: true
    }
}, {
    timestamps: true
});

// WHY: Efficient queries for "Today's Revisions"
revisionSchema.index({ scheduledDate: 1, completed: 1 });

const Revision = mongoose.model('Revision', revisionSchema);

export default Revision;
