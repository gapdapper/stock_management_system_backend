export interface IProduct {
  id: number;
  productName: string;
  productSizeId: number;
  productColorId: number;
  productQty: number;
  imageUrl: string | null;
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
  colorId: number | null;
  sizeId: number | null;
  qty: number;
  minStock: number;
  imageUrl: string | null;
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
  productImageUrl: string | null;
  variantUpdatedAt: Date | null;
  variantImageUrl: string | null;
}

export interface IShapedProduct {
  id: number;
  productName: string;
  totalStock: number;
  productImageUrl: string | null;
  lastUpdated: Date;
  variants: IProductVariantGroup[];
}

interface IProductVariantGroup {
  size: string;
  sub: IProductVariantDetail[];
}

interface IProductVariantDetail {
  variantId: number;
  color: string;
  stock: number;
  minStock: number;
  variantImageUrl: string | null;
}