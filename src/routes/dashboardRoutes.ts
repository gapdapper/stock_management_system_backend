import express from 'express';
import { getDashboardOverview } from "@/controllers/dashboardController"

const router = express.Router();

router.get('/', getDashboardOverview);

export default router;
