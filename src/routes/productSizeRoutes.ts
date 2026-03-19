import express from 'express';
import { addProductSize, deleteProductSize, editProductSize, getAllProductSizes, getProductSizeById } from '@/controllers/productSizeController';

const router = express.Router();

router.get('/', getAllProductSizes);
router.get('/:id', getProductSizeById);
router.post('/', addProductSize);
router.patch('/:id', editProductSize);
router.delete('/:id', deleteProductSize);

export default router;