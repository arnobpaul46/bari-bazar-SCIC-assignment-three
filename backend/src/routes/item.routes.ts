import { Router } from 'express';
import { addItem } from '../controllers/item.controller';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/add', protect, addItem);

export default router;