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

// ✅ CORS – নির্দিষ্ট অরিজিন, credentials সহ
const allowedOrigins = [
  'http://localhost:3000',
  'https://bari-bazar-scic-assignment-three-fr.vercel.app',
  // ব্যাকএন্ডের নিজের URL যোগ করবেন না – শুধু ফ্রন্টএন্ডের URL
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json()); // একবারই যথেষ্ট

// ✅ ডাটাবেজ কানেকশন মিডলওয়্যার (Vercel-এর জন্য)
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

// ✅ সব রাউটে মিডলওয়্যার প্রয়োগ
app.use('/api/auth', connectMiddleware, authRoutes);
app.use('/api/items', connectMiddleware, itemRoutes);
app.use('/api/admin', connectMiddleware, adminRoutes);
app.use('/api/bookmarks', connectMiddleware, bookmarkRoutes);
app.use('/api/orders', connectMiddleware, orderRoutes);

app.get('/', (req, res) => {
  res.send('🚀 BariBazar Backend Server is Running Successfully!');
});

// ✅ লোকাল ডেভেলপমেন্টের জন্য
if (process.env.NODE_ENV !== 'production') {
  const PORT = Number(process.env.PORT) || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

// ✅ Vercel-এর জন্য এক্সপোর্ট
export default app;