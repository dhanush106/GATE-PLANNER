import express from 'express';
import DailyStats from '../models/DailyStats.js';

const router = express.Router();

// WHY: Fetch history for graphs
router.get('/', async (req, res) => {
    try {
        const { subject, startDate, endDate } = req.query;
        const query = {};
        if (subject) query.subject = subject;

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const stats = await DailyStats.find(query).sort({ date: 1 });
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
