import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { User } from '../models/User.model';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
  
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const users = await User.find({}).select('-password').lean();

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const changeUserRole = async (req: AuthRequest, res: Response) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { id } = req.params;        
    const { role } = req.body;        


    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }
    if (!['buyer', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be buyer, seller, or admin' });
    }

    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'You cannot change your own role' });
    }

   
    user.role = role;
    await user.save();

    res.status(200).json({
      message: `User role updated to ${role} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Change role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};