import type { Request, Response, NextFunction } from "express";
import * as dailyUploadLogService from '@/services/dailyUploadLogService';
import * as productVariantService from "@/services/productVariantService";

export const triggerLowStockAlert = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await productVariantService.checkLowStockProduct();
        return res.status(200).json({ status: "success", "message": "Low stock alert job triggered" });
    } catch (error) {
        next(error);
    }
}

export const triggerDailyUploadReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await dailyUploadLogService.checkDailyUploadLog(new Date());
        return res.status(200).json({ status: "success", "message": "Daily upload reminder job triggered" });
    } catch (error) {
        next(error);
    }
}