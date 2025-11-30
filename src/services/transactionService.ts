import NotFoundError from "@/utils/errors/not-found";
import type { ITransaction, ITransactionItem } from "@/models/transaction";
import * as transactionRepository from "@/repositories/transactionRepository";

// #region Transaction
export const getAllTransactions = async () => {
  const transactions = await transactionRepository.getAllTransactions();
  if (!transactions) {
    throw new NotFoundError({
      code: 404,
      message: "No transactions found",
      logging: false,
    });
  }
  return transactions;
};

export const getTransactionById = async (transactionId: number) => {
  const transaction = await transactionRepository.getTransactionById(
    transactionId
  );
  if (!transaction) {
    throw new NotFoundError({
      code: 404,
      message: `Transaction with ID ${transactionId} not found`,
      logging: false,
    });
  }
  return transaction;
};

export const editTransaction = async (transaction: ITransaction) => {
  const updatedTransaction = await transactionRepository.editTransaction(
    transaction
  );
  if (!updatedTransaction) {
    throw new NotFoundError({
      code: 404,
      message: `Transaction with ID ${transaction.id} not found`,
      logging: false,
    });
  }
  return updatedTransaction;
};

export const addTransaction = async (transaction: ITransaction) => {
  const newTransaction = await transactionRepository.addTransaction(
    transaction
  );
  return newTransaction;
};

export const deleteTransaction = async (transactionId: number) => {
  const transaction = await transactionRepository.getTransactionById(
    transactionId
  );
  if (!transaction) {
    throw new NotFoundError({
      code: 404,
      message: `Transaction with ID ${transactionId} not found`,
      logging: false,
    });
  }
  await transactionRepository.deleteTransaction(transactionId);
};
// #endregion

// #region Transaction Item

export const getTransactionItemsById = async (transactionId: number) => {
  const items = await transactionRepository.getTransactionItemsById(
    transactionId
  );
  if (!items || items.length === 0) {
    throw new NotFoundError({
      code: 404,
      message: `No items found for Transaction with ID ${transactionId}`,
      logging: false,
    });
  }
  return items;
};

export const addTransactionItem = async (
  transactionId: number,
  productId: number,
  quantity: number
) => {
  const transactionItem: ITransactionItem = {
    transactionId,
    productId,
    quantity,
  };
  const newTransactionItem = await transactionRepository.addTransactionItem(
    transactionItem
  );
  return newTransactionItem;
};

export const editTransactionItem = async (
  transactionId: number,
  productId: number,
  quantity: number
) => {
  const transactionItem: ITransactionItem = {
    transactionId,
    productId,
    quantity,
  };
  const updatedTransactionItem = await transactionRepository.editTransactionItem(
    transactionItem
  );
  return updatedTransactionItem;
};

export const deleteTransactionItem = async (
  transactionId: number,
  productId: number
) => {
  await transactionRepository.deleteTransactionItem(transactionId, productId);
};
// #endregion