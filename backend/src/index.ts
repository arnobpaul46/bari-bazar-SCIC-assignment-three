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
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('🚀 BariBazar Backend Server is Running Successfully!');
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    }).on('error', (err) => {
      console.error('❌ Server failed to start:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();