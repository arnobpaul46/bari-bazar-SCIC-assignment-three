import { Router } from 'express';
import { addItem, getAllItems, getSingleItem  } from '../controllers/item.controller';
import { protect } from '../middlewares/auth';

const router = Router();
// protected routes
router.post('/add', protect, addItem);
// public routes
router.get('/', getAllItems);
router.get('/:id', getSingleItem); 

export default router;