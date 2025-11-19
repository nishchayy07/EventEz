import 'dotenv/config';
import { clerkClient } from '@clerk/express';

// Usage: node scripts/makeAdmin.js <userId>
// Get userId from Clerk dashboard or user profile

const makeUserAdmin = async (userId) => {
    try {
        if (!userId) {
            console.error('Please provide a userId as argument');
            console.log('Usage: node scripts/makeAdmin.js <userId>');
            console.log('\nTo find your userId:');
            console.log('1. Go to https://dashboard.clerk.com');
            console.log('2. Select your app');
            console.log('3. Go to Users');
            console.log('4. Click on your user');
            console.log('5. Copy the User ID');
            process.exit(1);
        }

        const user = await clerkClient.users.getUser(userId);
        console.log(`Found user: ${user.firstName} ${user.lastName} (${user.emailAddresses[0]?.emailAddress})`);

        await clerkClient.users.updateUser(userId, {
            privateMetadata: {
                role: 'admin'
            }
        });

        console.log('✅ User successfully made admin!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error making user admin:', error.message);
        process.exit(1);
    }
};

const userId = process.argv[2];
makeUserAdmin(userId);
