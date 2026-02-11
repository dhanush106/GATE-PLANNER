import express from 'express';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';
import Revision from '../models/Revision.js';
import PYQRecord from '../models/PYQRecord.js';
import ProblemSolved from '../models/ProblemSolved.js';
import DailyTask from '../models/DailyTask.js';
import DailyStats from '../models/DailyStats.js'; // Added missing import
import StudySession from '../models/StudySession.js';
import MockTest from '../models/MockTest.js';
import { getTodayStart, getTodayEnd, getDaysUntilGATE, calculateStreak } from '../utils/dateHelpers.js';
import { VIDEO_STATUS, PYQ_STATUS } from '../config/constants.js';

const router = express.Router();

// WHY: Comprehensive Dashboard Data Endpoint
// Aggregates everything needed for the main "Command Center" view
router.get('/', async (req, res) => {
    try {
        const todayStart = getTodayStart();
        const todayEnd = getTodayEnd();

        // 1. KPIs (Key Performance Indicators)
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
        const todaysTopics = await Topic.find({
            assignedDate: { $gte: todayStart, $lte: todayEnd },
            isCompleted: false
        }).populate('subject').limit(5);

        // Revisions Scheduled for Today
        const todaysRevisions = await Revision.find({
            scheduledDate: { $gte: todayStart, $lte: todayEnd },
            completed: false
        }).populate({
            path: 'topic',
            populate: { path: 'subject' }
        });

        // 3. Weak Topics (Showing Incomplete Topics as priority)
        const weakTopics = await Topic.find({
            isCompleted: false
        }).populate('subject').limit(3);

        // 4. Study Metrics
        const studySessionsToday = await StudySession.find({
            date: { $gte: todayStart, $lte: todayEnd }
        });
        const todayStudyMinutes = studySessionsToday.reduce((acc, sess) => acc + sess.duration, 0);

        const allStudySessions = await StudySession.find().sort({ date: 1 });
        const cumulativeMinutes = allStudySessions.reduce((acc, sess) => acc + sess.duration, 0);

        // Calculate Streak
        const consistencyStreak = calculateStreak(allStudySessions);

        // Daily Completion % (Arbitrary metric based on tasks/revisions)
        const totalDailyItems = todaysTopics.length + todaysRevisions.length;
        // We don't have "completed today" count easily without more queries, 
        // so let's default to 0 for now or calculate based on if list is empty.
        const dailyCompletion = totalDailyItems === 0 ? 100 : 0;

        // 5. Motivation / Mock Stats
        const bestMock = await MockTest.findOne().sort({ accuracy: -1 });

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
                    bestMockScore: bestMock ? Math.round(bestMock.accuracy) : 0
                },
                // NEW: Heatmap & Graph Data
                heatmapData: await DailyStats.aggregate([
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                            count: {
                                $sum: {
                                    $add: [
                                        { $ifNull: ["$problemsSolved", 0] },
                                        { $ifNull: ["$pyqsSolved", 0] },
                                        { $ifNull: ["$revisionsDone", 0] }
                                    ]
                                }
                            }
                        }
                    },
                    { $project: { date: "$_id", count: 1, _id: 0 } }
                ]),
                problemsByDay: await DailyStats.aggregate([
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                            count: { $sum: "$problemsSolved" }
                        }
                    },
                    { $sort: { _id: 1 } }, // Sort by date ascending
                    { $project: { date: "$_id", count: 1, _id: 0 } }
                ]),
                subjectProgress: await Promise.all((await Subject.find()).map(async (sub) => {
                    const total = await Topic.countDocuments({ subject: sub._id });
                    const completed = await Topic.countDocuments({ subject: sub._id, isCompleted: true });
                    return {
                        subject: sub.name,
                        completed,
                        total
                    };
                }))
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
