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
    if (!variants) {
        return res.status(400).json({
        success: false,
        message: "No product variant provided for replenishment.",
      });
    }
    try {
        const result = await productVariantService.restockProductVariant(variants);
        return res.status(200).json({ result });
    } catch (error) {
        next(error);
    }
}

export const uploadProductVariantImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const productId = Number(req.params.id);
    const result = await productVariantService.uploadProductImage(productId, file);
    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};