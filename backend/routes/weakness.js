import express from 'express';
import Topic from '../models/Topic.js'; // Changed from Video
import { VIDEO_STATUS } from '../config/constants.js';

const router = express.Router();

// WHY: Get weak topics (confidence <= 2 or status = Weak)
// Supports filtering by subject, confidence, and sorting
router.get('/', async (req, res) => {
    try {
        const { subject, minConfidence, maxConfidence, sortBy } = req.query;

        // WHY: Build query for weak topics
        let query = {
            $or: [
                { confidenceLevel: { $lte: 2 } },
                { status: VIDEO_STATUS.WEAK }
            ]
        };

        // WHY: Add subject filter if provided
        if (subject) {
            query.subject = subject;
        }

        // WHY: Add confidence range filter if provided
        if (minConfidence || maxConfidence) {
            query.confidenceLevel = {};
            if (minConfidence) query.confidenceLevel.$gte = parseInt(minConfidence);
            if (maxConfidence) query.confidenceLevel.$lte = parseInt(maxConfidence);
        }

        // WHY: Determine sort order
        let sort = {};
        if (sortBy === 'confidence') {
            sort.confidenceLevel = 1; // Low to high
        } else if (sortBy === 'date') {
            sort.updatedAt = -1; // Most recent first (Topic doesn't have lastWatchedDate yet, logic changed)
        } else {
            sort.createdAt = -1; // Default: newest first
        }

        const weakTopics = await Topic.find(query)
            .populate('subject')
            .sort(sort);

        res.json({
            success: true,
            data: weakTopics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
