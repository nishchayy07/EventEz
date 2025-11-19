import 'dotenv/config';
import connectDB from '../configs/db.js';
import SportEvent from '../models/SportEvent.js';

async function clearSportEvents() {
    try {
        await connectDB();
        
        const result = await SportEvent.deleteMany({});
        console.log(`✅ Successfully deleted ${result.deletedCount} sport events from the database.`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing sport events:', error);
        process.exit(1);
    }
}

clearSportEvents();
