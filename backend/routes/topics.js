import express from 'express';
import Topic from '../models/Topic.js';
import Revision from '../models/Revision.js';

const router = express.Router();

// WHY: Get topics (Filtered by Subject) - For Calendar View
router.get('/', async (req, res) => {
    try {
        const { subject } = req.query;
        if (!subject) return res.status(400).json({ success: false, message: 'Subject ID required' });

        const topics = await Topic.find({ subject }).sort({ assignedDate: 1 });
        res.json({ success: true, data: topics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// WHY: Add topic to a specific date
router.post('/', async (req, res) => {
    try {
        const { subject, name, assignedDate } = req.body;
        // Allows multiple topics per day. "AIR 1" mindset: Do more.
        const topic = await Topic.create({
            subject,
            name,
            assignedDate
        });
        res.status(201).json({ success: true, data: topic });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// WHY: Toggle Completion or Move Date
router.patch('/:id', async (req, res) => {
    try {
        const { isCompleted, assignedDate, name } = req.body;
        const updateData = {};
        if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
        if (assignedDate) updateData.assignedDate = assignedDate;
        if (name) updateData.name = name;

        const topic = await Topic.findByIdAndUpdate(req.params.id, updateData, { new: true });

        // AUTO-SCHEDULE REVISION (+14 Days)
        // Only if marking as completed for the first time (or toggling to true)
        if (isCompleted === true && topic) {
            try {
                const nextRevisionDate = new Date();
                nextRevisionDate.setDate(nextRevisionDate.getDate() + 14);

                // Check for existing revision for this topic to avoid duplicates
                const existing = await Revision.findOne({ topic: topic._id, completed: false });

                if (!existing) {
                    await Revision.create({
                        topic: topic._id,
                        subject: topic.subject,
                        scheduledDate: nextRevisionDate,
                        revisionNumber: (topic.revisionCount || 0) + 1
                    });
                    // Optionally update topic's revision count if not already done
                    // But Revision model usually handles specific flows.
                    // The requirement is just to schedule it.
                }
            } catch (e) {
                console.error("Auto-schedule revision failed:", e);
                // Don't fail the request, just log
            }
        }

        res.json({ success: true, data: topic });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// WHY: Delete topic (Cleanup)
router.delete('/:id', async (req, res) => {
    try {
        await Topic.findByIdAndDelete(req.params.id);
        // Clean up revisions?
        await Revision.deleteMany({ topic: req.params.id });
        res.json({ success: true, message: 'Topic removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
