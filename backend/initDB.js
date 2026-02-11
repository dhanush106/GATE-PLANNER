import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import Subject from './models/Subject.js';
import { GATE_SUBJECTS } from './config/constants.js';

// WHY: This script initializes the database with hardcoded GATE subjects
// Run this once to set up the subjects collection

dotenv.config();

const initializeSubjects = async () => {
    try {
        await connectDB();

        console.log('📚 Initializing GATE subjects...');

        // WHY: Create all hardcoded subjects
        for (const subjectName of GATE_SUBJECTS) {
            const exists = await Subject.findOne({ name: subjectName });

            if (!exists) {
                await Subject.create({ name: subjectName });
                console.log(`✅ Created subject: ${subjectName}`);
            } else {
                console.log(`⏭️  Subject already exists: ${subjectName}`);
            }
        }

        console.log('🎉 Subject initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

initializeSubjects();
