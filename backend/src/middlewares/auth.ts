import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    
    (req as any).user = session.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token or session expired' });
  }
};