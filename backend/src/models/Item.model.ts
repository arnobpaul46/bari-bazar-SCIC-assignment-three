import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  title: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  location: string;
  category: string; 
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  status: 'active' | 'sold' | 'canceled'; 
  sellerId: mongoose.Types.ObjectId; 
  buyerId?: mongoose.Types.ObjectId; 
  rating: number;
  reviews: Array<{
    userId: mongoose.Types.ObjectId;
    text: string;
    rating: number;
    createdAt: Date;
  }>;
  createdAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    shortDesc: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    fullDesc: {
      type: String,
      required: [true, 'Full description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['বিক্রি', 'ভাড়া', 'সেমি-ফার্নিশড', 'ফার্নিশড'], 
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      default: '',
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms cannot be negative'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms cannot be negative'],
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'canceled'],
      default: 'active',
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Item = mongoose.model<IItem>('Item', ItemSchema);