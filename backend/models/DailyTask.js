import mongoose from 'mongoose';

// WHY: Daily tasks for today's execution
// Simple task management for daily planning
const dailyTaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
        // WHY: What needs to be done
    },
    targetDate: {
        type: Date,
        required: true
        // WHY: When this task should be completed
    },
    completed: {
        type: Boolean,
        default: false
        // WHY: Has this task been completed?
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
        // WHY: Optional - task can be linked to a subject
    }
}, {
    timestamps: true
});

// WHY: Index for efficient date-based queries (today's tasks)
dailyTaskSchema.index({ targetDate: 1, completed: 1 });

const DailyTask = mongoose.model('DailyTask', dailyTaskSchema);

export default DailyTask;
