import type { Request, Response, NextFunction } from "express";
import * as dashboardService from "@/services/dashboardService"

export const getDashboardOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const month = req.params.month;
        if (!month) throw new Error("No month provided")
        const results = await dashboardService.getDashboardStats(month);
        return res.status(200).json({ overview: results });
    } catch (error) {
        next(error);
    }
}

export const getAvailableMonths = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await dashboardService.getAvailableMonths();
        return res.status(200).json({ availableMonths: results });
    } catch (error) {
        next(error);
    }
}