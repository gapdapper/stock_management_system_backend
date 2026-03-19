import type { Request, Response, NextFunction } from 'express';
import * as productSizeService from '@/services/productSizeService';

export const getAllProductSizes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productSizeService.getAllProductSizes();
        return res.status(200).json({ productSizes: result });
    } catch (error) {
        next(error);   
    }
}

export const getProductSizeById = async (req: Request, res: Response, next: NextFunction) => {
    const productSizeId = Number(req.params.id);
    try {
        const result = await productSizeService.getProductSizeById(productSizeId);
        return res.status(200).json({ productSize: result });
    } catch (error) {
        next(error);
    }
}

export const editProductSize = async (req: Request, res: Response, next: NextFunction) => {
    const productSizeId = Number(req.params.id);
    const productSize = req.body;
    const updatedProductSize = { ...productSize, id: productSizeId };
    try {
        const result = await productSizeService.editProductSize(updatedProductSize);
        return res.status(200).json({ productSize: result });
    } catch (error) {
        next(error);
    }
}

export const addProductSize = async (req: Request, res: Response, next: NextFunction) => {
    const productSize = req.body;
    try {
        const result = await productSizeService.addProductSize(productSize);
        return res.status(201).json({ productSize: result });
    } catch (error) {
        next(error);
    }
}

export const deleteProductSize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productSizeId = Number(req.params.id);
        const result = await productSizeService.deleteProductSize(productSizeId);
        return res.status(204).json({ result });
    } catch (error) {
        next(error);
    }
}