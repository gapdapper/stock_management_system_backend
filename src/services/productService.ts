import { supabase } from "@/db/supabase";
import type { IProduct, IProductRow, IShapedProduct } from "@/models/product";
import * as productRepository from "@/repositories/productRepository";
import NotFoundError from "@/utils/errors/not-found";
import { getSizeIndex } from "@/utils/product";
import sharp from "sharp";

export const getAllProducts = async () => {
  const products = await productRepository.findAll();
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
  const rows: IProductRow[] =
    await productRepository.findAllWithVariant();
  if (!rows) {
    throw new NotFoundError({
      code: 404,
      message: "No products found",
      logging: false,
    });
  }

  const result = rows.reduce<IShapedProduct[]>((acc, row) => {
    let product = acc.find((p) => p.id === row.productId);

    if (!product) {
      product = {
        id: row.productId,
        productName: row.productName,
        totalStock: 0,
        productImageUrl: row.productImageUrl ?? "",
        lastUpdated: row.variantUpdatedAt ?? new Date(0),
        variants: [],
      };
      acc.push(product);
    }

    // total stock
    product.totalStock += row.qty ?? 0;

    // latest updated (from variant)
    if (row.variantUpdatedAt && row.variantUpdatedAt > product.lastUpdated) {
      product.lastUpdated = row.variantUpdatedAt;
    }

    if (!row.size || !row.color || !row.variantId) return acc;

    let variant = product.variants.find((v) => v.size === row.size);
    if (!variant) {
      variant = { size: row.size, sub: [] };
      product.variants.push(variant);
    }

    variant.sub.push({
      variantId: row.variantId,
      color: row.color,
      stock: row.qty ?? 0,
      minStock: row.minStock ?? 0,
      variantImageUrl: row.variantImageUrl ?? "",
    });

    return acc;
  }, []);

  result.forEach((product) => {
    product.variants.sort(
      (a, b) => getSizeIndex(a.size) - getSizeIndex(b.size),
    );

    product.variants.forEach((v) => {
      v.sub.sort((a, b) => a.color.localeCompare(b.color));
    });
  });

  return result;
};

export const getProductById = async (productId: number) => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new NotFoundError({
      code: 404,
      message: `Product with ID ${productId} not found`,
      logging: false,
    });
  }
  return product;
};

export const editProduct = async (product: IProduct) => {
  const {id, ...formattedProduct} = product;
  const updatedProduct = await productRepository.updateById(product.id, formattedProduct);
  if (!updatedProduct) {
    throw new NotFoundError({
      code: 404,
      message: `Product with ID ${product.id} not found`,
      logging: false,
    });
  }
  return updatedProduct;
};

export const addProduct = async (product: IProduct) => {
  const newProduct = await productRepository.create(product);
  if (!newProduct) {
    throw new Error("Failed to add new product");
  }
  return newProduct;
};

export const deleteProduct = async (productId: number) => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new NotFoundError({
      code: 404,
      message: `Product with ID ${productId} not found`,
      logging: false,
    });
  }
  const result = await productRepository.deleteById(productId);
  return result;
};

export const uploadProductImage = async (
  productId: number,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!file.mimetype.startsWith("image/")) {
    throw new Error("Invalid file type");
  }

  const product = await productRepository.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  try {
    const webpBuffer = await sharp(file.buffer)
      .resize({
        width: 1024,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    const filePath = `products/${productId}/cover-${Date.now()}.webp`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, webpBuffer, {
        contentType: "image/webp",
      });

    if (error) {
      throw new Error("Failed to upload image");
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    const updatedObj = { imageUrl: data.publicUrl };
    await productRepository.updateById(productId, updatedObj);

    // remove previous image
    if (product.imageUrl) {
      const oldPath = product.imageUrl.split(
        "/storage/v1/object/public/product-images/",
      )[1];
      if (oldPath) {
        await supabase.storage.from("product-images").remove([oldPath]);
      }
    }

    return data.publicUrl;
  } catch (err) {
    console.error("uploadProductImage failed:", err);
    throw new Error("Failed to upload product image");
  }
};
