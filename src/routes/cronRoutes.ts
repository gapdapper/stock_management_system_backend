import * as express from 'express';
import { triggerLowStockAlert, triggerDailyUploadReminder } from '@/controllers/cronController';

const router = express.Router();

router.post('/triggerlowstockalert', triggerLowStockAlert);
router.post('/triggerdailyuploadreminder', triggerDailyUploadReminder);

export default router;