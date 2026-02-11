import express from 'express';
import DailyTask from '../models/DailyTask.js';
import { getTodayStart, getTodayEnd } from '../utils/dateHelpers.js';

const router = express.Router();

// WHY: Create a new daily task
router.post('/', async (req, res) => {
    try {
        const task = await DailyTask.create(req.body);

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get today's tasks
router.get('/today', async (req, res) => {
    try {
        const todayStart = getTodayStart();
        const todayEnd = getTodayEnd();

        const tasks = await DailyTask.find({
            targetDate: { $gte: todayStart, $lte: todayEnd }
        }).populate('subject').sort({ completed: 1, createdAt: 1 });

        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Update a task (mark complete/incomplete)
router.put('/:id', async (req, res) => {
    try {
        const task = await DailyTask.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('subject');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await DailyTask.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
