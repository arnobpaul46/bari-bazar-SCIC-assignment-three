import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;                     
  email: string;                    
  password: string;                 
  role: 'buyer' | 'seller' | 'admin'; 
  image?: string;                   
  subscriptionStatus: 'active' | 'expired' | 'none'; 
  subscriptionExpiry?: Date;        
  stripeCustomerId?: string;        
}


const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'], 
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,                          
      lowercase: true,                       
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'], 
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],   
      default: 'buyer',                      
    },
    image: {
      type: String,
      default: '',                           
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'expired', 'none'],
      default: 'none',                       
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
    stripeCustomerId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, 
  }
);


export const User = mongoose.model<IUser>('User', UserSchema);