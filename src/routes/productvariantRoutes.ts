import express from 'express';
import { editProductVariant, restockProductVariant } from '@/controllers/productVariantController'

const router = express.Router();

router.patch('/:id', editProductVariant);
router.post('/restock', restockProductVariant);

export default router;