import { Request, Response } from 'express';
import { Item } from '../models/Item.model';
import { User } from '../models/User.model';
import { AuthRequest } from '../middlewares/auth';


export const addItem = async (req: AuthRequest, res: Response) => {
  try {
    
    const user = req.user;
    if (user.role !== 'seller' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only sellers and admins can add properties.' });
    }

    const {
      title,
      shortDesc,
      fullDesc,
      price,
      location,
      category,
      imageUrl,
      bedrooms,
      bathrooms,
    } = req.body;


    if (user.role === 'seller' && user.subscriptionStatus !== 'active') {
      return res.status(403).json({
        message: 'Subscription required. Please activate your seller subscription first.',
      });
    }


    if (!title || !shortDesc || !fullDesc || !price || !location || !category || !imageUrl || !bedrooms || !bathrooms) {
      return res.status(400).json({ message: 'All fields are required' });
    }


    const newItem = new Item({
      title,
      shortDesc,
      fullDesc,
      price,
      location,
      category,
      imageUrl,
      bedrooms,
      bathrooms,
      sellerId: user._id,
      status: 'active',
      rating: 0,
      reviews: [],
    });

    
    await newItem.save();

    res.status(201).json({
      message: 'Property added successfully!',
      item: newItem,
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};