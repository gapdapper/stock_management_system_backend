export interface ITransaction {
  id?: number;
  orderId: string;
  buyer: string;
  paymentTypeId: number;
  shippingPostalCode: string;
  platformId: number;
  status: TransactionStatus;
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

export interface ITransactionResponse {
  id: number;
  orderId: string;
  buyer: string;
  status: string;
  createdAt: Date;
  paymentType: string;
  platform: string;
  note: string;
  items?: ITransactionItemResponse[];
}

export interface ITransactionItemResponse {
  variantId: number;
  productName: string;
  size: string;
  color: string;
  quantity: number;
}

export type TransactionStatus =
  | "order placed"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled"
  | "completed";
