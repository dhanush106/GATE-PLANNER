import express from 'express';
import MockTest from '../models/MockTest.js';

const router = express.Router();

// WHY: Create a new mock test
router.post('/', async (req, res) => {
    try {
        const mock = await MockTest.create(req.body);

        res.status(201).json({
            success: true,
            data: mock
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get all mocks with trend data
router.get('/', async (req, res) => {
    try {
        const mocks = await MockTest.find()
            .populate('subjectsCovered')
            .sort({ testDate: -1 });

        // WHY: Prepare trend data (marks and accuracy over time)
        const trendData = mocks.map(mock => ({
            date: mock.testDate,
            marks: mock.marksObtained,
            accuracy: mock.accuracy,
            totalMarks: mock.totalMarks
        })).reverse(); // Oldest to newest for trend

        res.json({
            success: true,
            data: {
                mocks,
                trendData
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// WHY: Get mock test analytics (best/worst subjects, improvement trends)
router.get('/analytics', async (req, res) => {
    try {
        const mocks = await MockTest.find().populate('subjectsCovered');

        // WHY: Calculate best and worst subjects
        const subjectPerformance = {};

        mocks.forEach(mock => {
            mock.subjectsCovered.forEach(subject => {
                if (!subjectPerformance[subject.name]) {
                    subjectPerformance[subject.name] = {
                        totalTests: 0,
                        totalAccuracy: 0
                    };
                }
                subjectPerformance[subject.name].totalTests += 1;
                subjectPerformance[subject.name].totalAccuracy += mock.accuracy;
            });
        });

        // WHY: Calculate average accuracy per subject
        const subjectStats = Object.keys(subjectPerformance).map(subjectName => ({
            subject: subjectName,
            avgAccuracy: subjectPerformance[subjectName].totalAccuracy / subjectPerformance[subjectName].totalTests,
            testsGiven: subjectPerformance[subjectName].totalTests
        })).sort((a, b) => b.avgAccuracy - a.avgAccuracy);

        const bestSubject = subjectStats[0];
        const worstSubject = subjectStats[subjectStats.length - 1];

        // WHY: Calculate overall improvement trend
        const sortedMocks = mocks.sort((a, b) => a.testDate - b.testDate);
        const firstHalfMocks = sortedMocks.slice(0, Math.floor(sortedMocks.length / 2));
        const secondHalfMocks = sortedMocks.slice(Math.floor(sortedMocks.length / 2));

        const firstHalfAvg = firstHalfMocks.length > 0
            ? firstHalfMocks.reduce((sum, m) => sum + m.accuracy, 0) / firstHalfMocks.length
            : 0;

        const secondHalfAvg = secondHalfMocks.length > 0
            ? secondHalfMocks.reduce((sum, m) => sum + m.accuracy, 0) / secondHalfMocks.length
            : 0;

        const improvementTrend = secondHalfAvg - firstHalfAvg;

        // WHY: Mistake analysis
        const totalMistakes = {
            conceptual: mocks.reduce((sum, m) => sum + m.mistakeBreakdown.conceptual, 0),
            silly: mocks.reduce((sum, m) => sum + m.mistakeBreakdown.silly, 0),
            timePressure: mocks.reduce((sum, m) => sum + m.mistakeBreakdown.timePressure, 0)
        };

        res.json({
            success: true,
            data: {
                subjectStats,
                bestSubject,
                worstSubject,
                improvementTrend,
                totalMistakes
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
