import type { Request, Response, NextFunction } from 'express';
import * as productColorService from '@/services/productColorService';

export const getAllProductColors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productColorService.getAllProductColors();
        return res.status(200).json({ productColors: result });
    } catch (error) {
        next(error);
    }
}

export const getProductColorById = async (req: Request, res: Response, next: NextFunction) => {
    const productColorId = Number(req.params.id);
    try {
        const result = await productColorService.getProductColorById(productColorId);
        return res.status(200).json({ productColor: result });
    } catch (error) {
        next(error);
    }
}

export const editProductColor = async (req: Request, res: Response, next: NextFunction) => {
    const productColorId = Number(req.params.id);
    const productColor = req.body;
    const updatedProductColor = { ...productColor, id: productColorId };
    try {
        const result = await productColorService.editProductColor(updatedProductColor);
        return res.status(200).json({ productColor: result });
    } catch (error) {
        next(error);
    }
}

export const addProductColor = async (req: Request, res: Response, next: NextFunction) => {
    const productColor = req.body;
    try {
        const result = await productColorService.addProductColor(productColor);
        return res.status(201).json({ productColor: result });
    } catch (error) {
        next(error);
    }
}

export const deleteProductColor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productColorId = Number(req.params.id);
        const result = await productColorService.deleteProductColor(productColorId);
        return res.status(204).json({ result });
    } catch (error) {
        next(error);
    }
}