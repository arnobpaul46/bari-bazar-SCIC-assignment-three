import { Router } from 'express';
import { addItem, getAllItems, getSingleItem, deleteItem  } from '../controllers/item.controller';
import { protect } from '../middlewares/auth';

const router = Router();
// protected routes
router.post('/add', protect, addItem);
router.delete('/:id', protect, deleteItem);
// public routes
router.get('/', getAllItems);
router.get('/:id', getSingleItem); 

export default router;