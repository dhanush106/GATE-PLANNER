import express from 'express';
import Reflection from '../models/Reflection.js';
import { formatDate } from '../utils/dateHelpers.js';

const router = express.Router();

// WHY: Create or update daily reflection
router.post('/', async (req, res) => {
    try {
        const { date, whatWentRight, whatWentWrong, mistakeToAvoid } = req.body;

        // WHY: Use upsert to create or update reflection for the date
        const reflection = await Reflection.findOneAndUpdate(
            { date: new Date(date) },
            {
                date: new Date(date),
                whatWentRight,
                whatWentWrong,
                mistakeToAvoid
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(201).json({
            success: true,
            data: reflection
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get reflection for a specific date
router.get('/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const reflection = await Reflection.findOne({ date });

        if (!reflection) {
            return res.status(404).json({
                success: false,
                message: 'No reflection found for this date'
            });
        }

        res.json({
            success: true,
            data: reflection
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get recent reflections (last 7 days)
router.get('/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 7;

        const reflections = await Reflection.find()
            .sort({ date: -1 })
            .limit(limit);

        res.json({
            success: true,
            data: reflections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
