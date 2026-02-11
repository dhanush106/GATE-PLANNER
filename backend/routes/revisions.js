import express from 'express';
import Revision from '../models/Revision.js';
import Topic from '../models/Topic.js'; // Use Topic for status updates
import { getTodayStart, getTodayEnd } from '../utils/dateHelpers.js';
import { VIDEO_STATUS } from '../config/constants.js';

const router = express.Router();

// GET Today's Revisions
router.get('/today', async (req, res) => {
    try {
        const todayStart = getTodayStart();
        const todayEnd = getTodayEnd();

        const revisions = await Revision.find({
            scheduledDate: { $gte: todayStart, $lte: todayEnd },
            completed: false
        })
            .populate('topic') // Changed from video
            .populate('subject')
            .sort({ scheduledDate: 1 });

        res.json({
            success: true,
            data: revisions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET Missed Revisions
router.get('/missed', async (req, res) => {
    try {
        const todayStart = getTodayStart(); // Anything strictly before today start

        const revisions = await Revision.find({
            scheduledDate: { $lt: todayStart },
            completed: false
        })
            .populate('topic') // Changed from video
            .populate('subject')
            .sort({ scheduledDate: 1 });

        res.json({
            success: true,
            data: revisions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// NEW: GET Revisions by Date Range (For Calendar)
router.get('/range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'Start and End dates required' });
        }

        const revisions = await Revision.find({
            scheduledDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        })
            .populate('topic')
            .populate('subject')
            .sort({ scheduledDate: 1 });

        res.json({ success: true, data: revisions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Mark Revision as Complete
router.put('/:id/complete', async (req, res) => {
    try {
        const revision = await Revision.findByIdAndUpdate(
            req.params.id,
            { completed: true },
            { new: true }
        );

        // Also mark the Topic as 'Revised' if it was 'Completed'
        // To show it's being actively maintained
        if (revision && revision.topic) {
            await Topic.findByIdAndUpdate(revision.topic, {
                status: VIDEO_STATUS.REVISED,
                $inc: { revisionCount: 1 }
            });
        }

        res.json({
            success: true,
            data: revision
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
