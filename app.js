const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const streamRoutes = require('./routes/stream.routes');
const queueRoutes = require('./routes/queue.routes');
const errorHandler = require('./utils/errors');

// Initialize Telegram service
require('./services/telegram.service');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/stream', streamRoutes);
app.use('/api/queue', queueRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;
