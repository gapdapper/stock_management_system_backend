import type { IProduct } from "@/models/product";
import * as productRepository from "@/repositories/productRepository";
import NotFoundError from "@/utils/errors/not-found";

export const getAllProducts = async () => {
  const products = await productRepository.getAllProducts();
  if (!products) {
    throw new NotFoundError({
      code: 404,
      message: "No products found",
      logging: false,
    });
  }
  return products;
};

export const getProductById = async (productId: number) => {
  const product = await productRepository.getProductById(productId);
  if (!product) {
    throw new NotFoundError({
      code: 404,
      message: `Product with ID ${productId} not found`,
      logging: false,
    });
  }
  return product;
}

export const editProduct = async (product: IProduct) => {
  const updatedProduct = await productRepository.editProduct(product);
  if (!updatedProduct) {
    throw new NotFoundError({
      code: 404,
      message: `Product with ID ${product.id} not found`,
      logging: false,
    });
  }
  return updatedProduct;
}

export const addProduct = async (product: IProduct) => {
  const newProduct = await productRepository.addProduct(product);
  if (!newProduct) {
    throw new Error("Failed to add new product");
  }
  return newProduct;
}

export const deleteProduct = async (productId: number) => {
  const product = await productRepository.getProductById(productId);
  if (!product) {
    throw new NotFoundError({
      code: 404,
      message: `Product with ID ${productId} not found`,
      logging: false,
    });
  }
  const result = await productRepository.deleteProduct(productId);
  return result;
}