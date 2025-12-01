import express from 'express';
import { addProduct, deleteProduct, editProduct, getAllProduct, getProductById } from '@/controllers/productController';

const router = express.Router();

router.get('/', getAllProduct);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.patch('/:id', editProduct);
router.delete('/:id', deleteProduct);

export default router;