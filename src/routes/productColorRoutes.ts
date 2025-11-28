import express from 'express';
import { addProductColor, deleteProductColor, editProductColor, getAllProductColors, getProductColorById } from '@/controllers/productColorController';

const router = express.Router();

router.get('/', getAllProductColors);
router.get('/:id', getProductColorById);
router.post('/addProductColor', addProductColor);
router.patch('/editProductColor', editProductColor);
router.delete('/:id', deleteProductColor);

export default router;