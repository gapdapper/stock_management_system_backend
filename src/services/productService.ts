import type { IProduct, IProductRow, IShapedProduct } from "@/models/product";
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

export const getAllProductsWithVariant = async () => {
  const rows: IProductRow[] = await productRepository.getAllProductsWithVariant();
  if (!rows) {
    throw new NotFoundError({
      code: 404,
      message: "No products found",
      logging: false,
    });
  }

const result = rows.reduce<IShapedProduct[]>((acc, row) => {
    let product = acc.find(p => p.id === row.productId);

    if (!product) {
      product = {
        id: row.productId,
        productName: row.productName,
        totalStock: 0,
        lastUpdated: row.variantUpdatedAt ?? new Date(0),
        variants: [],
      };
      acc.push(product);
    }

    // total stock
    product.totalStock += row.qty ?? 0;

    // latest updated (from variant)
    if (
      row.variantUpdatedAt &&
      row.variantUpdatedAt > product.lastUpdated
    ) {
      product.lastUpdated = row.variantUpdatedAt;
    }

    if (!row.size || !row.color) return acc;

    let variant = product.variants.find(v => v.size === row.size);
    if (!variant) {
      variant = { size: row.size, sub: [] };
      product.variants.push(variant);
    }

    variant.sub.push({
      color: row.color,
      stock: row.qty ?? 0,
      minStock: row.minStock ?? 0,
    });

    return acc;
  }, []);


  return result;
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