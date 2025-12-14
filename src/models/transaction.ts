export interface ITransaction {
    id?: number;
    orderId: string;
    buyer: string;
    paymentTypeId: number;
    shippingPostalCode: string;
    platformId: number;
    isPaid: boolean;
    isReturned: boolean;
    note: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITransactionItem {
    transactionId: number;
    orderId?: string;
    productId: number;
    productVariantId: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}