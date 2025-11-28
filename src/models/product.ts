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