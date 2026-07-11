import { Router } from 'express';
import { getAllUsers, changeUserRole } from '../controllers/admin.controller';
import { protect } from '../middlewares/auth';

const router = Router();


router.get('/users', protect, getAllUsers);
router.put('/users/:id/role', protect, changeUserRole);

export default router;