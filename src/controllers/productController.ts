import * as productService from "@/services/productService";
import * as imageService from "@/services/imageService";
import type { Request, Response, NextFunction } from "express";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await productService.getAllProducts();
    return res.status(200).json({ products: results });
  } catch (error) {
    next(error);
  }
};

export const getAllProductsWithVariant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await productService.getAllProductsWithVariant();
    return res.status(200).json({ products: results });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId = Number(req.params.id);
  try {
    const result = await productService.getProductById(productId);
    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId = Number(req.params.id);
  const product = req.body;
  const updatedProduct = { ...product, id: productId };
  try {
    const result = await productService.editProduct(updatedProduct);
    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = req.body;
  try {
    const result = await productService.addProduct(product);
    return res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.id);
    const result = await productService.deleteProduct(productId);
    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const uploadProductImage = async (
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
    const result = await imageService.uploadProductImage("product", productId, file);
    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};
