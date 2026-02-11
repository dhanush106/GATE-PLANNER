import Revision from '../models/Revision.js';

// WHY: Schedule revisions for +7 and +30 days
// Now accepts a Topic object
export const scheduleRevisions = async (topic) => {
    try {
        const today = new Date();

        // Revision 1: +7 Days
        const date1 = new Date(today);
        date1.setDate(date1.getDate() + 7);

        // Revision 2: +30 Days
        const date2 = new Date(today);
        date2.setDate(date2.getDate() + 30);

        const revisions = [
            {
                topic: topic._id, // Updated field name
                subject: topic.subject,
                scheduledDate: date1,
                revisionNumber: 1
            },
            {
                topic: topic._id, // Updated field name
                subject: topic.subject,
                scheduledDate: date2,
                revisionNumber: 2
            }
        ];

        await Revision.insertMany(revisions);
        console.log(`Squared revisions for topic: ${topic.title}`);
    } catch (error) {
        console.error("Error scheduling revisions:", error);
    }
};
