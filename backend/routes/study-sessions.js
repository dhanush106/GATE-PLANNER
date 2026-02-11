import express from 'express';
import StudySession from '../models/StudySession.js';
import { getTodayStart, getTodayEnd } from '../utils/dateHelpers.js';

const router = express.Router();

// WHY: Log a study session
router.post('/', async (req, res) => {
    try {
        const session = await StudySession.create(req.body);

        res.status(201).json({
            success: true,
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get today's study time
router.get('/today', async (req, res) => {
    try {
        const todayStart = getTodayStart();
        const todayEnd = getTodayEnd();

        const sessions = await StudySession.find({
            date: { $gte: todayStart, $lte: todayEnd }
        }).populate('subject');

        const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);

        res.json({
            success: true,
            data: {
                sessions,
                totalMinutes,
                totalHours: (totalMinutes / 60).toFixed(1)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get cumulative study hours
router.get('/cumulative', async (req, res) => {
    try {
        const sessions = await StudySession.find();

        const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);

        res.json({
            success: true,
            data: {
                totalMinutes,
                totalHours: (totalMinutes / 60).toFixed(1)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
