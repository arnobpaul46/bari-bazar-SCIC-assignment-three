import { Router } from 'express';
import { protect } from '../middlewares/auth';
import { Order } from '../models/Order.model';
import { Item } from '../models/Item.model';

const router = Router();

// ✅ অর্ডার চেক (ইতিমধ্যে অর্ডার করেছে কিনা)
router.get('/check/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    const order = await Order.findOne({ userId, itemId, status: { $ne: 'cancelled' } });
    res.json({ ordered: !!order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ অর্ডার তৈরি (প্লেস)
router.post('/', protect, async (req, res) => {
  try {
    console.log('🔍 POST /orders called with body:', req.body);
    const { itemId } = req.body;
    const userId = req.user._id;
    console.log('🔍 userId:', userId, 'itemId:', itemId);

    const item = await Item.findById(itemId);
    console.log('🔍 Item found:', item);
    if (!item) {
      console.log('❌ Item not found');
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.status === 'sold') {
      console.log('❌ Item already sold');
      return res.status(400).json({ message: 'Already sold' });
    }

    const existing = await Order.findOne({ userId, itemId, status: { $ne: 'cancelled' } });
    console.log('🔍 Existing order:', existing);
    if (existing) {
      console.log('❌ Already ordered');
      return res.status(400).json({ message: 'Already ordered this property' });
    }

    const order = new Order({ userId, itemId });
    await order.save();

    // ✅ 2 মিনিট পর অটো-কমপ্লিট (পূর্বে 10 মিনিট ছিল)
    setTimeout(async () => {
      const existingOrder = await Order.findById(order._id);
      if (existingOrder && existingOrder.status === 'pending') {
        existingOrder.status = 'completed';
        await existingOrder.save();
        console.log(`✅ Order ${order._id} auto-completed after 2 minutes`);
      }
    }, 2 * 60 * 1000); // 120,000 ms

    item.status = 'sold';
    await item.save();

    console.log('✅ Order created successfully');
    res.status(201).json({ message: 'Order placed', order });
  } catch (error) {
    console.error('❌ POST order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ সব অর্ডার পাওয়া (Buyer-এর নিজের)
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).populate('itemId').sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ অর্ডার ক্যান্সেল (শুধু ২ মিনিটের মধ্যে)
router.delete('/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // ✅ ২ মিনিট চেক (পূর্বে ১০ মিনিট)
    const minutesDiff = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60);
    if (minutesDiff > 2) {
      return res.status(400).json({ message: 'Cannot cancel after 2 minutes' });
    }

    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Order already completed' });
    }

    console.log('1. Order found:', order);
    order.status = 'cancelled';
    console.log('2. Status changed to cancelled');
    await order.save();
    console.log('3. Saved successfully');

    // আইটেমের স্ট্যাটাস আবার active করুন (কারণ অর্ডার বাতিল)
    const item = await Item.findById(order.itemId);
    if (item) {
      item.status = 'active';
      await item.save();
    }

    // ✅ অর্ডার ডিলিট করুন (ঐচ্ছিক – যদি চান যে ক্যান্সেল হওয়া অর্ডার না রাখতে)
    await order.deleteOne();

    res.json({ message: 'Order cancelled and removed successfully' });
  } catch (error) {
    console.error('❌ Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;