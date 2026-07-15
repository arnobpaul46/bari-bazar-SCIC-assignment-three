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

// ✅ CORS – Vercel ফ্রন্টএন্ডের জন্য নির্দিষ্ট
const allowedOrigins = [
  'http://localhost:3000',
  'https://bari-bazar-scic-assignment-three-fr.vercel.app',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,      // Cookie/টোকেন পাঠানোর অনুমতি
}));
app.use(express.json());

// ✅ ডাটাবেজ কানেকশন (স্মার্ট মিডলওয়্যার)
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

app.use('/api/auth', connectMiddleware, authRoutes);
app.use('/api/items', connectMiddleware, itemRoutes);
app.use('/api/admin', connectMiddleware, adminRoutes);
app.use('/api/bookmarks', connectMiddleware, bookmarkRoutes);
app.use('/api/orders', connectMiddleware, orderRoutes);

app.get('/', (req, res) => {
  res.send('🚀 BariBazar Backend Server is Running Successfully!');
});

// লোকাল ডেভেলপমেন্টের জন্য
if (process.env.NODE_ENV !== 'production') {
  const PORT = Number(process.env.PORT) || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;