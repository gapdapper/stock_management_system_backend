import express from 'express';
import { addProduct, deleteProduct, editProduct, getAllProducts, getProductById, getAllProductsWithVariant, uploadProductImage } from '@/controllers/productController';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAllProducts);
router.get('/all', getAllProductsWithVariant);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.patch('/:id', editProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/upload', upload.single('image'), uploadProductImage);

export default router;