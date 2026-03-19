import * as express from 'express';
import { addProductSize, deleteProductSize, editProductSize, getAllProductSizes, getProductSizeById } from '@/controllers/productSizeController';
import { authenticateUser } from '@/middlewares/authentication';

const router = express.Router();

router.get('/', authenticateUser, getAllProductSizes);
router.get('/:id', authenticateUser, getProductSizeById);
router.post('/', authenticateUser, addProductSize);
router.patch('/:id', authenticateUser, editProductSize);
router.delete('/:id', authenticateUser, deleteProductSize);

export default router;