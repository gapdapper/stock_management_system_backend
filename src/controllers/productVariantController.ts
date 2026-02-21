import type { Request, Response, NextFunction } from "express";
import * as productVariantService from '@/services/productVariantService';
import * as imageService from '@/services/imageService';

export const editProductVariant = async (req: Request, res: Response, next: NextFunction) => {
    const variantId = Number(req.params.id);
    const editedData = req.body;
    const updatedProduct = { ...editedData, id: variantId };
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
    const variantId = Number(req.params.id);
    const result = await imageService.uploadProductImage("variant", variantId, file)
    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};