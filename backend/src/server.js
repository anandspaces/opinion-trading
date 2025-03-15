import { createServer } from 'http';
import { init } from './services/socketService.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import 'dotenv/config'

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Allow requests from frontend URL (fallback to all)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies and authorization headers
};

app.use(cors(corsOptions));

app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Server Error');
});

const PORT = process.env.PORT || 5000;

const server = createServer(app);
init(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});