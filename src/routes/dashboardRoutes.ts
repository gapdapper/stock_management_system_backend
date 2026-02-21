import express from 'express';
import { getDashboardOverview, getAvailableMonths } from "@/controllers/dashboardController"

const router = express.Router();

router.get('/overview/:month', getDashboardOverview);
router.get('/months', getAvailableMonths);

export default router;
