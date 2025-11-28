import NotFoundError from "@/utils/errors/not-found";
import * as productColorRepository from "@/repositories/productColorRepository";
import type { IProductColor } from "@/models/product";

export const getAllProductColors = async () => {
    const productColors = await productColorRepository.getAllProductColors();
    if (!productColors) {
        throw new NotFoundError({
            code: 404,
            message: "No product colors found",
            logging: false,
        });
    }
    return productColors;
}

export const getProductColorById = async (productColorId: number) => {
    const productColor = await productColorRepository.getProductColorById(productColorId);
    if (!productColor) {
        throw new NotFoundError({
            code: 404,
            message: `Product color with ID ${productColorId} not found`,
            logging: false,
        });
    }
    return productColor;
}

export const editProductColor = async (productColor: IProductColor) => {
    const updatedProductColor = await productColorRepository.editProductColor(productColor);
    if (!updatedProductColor) {
        throw new NotFoundError({
            code: 404,
            message: `Product color with ID ${productColor.id} not found`,
            logging: false,
        });
    }
    return updatedProductColor;
}

export const addProductColor = async (productColor: IProductColor) => {
    const newProductColor = await productColorRepository.addProductColor(productColor);
    if (!newProductColor) {
        throw new Error("Failed to add new product color");
    }
    return newProductColor;
}

export const deleteProductColor = async (productColorId: number) => {
    const product = await productColorRepository.getProductColorById(productColorId);
    if (!product) {
        throw new NotFoundError({
            code: 404,
            message: `Product color with ID ${productColorId} not found`,
            logging: false,
        });
    }
    await productColorRepository.deleteProductColor(productColorId);
}