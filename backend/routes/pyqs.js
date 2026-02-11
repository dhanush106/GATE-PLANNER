import express from 'express';
import PYQRecord from '../models/PYQRecord.js';
import Topic from '../models/Topic.js'; // Changed from Video
import { PYQ_STATUS } from '../config/constants.js';

const router = express.Router();

// WHY: Add a new PYQ record
router.post('/', async (req, res) => {
    try {
        const pyq = await PYQRecord.create(req.body);

        // WHY: Update topic's PYQ counts
        const topic = await Topic.findById(pyq.topic);
        if (topic) {
            topic.pyqsAttempted += 1;
            if (pyq.status === PYQ_STATUS.SOLVED) {
                topic.pyqsSolved += 1;
            }
            await topic.save();
        }

        res.status(201).json({
            success: true,
            data: pyq
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get PYQs for a specific topic
router.get('/topic/:topicId', async (req, res) => {
    try {
        const pyqs = await PYQRecord.find({ topic: req.params.topicId })
            .populate('subject')
            .sort({ year: -1, dateAttempted: -1 });

        res.json({
            success: true,
            data: pyqs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get PYQs for a specific subject
router.get('/subject/:subject', async (req, res) => {
    try {
        const pyqs = await PYQRecord.find({ subject: req.params.subject })
            .populate('topic')
            .sort({ year: -1, dateAttempted: -1 });

        res.json({
            success: true,
            data: pyqs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Update PYQ status
router.put('/:id', async (req, res) => {
    try {
        const oldPYQ = await PYQRecord.findById(req.params.id);
        const newStatus = req.body.status;

        const pyq = await PYQRecord.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!pyq) {
            return res.status(404).json({
                success: false,
                message: 'PYQ not found'
            });
        }

        // WHY: Update topic counts if status changed
        if (oldPYQ && oldPYQ.status !== newStatus) {
            const topic = await Topic.findById(pyq.topic);
            if (topic) {
                // Decrement old status count
                if (oldPYQ.status === PYQ_STATUS.SOLVED) topic.pyqsSolved -= 1;

                // Increment new status count
                if (newStatus === PYQ_STATUS.SOLVED) topic.pyqsSolved += 1;

                await topic.save();
            }
        }

        res.json({
            success: true,
            data: pyq
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get overall PYQ statistics
router.get('/stats', async (req, res) => {
    try {
        const totalSolved = await PYQRecord.countDocuments({ status: PYQ_STATUS.SOLVED });
        const totalAttempted = await PYQRecord.countDocuments();

        // WHY: Subject-wise PYQ completion
        const subjectWiseStats = await PYQRecord.aggregate([
            {
                $group: {
                    _id: '$subject',
                    total: { $sum: 1 },
                    solved: {
                        $sum: { $cond: [{ $eq: ['$status', PYQ_STATUS.SOLVED] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'subjects',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'subject'
                }
            },
            {
                $unwind: '$subject'
            },
            {
                $project: {
                    subjectName: '$subject.name',
                    total: 1,
                    solved: 1,
                    percentage: {
                        $cond: [
                            { $gt: ['$total', 0] },
                            { $multiply: [{ $divide: ['$solved', '$total'] }, 100] },
                            0
                        ]
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalSolved,
                totalAttempted,
                subjectWise: subjectWiseStats
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
