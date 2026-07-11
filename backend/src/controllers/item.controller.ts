import { Request, Response } from 'express';
import { Item } from '../models/Item.model';
import { User } from '../models/User.model';
import { AuthRequest } from '../middlewares/auth';

// ============================================
// add item api 
// ============================================
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



// ============================================
// get item api 
// ============================================

export const getAllItems = async (req: Request, res: Response) => {
  try {

    const {
      search = '',          
      category = '',        
      minPrice,             
      maxPrice,             
      sort = 'newest',      
      page = 1,             
      limit = 8,            
    } = req.query;

    
    const filter: any = { status: 'active' }; 

    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },     
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    
    if (category) {
      filter.category = category;
    }

    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    
    let sortOption: any = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 8;
    const skip = (pageNum - 1) * limitNum;

    
    const [items, total] = await Promise.all([
      Item.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .populate('sellerId', 'name email') 
        .lean(), 
      Item.countDocuments(filter), 
    ]);

    
    res.status(200).json({
      success: true,
      results: items.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      items,
    });
  } catch (error) {
    console.error('Get all items error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


// ============================================
// get item by id api 
// ============================================

export const getSingleItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 

    const item = await Item.findById(id)
      .populate('sellerId', 'name email') 
      .populate('reviews.userId', 'name') 
      .lean();

    
    if (!item) {
      return res.status(404).json({ message: 'Property not found' });
    }

    
    const relatedItems = await Item.find({
      category: item.category,
      _id: { $ne: id }, 
      status: 'active', 
    })
      .limit(4) 
      .select('title price location imageUrl rating') 
      .lean();

    res.status(200).json({
      success: true,
      item,
      relatedItems,
    });
  } catch (error) {
    console.error('Get single item error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// ============================================
// delete item api 
// ============================================

export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;          
    const user = req.user;


    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (user.role !== 'admin' && item.sellerId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only delete your own properties.',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      message: 'Property deleted successfully!',
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
