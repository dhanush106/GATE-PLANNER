import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

// WHY: Import all route files
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import subjectRoutes from './routes/subjects.js';
import topicRoutes from './routes/topics.js'; // Replaced videos
import revisionRoutes from './routes/revisions.js';
import pyqRoutes from './routes/pyqs.js';
import problemRoutes from './routes/problems.js';
import weaknessRoutes from './routes/weakness.js';
import mockRoutes from './routes/mocks.js';
import reflectionRoutes from './routes/reflections.js';
import studySessionRoutes from './routes/study-sessions.js';
import taskRoutes from './routes/tasks.js';
import dailyStatsRoutes from './routes/daily-stats.js';
import topicProgressRoutes from './routes/topic-progress.js';

// WHY: Load environment variables
dotenv.config();

// WHY: Initialize Express app
const app = express();

// WHY: Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// WHY: Connect to MongoDB
connectDB();

// WHY: Register all routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes); // Replaced videos
app.use('/api/revisions', revisionRoutes);
app.use('/api/pyqs', pyqRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/weakness', weaknessRoutes);
app.use('/api/mocks', mockRoutes);
app.use('/api/reflections', reflectionRoutes);
app.use('/api/study-sessions', studySessionRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/topic-progress', topicProgressRoutes);

// WHY: Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'GATE Prep Backend is running',
        timestamp: new Date()
    });
});

// WHY: Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// WHY: Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 GATE 2026 Preparation Dashboard Backend`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
