import express from 'express';
import { getUploadLog } from '@/controllers/dailyUploadLogController';

const router = express.Router();

router.get('/', getUploadLog);

export default router;