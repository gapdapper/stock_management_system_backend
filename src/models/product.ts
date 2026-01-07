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

export interface IProductRow {
  productId: number;
  productName: string;
  size: string | null;
  color: string | null;
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
      color: string;
      stock: number;
      minStock: number;
    }[];
  }[];
};