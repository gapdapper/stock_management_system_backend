import express from 'express';
import { editProductVariant, restockProductVariant, uploadProductVariantImage } from '@/controllers/productVariantController'
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.patch('/:id', editProductVariant);
router.post('/restock', restockProductVariant);
router.post('/:id/upload', upload.single('image'), uploadProductVariantImage);

export default router;