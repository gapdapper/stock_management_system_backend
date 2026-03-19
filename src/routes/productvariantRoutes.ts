import * as express from 'express';
import { editProductVariant, restockProductVariant, uploadProductVariantImage } from '@/controllers/productVariantController'
import multer from 'multer';
import { authenticateUser } from '@/middlewares/authentication';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.patch('/:id', authenticateUser, editProductVariant);
router.post('/restock', authenticateUser, restockProductVariant);
router.post('/:id/upload', authenticateUser, upload.single('image'), uploadProductVariantImage);

export default router;