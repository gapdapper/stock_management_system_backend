import * as express from 'express';
import { getUploadLog } from '@/controllers/dailyUploadLogController';
import { authenticateUser } from '@/middlewares/authentication';

const router = express.Router();

router.get('/', authenticateUser, getUploadLog);

export default router;