import * as express from 'express';
import { getDashboardOverview, getAvailableMonths } from "@/controllers/dashboardController"
import { authenticateUser } from '@/middlewares/authentication';

const router = express.Router();

router.get('/overview/:month', authenticateUser, getDashboardOverview);
router.get('/months', authenticateUser, getAvailableMonths);

export default router;
