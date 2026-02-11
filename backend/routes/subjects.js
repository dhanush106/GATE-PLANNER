import express from 'express';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';
import DailyStats from '../models/DailyStats.js';
import { startOfDay } from 'date-fns';

const router = express.Router();

// WHY: Get all executing subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ targetDate: 1 }); // Urgent deadlines first

        // Calculate dynamic progress
        // This could be cached, but for single user, aggregation is fast enough
        const subjectsWithProgress = await Promise.all(subjects.map(async (sub) => {
            const total = await Topic.countDocuments({ subjectId: sub._id });
            const completed = await Topic.countDocuments({ subjectId: sub._id, isCompleted: true });

            return {
                ...sub.toObject(),
                totalTopics: total,
                completedTopics: completed,
                progress: total > 0 ? Math.round((completed / total) * 100) : 0
            };
        }));

        res.json({ success: true, data: subjectsWithProgress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// WHY: Create new execution plan (Subject)
router.post('/', async (req, res) => {
    try {
        const { name, weightage, targetDate } = req.body;
        const subject = await Subject.create({
            name,
            weightage,
            targetDate
        });
        res.status(201).json({ success: true, data: subject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// WHY: Quick increment counters (The "AIR 1" Daily Grind)
// Updates BOTH cumulative subject stats AND daily history
router.patch('/:id/counters', async (req, res) => {
    try {
        const { problemCount, pyqCount, revisionCount } = req.body;
        const subjectId = req.params.id;
        const today = startOfDay(new Date());

        // 1. Update Cumulative Subject Stats
        const updateQuery = {};
        if (problemCount) updateQuery.totalProblems = problemCount;
        if (pyqCount) updateQuery.totalPYQs = pyqCount;
        if (revisionCount) updateQuery.totalRevisions = revisionCount;

        const subject = await Subject.findByIdAndUpdate(
            subjectId,
            { $inc: updateQuery },
            { new: true }
        );

        // 2. Update Daily Stats (Upsert)
        const dailyUpdate = {};
        if (problemCount) dailyUpdate.problemsSolved = problemCount;
        if (pyqCount) dailyUpdate.pyqsSolved = pyqCount;
        if (revisionCount) dailyUpdate.revisionsDone = revisionCount;

        await DailyStats.findOneAndUpdate(
            { subjectId, date: today },
            { $inc: dailyUpdate },
            { upsert: true, new: true }
        );

        res.json({ success: true, data: subject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// WHY: Get single subject details with REAL-TIME STREAK & HEATMAP
router.get('/:id', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });

        const total = await Topic.countDocuments({ subjectId: subject._id });
        const completed = await Topic.countDocuments({ subjectId: subject._id, isCompleted: true });

        // CALCULATE STREAK & HEATMAP
        // Fetch all stats for this subject, sorted by date descending
        const stats = await DailyStats.find({ subjectId: subject._id }).sort({ date: -1 });

        // 1. Calculate Streak
        let currentStreak = 0;
        const today = startOfDay(new Date());
        let expectedDate = today;

        // Check if we have an entry for today (streak continues)
        const hasToday = stats.length > 0 && stats[0].date.getTime() === today.getTime();

        // If no entry for today, check if we have one for yesterday (streak still active but at risk)
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (!hasToday && (stats.length === 0 || stats[0].date.getTime() !== yesterday.getTime())) {
            currentStreak = 0; // Streak broken
        } else {
            // Iterate and count
            for (let i = 0; i < stats.length; i++) {
                const statDate = stats[i].date;
                const diff = (expectedDate - statDate) / (1000 * 60 * 60 * 24);

                // If specific activity exists (count > 0)
                const hasActivity = (stats[i].problemsSolved + stats[i].pyqsSolved + stats[i].revisionsDone) > 0;

                if (!hasActivity) continue; // Skip days with 0 stats if they exist in DB

                if (diff <= 1) { // Consecutive days (0 or 1 day gap allowed)
                    currentStreak++;
                    expectedDate = new Date(statDate);
                    expectedDate.setDate(expectedDate.getDate() - 1);
                } else {
                    break; // Gap found
                }
            }
        }

        // 2. Format Heatmap Data
        const heatmap = stats.map(s => ({
            date: s.date,
            count: s.problemsSolved + s.pyqsSolved + s.revisionsDone
        }));

        res.json({
            success: true,
            data: {
                ...subject.toObject(),
                totalTopics: total,
                completedTopics: completed,
                progress: total > 0 ? Math.round((completed / total) * 100) : 0,
                streak: currentStreak,
                heatmap
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// WHY: Update Subject (Edit)
router.put('/:id', async (req, res) => {
    try {
        const { name, weightage, targetDate } = req.body;
        const subject = await Subject.findByIdAndUpdate(
            req.params.id,
            { name, weightage, targetDate },
            { new: true, runValidators: true }
        );
        res.json({ success: true, data: subject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// WHY: Delete Subject (Cleanup)
router.delete('/:id', async (req, res) => {
    try {
        const subjectId = req.params.id;
        await Subject.findByIdAndDelete(subjectId);
        // Cascade delete topics?
        await Topic.deleteMany({ subject: subjectId });
        await DailyStats.deleteMany({ subject: subjectId });
        // Revisions?
        // await Revision.deleteMany({ subject: subjectId }); // If imported

        res.json({ success: true, message: 'Subject deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
