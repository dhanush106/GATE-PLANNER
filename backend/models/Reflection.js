import mongoose from 'mongoose';

// WHY: Daily reflection for continuous improvement
// One reflection per day - tracks what worked and what didn't
const reflectionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
        // WHY: One reflection per day (enforced by unique constraint)
    },
    whatWentRight: {
        type: String,
        required: true,
        trim: true
        // WHY: Positive reinforcement - what to continue doing
    },
    whatWentWrong: {
        type: String,
        required: true,
        trim: true
        // WHY: Identify problems and obstacles
    },
    mistakeToAvoid: {
        type: String,
        required: true,
        trim: true
        // WHY: One specific actionable improvement for tomorrow
    }
}, {
    timestamps: true
});

// WHY: Index for efficient date-based queries
reflectionSchema.index({ date: 1 });

const Reflection = mongoose.model('Reflection', reflectionSchema);

export default Reflection;
