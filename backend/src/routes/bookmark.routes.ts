import { Router } from 'express';
import { protect } from '../middlewares/auth';
import { Bookmark } from '../models/Bookmark.model';
import { Item } from '../models/Item.model';

const router = Router();


router.post('/', protect, async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user._id;

    if (!itemId) return res.status(400).json({ message: 'Item ID required' });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const existing = await Bookmark.findOne({ userId, itemId });
    if (existing) return res.status(400).json({ message: 'Already bookmarked' });

    const bookmark = new Bookmark({ userId, itemId });
    await bookmark.save();
    res.status(201).json({ message: 'Bookmark added', bookmark });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/check/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    const bookmark = await Bookmark.findOne({ userId, itemId });
    res.json({ bookmarked: !!bookmark });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const bookmarks = await Bookmark.find({ userId }).populate('itemId');
    const items = bookmarks.map(b => b.itemId);
    res.json({ bookmarks: items });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    const result = await Bookmark.findOneAndDelete({ userId, itemId });
    if (!result) return res.status(404).json({ message: 'Bookmark not found' });
    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;