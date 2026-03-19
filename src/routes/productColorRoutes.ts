import * as express from 'express';
import { addProductColor, deleteProductColor, editProductColor, getAllProductColors, getProductColorById } from '@/controllers/productColorController';
import { authenticateUser } from '@/middlewares/authentication';

const router = express.Router();

router.get('/', authenticateUser, getAllProductColors);
router.get('/:id', authenticateUser, getProductColorById);
router.post('/', authenticateUser, addProductColor);
router.patch('/:id', authenticateUser, editProductColor);
router.delete('/:id', authenticateUser, deleteProductColor);

export default router;