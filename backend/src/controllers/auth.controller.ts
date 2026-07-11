// ============================================
// ধাপ ৪.১: রেজিস্টার কন্ট্রোলার (লজিক অংশ)
// ============================================

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';

// register user api
export const register = async (req: Request, res: Response) => {
  try {
    // get request body
    const { name, email, password, role } = req.body;

    // validation 
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // hash password (bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'buyer', // if role is not provided, set it to 'buyer'
    });

    // save user to database
    await newUser.save();

    // success response 
    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};