export interface ITransaction {
    id?: number;
    orderId: string;
    buyerFirstName: string;
    buyerLastName: string;
    paymentTypeId: number;
    shippingProviderId: number;
    shippingPostalCode: string;
    platformId: number;
    isPaid: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITransactionItem {
    transactionId: number;
    productId: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}