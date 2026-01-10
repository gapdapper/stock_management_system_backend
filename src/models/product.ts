export interface IProduct {
    id?: number;
    productName: string;
    productSizeId: number;
    productColorId: number;
    productQty: number;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface IProductSize {
    id?: number;
    size: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface IProductColor {
    id?: number;
    color: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface IProductVariant {
  id: number;
  productId: number;
  colorId: number;
  sizeId: number;
  qty: number;
  minStock: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface IProductVariantPayload {
  variantId: number;
  qty: number;
}

export interface IProductRow {
  productId: number;
  productName: string;
  size: string | null;
  color: string | null;
  variantId: number | null;
  qty: number | null;
  minStock: number | null;
  variantUpdatedAt: Date | null;
}

export interface IShapedProduct {
  id: number;
  productName: string;
  totalStock: number;
  lastUpdated: Date;
  variants: {
    size: string;
    sub: {
      variantId: number;
      color: string;
      stock: number;
      minStock: number;
    }[];
  }[];
};