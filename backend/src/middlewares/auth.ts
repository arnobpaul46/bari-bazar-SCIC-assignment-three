import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';

// TypeScript-এর জন্য custom type declare করুন
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔍 [Auth] Middleware called');
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('🔍 [Auth] Token extracted:', token ? token.substring(0, 20) + '...' : 'No token');
    }

    if (!token) {
      console.log('❌ [Auth] No token');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    console.log('🔍 [Auth] Decoded:', decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('❌ [Auth] User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    // ✅ গুরুত্বপূর্ণ: req.user-এ ইউজার অবজেক্ট অ্যাসাইন করুন
    req.user = user;
    console.log('✅ [Auth] User set:', user._id);
    next();
  } catch (error) {
    console.error('❌ [Auth] Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Not authorized' });
  }
};