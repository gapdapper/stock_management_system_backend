export interface IProduct {
    id?: number;
    productName: string;
    productSizeId: number;
    productColorId: number;
    productQty: number;
    updatedAt?: Date;
    createdAt?: Date;
}