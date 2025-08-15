require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const connectDB = require('./config/db');
const apiRouter = require('./routes/api');
const { globalErrorHandler } = require('./controllers/errorController');
const { apiLimiter } = require('./middleware/rateLimiter');
const http = require('http');

const app = express();

// Security & utils
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// API limiter
app.use('/api', apiLimiter);

// Routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Error handler
app.use(globalErrorHandler);


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