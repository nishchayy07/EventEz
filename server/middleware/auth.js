import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next)=>{
    try {
        console.log('🔐 protectAdmin middleware called');
        console.log('Auth object:', req.auth ? 'exists' : 'MISSING');
        
        if (!req.auth) {
            console.log('❌ req.auth is undefined - Clerk middleware not working');
            return res.json({success: false, message: "not authorized - auth middleware missing"})
        }
        
        const { userId } = req.auth();
        console.log('User ID from token:', userId);
        
        if (!userId) {
            console.log('❌ No userId found in token');
            return res.json({success: false, message: "not authorized - no user"})
        }

        const user = await clerkClient.users.getUser(userId)
        
        console.log('🔍 Admin check:', {
            userId,
            email: user.emailAddresses[0]?.emailAddress,
            privateMetadata: user.privateMetadata,
            role: user.privateMetadata?.role,
            isAdmin: user.privateMetadata?.role === 'admin'
        });

        if(user.privateMetadata?.role !== 'admin'){
            console.log('❌ User is not admin. Current role:', user.privateMetadata?.role || 'none');
            return res.json({success: false, message: "not authorized"})
        }

        console.log('✅ Admin access granted');
        next();
    } catch (error) {
        console.error('❌ Error in protectAdmin:', error.message);
        console.error('Full error:', error);
        return res.json({ success: false, message: "not authorized" });
    }
}