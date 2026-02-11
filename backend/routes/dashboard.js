import express from 'express';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';
import Revision from '../models/Revision.js';
import PYQRecord from '../models/PYQRecord.js';
import ProblemSolved from '../models/ProblemSolved.js';
import DailyTask from '../models/DailyTask.js';
import StudySession from '../models/StudySession.js';
import MockTest from '../models/MockTest.js';
import DailyStats from '../models/DailyStats.js'; // Added missing import
import { getTodayStart, getTodayEnd, getDaysUntilGATE, calculateStreak } from '../utils/dateHelpers.js';
import { VIDEO_STATUS, PYQ_STATUS } from '../config/constants.js';

const router = express.Router();

// WHY: Comprehensive Dashboard Data Endpoint
// Aggregates everything needed for the main "Command Center" view
router.get('/', async (req, res) => {
    try {
        const todayStart = getTodayStart();
        const todayEnd = getTodayEnd();

        // 1. KPIs
        const videosCompleted = await Topic.countDocuments({
            isCompleted: true
        });

        const revisionsCompleted = await Revision.countDocuments({ completed: true });

        const pyqsSolved = await PYQRecord.countDocuments({ status: PYQ_STATUS.SOLVED });

        // Aggregate total problems solved
        const problemsAgg = await ProblemSolved.aggregate([
            { $group: { _id: null, total: { $sum: '$problemCount' } } }
        ]);
        const problemsSolved = problemsAgg[0]?.total || 0;

        // 2. Today's Actions (The "To-Do" list)
        // Topics Planned for Today
        const todaysTopicsRaw = await Topic.find({
            assignedDate: { $gte: todayStart, $lte: todayEnd },
            isCompleted: false
        }).populate('subjectId').limit(5);

        // Transform for frontend compatibility (subjectId -> subject)
        const todaysTopics = todaysTopicsRaw.map(t => ({
            ...t.toObject(),
            subject: t.subjectId
        }));

        // Revisions Scheduled for Today
        const todaysRevisions = await Revision.find({
            scheduledDate: { $gte: todayStart, $lte: todayEnd },
            completed: false
        }).populate('topic').populate('subject');

        // 3. Weak Topics (Not currently supported by Topic model, returning empty)
        const weakTopics = [];

        // 4. Study Metrics (Assuming StudySession model exists and works)
        let studySessionsToday = [];
        let todayStudyMinutes = 0;
        let cumulativeMinutes = 0;
        let consistencyStreak = 0;

        try {
            studySessionsToday = await StudySession.find({
                date: { $gte: todayStart, $lte: todayEnd }
            });
            todayStudyMinutes = studySessionsToday.reduce((acc, sess) => acc + sess.duration, 0);

            const allStudySessions = await StudySession.find().sort({ date: 1 });
            cumulativeMinutes = allStudySessions.reduce((acc, sess) => acc + sess.duration, 0);

            const datesStudied = allStudySessions.map(s => s.date);
            consistencyStreak = calculateStreak(datesStudied);
        } catch (err) {
            console.warn("StudySession aggregation failed:", err.message);
        }

        // Daily Completion %
        const totalDailyItems = todaysTopics.length + todaysRevisions.length;
        const dailyCompletion = totalDailyItems === 0 ? 100 : 0; // consistent with previous logic

        // 5. Motivation / Mock Stats
        let bestMockScore = 0;
        try {
            const bestMock = await MockTest.findOne().sort({ accuracy: -1 });
            if (bestMock) bestMockScore = Math.round(bestMock.accuracy);
        } catch (err) {
            console.warn("MockTest aggregation failed:", err.message);
        }

        // 6. Heatmap & Graphs
        let heatmapData = [];
        let problemsByDay = [];
        let subjectProgress = [];

        try {
            // Heatmap
            heatmapData = await DailyStats.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        count: { $sum: { $add: ["$problemsSolved", "$pyqsSolved", "$revisionsDone"] } }
                    }
                },
                { $project: { date: "$_id", count: 1, _id: 0 } }
            ]);

            // Problems By Day
            problemsByDay = await DailyStats.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        count: { $sum: "$problemsSolved" }
                    }
                },
                { $sort: { _id: 1 } },
                { $project: { date: "$_id", count: 1, _id: 0 } }
            ]);

            // Subject Progress
            const subjects = await Subject.find();
            subjectProgress = await Promise.all(subjects.map(async (sub) => {
                const total = await Topic.countDocuments({ subjectId: sub._id });
                const completed = await Topic.countDocuments({ subjectId: sub._id, isCompleted: true });
                return {
                    subject: sub.name,
                    completed,
                    total
                };
            }));
        } catch (err) {
            console.error("Graph aggregation failed:", err.message);
        }

        res.json({
            success: true,
            data: {
                today: new Date(),
                daysUntilGATE: getDaysUntilGATE(),
                kpis: {
                    videosCompleted,
                    revisionsCompleted,
                    pyqsSolved,
                    problemsSolved
                },
                todayActions: {
                    topics: todaysTopics,
                    revisions: todaysRevisions,
                    revisionsCount: todaysRevisions.length,
                    weakTopics
                },
                studyMetrics: {
                    todayStudyHours: (todayStudyMinutes / 60).toFixed(1),
                    cumulativeStudyHours: (cumulativeMinutes / 60).toFixed(1),
                    consistencyStreak,
                    dailyCompletion
                },
                motivation: {
                    bestMockScore
                },
                heatmapData,
                problemsByDay,
                subjectProgress
            }
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
