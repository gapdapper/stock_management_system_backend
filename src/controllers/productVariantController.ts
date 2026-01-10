import type { Request, Response, NextFunction } from "express";
import * as productVariantService from '@/services/productVariantService';

export const editProductVariant = async (req: Request, res: Response, next: NextFunction) => {
    const productVariantId = Number(req.params.id);
    const editedData = req.body;
    const updatedProduct = { ...editedData, id: productVariantId };
    try {
        const result = await productVariantService.editProductVariant(updatedProduct);
        return res.status(200).json({ result });
    } catch (error) {
        next(error);
    }
}

export const restockProductVariant = async (req: Request, res: Response, next: NextFunction) => {
    const variants = req.body.items
    try {
        const result = await productVariantService.restockProductVariant(variants);
        return res.status(200).json({ result });
    } catch (error) {
        next(error);
    }
}