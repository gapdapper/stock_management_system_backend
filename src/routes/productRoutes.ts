import express from 'express';
import { addProduct, deleteProduct, editProduct, getAllProducts, getProductById, getAllProductsWithVariant } from '@/controllers/productController';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/all', getAllProductsWithVariant);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.patch('/:id', editProduct);
router.delete('/:id', deleteProduct);

export default router;