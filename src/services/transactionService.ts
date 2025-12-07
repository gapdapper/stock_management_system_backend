import NotFoundError from "@/utils/errors/not-found";
import type { ITransaction, ITransactionItem } from "@/models/transaction";
import * as transactionRepository from "@/repositories/transactionRepository";
import * as XLSX from "xlsx";
import { lookupProductId, lookupVariantId } from "@/utils/sheets/sheet";
import { SignatureRules } from "@/utils/sheets/rules";

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
  const updatedTransactionItem =
    await transactionRepository.editTransactionItem(transactionItem);
  return updatedTransactionItem;
};

export const deleteTransactionItem = async (
  transactionId: number,
  productId: number
) => {
  await transactionRepository.deleteTransactionItem(transactionId, productId);
};
// #endregion

// #region Transaction Upload
export const processUploadedTransactionFiles = async (
  files: Express.Multer.File[]
) => {
  // Placeholder for processing logic
  for (const file of files) {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    if (workbook.SheetNames[0] === undefined) {
      throw new Error("Uploaded spreadsheet contains no sheets");
    }
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    if (worksheet === undefined) {
      throw new Error(
        "Failed to read the first sheet of the uploaded spreadsheet"
      );
    }
    const headers = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    })[0] as string[];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    const detected = SignatureRules.find((rule) =>
      rule.mustHave.every((header) => headers.includes(header))
    );

    if (!detected) {
      throw new Error("Unrecognized spreadsheet format");
    }

    const { provider, fileType } = detected;

    const headerLookup: Record<string, number> = {};
    headers.forEach((h, idx) => headerLookup[h] = idx);


    for (const row of rawData) {
      let result: Record<string, any> = {};
      const index = SignatureRules.findIndex(r => r.provider === detected.provider && r.fileType === detected.fileType);

      for (const key of detected.keyColumns) {
        const index = headerLookup[key];
        result[key] = index !== undefined ? (row as any)[key] : null;
      }
      
      const map = SignatureRules[index]?.normalizedColumns!;
      const normalizedResult: Record<string, any> = {};

      for (const [key, value] of Object.entries(map)) {
        if (key === "isPaid") {
          normalizedResult[key] = result[value] !== '-' && result[value] !== 'null' && result[value] !== null ? true : false;
          continue;
        }
        normalizedResult[key] = result[value] !== undefined ? result[value] : null;
      }


      try {
        const productId = lookupProductId(normalizedResult['productName'], normalizedResult['variation']);
        const {ColorId, SizeId} = lookupVariantId(normalizedResult['productName'], normalizedResult['variation']);
        const quantity = parseInt(normalizedResult['quantity']) || 1;
      } catch (error) {
        console.error("Error looking up product ID:", error);
      }

      // console.log("Normalized Result:", normalizedResult);
    }
  }
};
// #endregion
