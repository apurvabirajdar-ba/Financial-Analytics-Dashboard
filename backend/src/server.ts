import express from 'express';
import cors from 'cors';
import { connectDB } from './config';
import { seedDatabase } from './utils/seedDb';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import analyticsRoutes from './routes/analytics';
import exportRoutes from './routes/export';

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB and seed
connectDB().then(() => seedDatabase());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});