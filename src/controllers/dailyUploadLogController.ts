import type { Request, Response, NextFunction } from 'express';
import * as dailyUploadLogService from '@/services/dailyUploadLogService';

export const getUploadLog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await dailyUploadLogService.getUploadLog();
        return res.status(200).json({ uploadLog: result });
    } catch (error) {
        next(error);
    }
}