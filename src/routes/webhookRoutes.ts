import * as express from 'express';
import { webhookHandler } from '@/controllers/webhookController';
const router = express.Router();


router.post('/line', webhookHandler);

export default router;