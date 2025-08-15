const { OAuth2Client } = require('google-auth-library');
const { AppError } = require('../controllers/errorController');

const clientId = process.env.GOOGLE_CLIENT_ID;
let client = null;

if (clientId) {
    client = new (OAuth2Client)(clientId);
}

exports.verifyIdToken = async (idToken) => {
    if (!clientId || !client) {
        throw new AppError('Google login not configured', 503);
    }
    try {
        const ticket = await client.verifyIdToken({ idToken, audience: clientId });
        const payload = ticket.getPayload();
        // payload contains: sub (googleId), email, name, picture, email_verified
        return {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name || payload.email.split('@')[0],
            emailVerified: payload.email_verified
        };
    } catch (err) {
        throw new AppError('Invalid Google token', 401);
    }
};
