import { createServer } from 'http';
import app from './app';
import { init } from './services/socketService';
import { info } from './utils/logger';

import express, { json } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import tradeRoutes from './routes/tradeRoutes';
import adminRoutes from './routes/adminRoutes';
import { error } from './utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  error(err.stack);
  res.status(500).send('Server Error');
});

export default app;

const PORT = process.env.PORT || 5000;

const server = createServer(app);
init(server);

server.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});