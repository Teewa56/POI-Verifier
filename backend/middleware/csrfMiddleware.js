const csrf = require('csurf');
const { promisify } = require('util');

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    },
});

const csrfMiddleware = (req, res, next) => {
    const csrfFunc = promisify(csrfProtection);
    csrfFunc(req, res, next).catch(next);
};

const generateCsrfToken = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};

module.exports = { csrfMiddleware, generateCsrfToken };