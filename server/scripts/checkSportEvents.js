import 'dotenv/config';
import connectDB from '../configs/db.js';
import SportEvent from '../models/SportEvent.js';

async function checkSportEvents() {
    try {
        await connectDB();
        
        const count = await SportEvent.countDocuments();
        console.log(`📊 Total sport events in database: ${count}`);
        
        if (count > 0) {
            const events = await SportEvent.find().limit(5);
            console.log('\n📋 Sample events:');
            events.forEach(event => {
                console.log(`- ${event.title} (${event.sport})`);
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkSportEvents();
