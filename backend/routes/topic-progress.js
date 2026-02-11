import express from 'express';
import TopicProgress from '../models/TopicProgress.js';
import Topic from '../models/Topic.js';

const router = express.Router();

// WHY: Get progress for a specific topic
router.get('/:topicId', async (req, res) => {
    try {
        let progress = await TopicProgress.findOne({ topic: req.params.topicId });
        if (!progress) {
            // Lazy create if not exists
            progress = await TopicProgress.create({ topic: req.params.topicId });
        }
        res.json({ success: true, data: progress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// WHY: Log a revision
router.post('/revision/:topicId', async (req, res) => {
    try {
        const { date } = req.body;
        const progress = await TopicProgress.findOne({ topic: req.params.topicId }) || new TopicProgress({ topic: req.params.topicId });

        progress.revisionCount += 1;
        progress.lastRevisionDate = date || new Date();
        progress.auditLog.push({ action: 'Revision', date: new Date() });

        await progress.save();

        // Sync with minimal Topic model
        await Topic.findByIdAndUpdate(req.params.topicId, {
            $inc: { revisionCount: 1 }
        });

        res.json({ success: true, data: progress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// WHY: Log problems solved
router.post('/problems/:topicId', async (req, res) => {
    try {
        const { count } = req.body;
        const progress = await TopicProgress.findOne({ topic: req.params.topicId }) || new TopicProgress({ topic: req.params.topicId });

        progress.problemsSolved += parseInt(count);
        progress.lastPracticeDate = new Date();
        progress.auditLog.push({ action: 'Problem', details: `${count} problems`, date: new Date() });

        await progress.save();

        // Sync with minimal Topic model
        await Topic.findByIdAndUpdate(req.params.topicId, {
            $inc: { problemsSolved: parseInt(count) }
        });

        res.json({ success: true, data: progress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
