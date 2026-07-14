import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  createdAt: { type: Date, default: Date.now },
});


BookmarkSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export const Bookmark = mongoose.model<IBookmark>('Bookmark', BookmarkSchema);