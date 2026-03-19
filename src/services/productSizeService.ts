import NotFoundError from "@/utils/errors/not-found";
import * as productSizeRepository from "@/repositories/productSizeRepository";
import type { IProductSize } from "@/models/product";

export const getAllProductSizes = async () => {
    const productSizes = await productSizeRepository.getAllProductSizes();
    if (!productSizes) {
        throw new NotFoundError({
            code: 404,
            message: "No product sizes found",
            logging: false,
        });
    }
    return productSizes;
}

export const getProductSizeById = async (productSizeId: number) => {
    const productSize = await productSizeRepository.getProductSizeById(productSizeId);
    if (!productSize) {
        throw new NotFoundError({
            code: 404,
            message: `Product size with ID ${productSizeId} not found`,
            logging: false,
        });
    }
    return productSize;
}

export const editProductSize = async (productSize: IProductSize) => {
    const updatedProductSize = await productSizeRepository.editProductSize(productSize);
    if (!updatedProductSize) {
        throw new NotFoundError({
            code: 404,
            message: `Product size with ID ${productSize.id} not found`,
            logging: false,
        });
    }
    return updatedProductSize;
}

export const addProductSize = async (productSize: IProductSize) => {
    const newProductSize = await productSizeRepository.addProductSize(productSize);
    if (!newProductSize) {
        throw new Error("Failed to add new product size");
    }
    return newProductSize;
}

export const deleteProductSize = async (productSizeId: number) => {
    const product = await productSizeRepository.getProductSizeById(productSizeId);
    if (!product) {
        throw new NotFoundError({
            code: 404,
            message: `Product size with ID ${productSizeId} not found`,
            logging: false,
        });
    }
    const result = await productSizeRepository.deleteProductSize(productSizeId);
    return result;
}