import { Router } from 'express';
import { addItem, getAllItems  } from '../controllers/item.controller';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/add', protect, addItem);
router.get('/', getAllItems);

export default router;