const csrf = require('csurf');

const csrfMiddleware = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    },
});

const generateCsrfToken = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};

module.exports = { csrfMiddleware, generateCsrfToken };