const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10, 
    message: 'Too many auth requests from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter };