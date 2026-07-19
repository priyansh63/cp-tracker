import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { seedProblems } from './config/seed';
import authRoutes from './routes/authRoutes';
import cfRoutes from './routes/cfRoutes';
import ladderRoutes from './routes/ladderRoutes';

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'https://cp-tracker-smw5.vercel.app',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cf', cfRoutes);
app.use('/api/practice', ladderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();
  
  // Seed practice problems if database is empty
  await seedProblems();

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
