import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './lib/db';
import authRoutes from './routes/auth.routes';
import itemRoutes from './routes/item.routes';
import adminRoutes from './routes/admin.routes';
import bookmarkRoutes from './routes/bookmark.routes';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();

// ✅ ডাটাবেজ কানেকশন মিডলওয়্যার (প্রতি রিকোয়েস্টের আগে চেক করবে)
let mongooseConnection = false;
const connectMiddleware = async (req: any, res: any, next: any) => {
  try {
    if (!mongooseConnection) {
      await connectDB();
      mongooseConnection = true;
      console.log('✅ MongoDB connected');
    }
    next();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    res.status(500).json({ message: 'Database connection error' });
  }
};

app.use(cors());
app.use(express.json());

// ✅ সব রাউটে মিডলওয়্যার প্রয়োগ করুন
app.use('/api/auth', connectMiddleware, authRoutes);
app.use('/api/items', connectMiddleware, itemRoutes);
app.use('/api/admin', connectMiddleware, adminRoutes);
app.use('/api/bookmarks', connectMiddleware, bookmarkRoutes);
app.use('/api/orders', connectMiddleware, orderRoutes);

app.get('/', (req, res) => {
  res.send('🚀 BariBazar Backend Server is Running Successfully!');
});

export default app;