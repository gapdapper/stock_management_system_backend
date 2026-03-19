import type { Request, Response, NextFunction } from "express";
import * as productVariantService from "@/services/productVariantService";
import * as imageService from "@/services/imageService";

export const editProductVariant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const variantId = Number(req.params.id);
  if (isNaN(variantId)) {
    return res.status(400).json({
      message: "Invalid variant ID",
    });
  }
  const editedData = req.body;
  const updatedProduct = { ...editedData, id: variantId };
  try {
    const result = await productVariantService.editProductVariant(updatedProduct);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const restockProductVariant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const variants = req.body.items;
  if (!Array.isArray(variants) || variants.length === 0) {
    return res.status(400).json({
      message: "Restock payload is required",
    });
  }
  try {
    await productVariantService.restockProductVariant(variants);
    return res.status(200).json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProductVariantImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const variantId = Number(req.params.id);
    const result = await imageService.uploadImage(
      "variant",
      variantId,
      file,
    );
    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};
