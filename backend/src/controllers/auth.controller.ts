import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/auth';
// ============================================
// register user api
// ============================================
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



// ============================================
// login user api
// ============================================
export const login = async (req: Request, res: Response) => {
  try {
    // get request body
    const { email, password } = req.body;

    // validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // 401 = অননুমোদিত
    }

    // compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET!, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } 
    );

    
    res.status(200).json({
      message: 'Login successful',
      token,  
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus, 
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


// ============================================
// checking who am i
// ============================================

export const getMe = async (req: AuthRequest, res: Response) => {
  try {

    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};