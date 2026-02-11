import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import Subject from './models/Subject.js';
import Video from './models/Video.js';

dotenv.config();

const verifySetup = async () => {
    try {
        await connectDB();

        const subjectCount = await Subject.countDocuments();
        console.log(`📚 Subjects Found: ${subjectCount}`);

        if (subjectCount === 0) {
            console.log('⚠️ No subjects found! Re-running initialization...');
            // Re-run init logic here if needed, or just warn
        } else {
            console.log('✅ Database initialized successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

verifySetup();
