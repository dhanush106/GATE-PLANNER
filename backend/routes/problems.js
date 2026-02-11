import express from 'express';
import ProblemSolved from '../models/ProblemSolved.js';
import Topic from '../models/Topic.js'; // Changed from Video
import { getTodayStart, getTodayEnd } from '../utils/dateHelpers.js';

const router = express.Router();

// WHY: Log problems solved
router.post('/', async (req, res) => {
    try {
        const problem = await ProblemSolved.create(req.body);

        // WHY: Update topic's problems count if video (topic) is specified
        if (problem.video) {
            await Topic.findByIdAndUpdate(problem.video, {
                $inc: { problemsSolved: problem.problemCount }
            });
        }

        res.status(201).json({
            success: true,
            data: problem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get problems for a specific topic (video)
router.get('/video/:videoId', async (req, res) => {
    try {
        const problems = await ProblemSolved.find({ video: req.params.videoId })
            .populate('subject')
            .sort({ dateSolved: -1 });

        res.json({
            success: true,
            data: problems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get problems for a specific subject
router.get('/subject/:subjectId', async (req, res) => {
    try {
        const problems = await ProblemSolved.find({ subject: req.params.subjectId })
            .populate('video')
            .sort({ dateSolved: -1 });

        res.json({
            success: true,
            data: problems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get today's problem count
router.get('/daily', async (req, res) => {
    try {
        const todayStart = getTodayStart();
        const todayEnd = getTodayEnd();

        const todayProblems = await ProblemSolved.aggregate([
            {
                $match: {
                    dateSolved: { $gte: todayStart, $lte: todayEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$problemCount' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                count: todayProblems[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get overall problem statistics
router.get('/stats', async (req, res) => {
    try {
        const totalProblems = await ProblemSolved.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$problemCount' }
                }
            }
        ]);

        // WHY: Subject-wise problem count
        const subjectWiseStats = await ProblemSolved.aggregate([
            {
                $group: {
                    _id: '$subject',
                    total: { $sum: '$problemCount' }
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
                    total: 1
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalProblems: totalProblems[0]?.total || 0,
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
