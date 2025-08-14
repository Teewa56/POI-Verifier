const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const {apiLimiter} = require('./middleware/rateLimiter');
const apiRouter = require('./routes/api');

const errorController = require('./controllers/errorController');

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api', apiLimiter);
const liveUrl = process.env.CLIENT_LIVE_URL;
app.use(cors({
    origin: ['http://localhost:5173', liveUrl], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
    whitelist: [ 
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));
app.use('/api', apiRouter);
app.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'success',
        message: 'Happy Hacking! 🚀'
    });
});

app.all('/*splat', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        const server = http.createServer(app);
        server.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
            
                if (process.env.BLOCKCHAIN_ENABLED === 'true') {
                    const blockchainService = require('./services/blockchainService');
                    blockchainService.initialize();
                }
        });
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    });

process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

module.exports = app;