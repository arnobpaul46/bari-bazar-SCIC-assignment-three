import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';

// jwt custom type 
export interface AuthRequest extends Request {
  user?: any; 
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    
    const token = req.headers.authorization?.split(' ')[1]; 

    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };


    const user = await User.findById(decoded.id).select('-password');

    
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};