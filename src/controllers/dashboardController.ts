import type { Request, Response, NextFunction } from "express";
import * as dashboardService from "@/services/dashboardService"

export const getDashboardOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await dashboardService.getDashboardStats();
        return res.status(200).json({ overview: results });
    } catch (error) {
        next(error);
    }
}