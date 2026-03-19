import * as express from 'express';
import { addProduct, deleteProduct, editProduct, getAllProducts, getProductById, getAllProductsWithVariant, uploadProductImage } from '@/controllers/productController';
import multer from 'multer';
import { authenticateUser } from '@/middlewares/authentication';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', authenticateUser, getAllProducts);
router.get('/all', authenticateUser, getAllProductsWithVariant);
router.get('/:id', authenticateUser, getProductById);
router.post('/', authenticateUser, addProduct);
router.patch('/:id', authenticateUser, editProduct);
router.delete('/:id', authenticateUser, deleteProduct);
router.post('/:id/upload', authenticateUser, upload.single('image'), uploadProductImage);

export default router;