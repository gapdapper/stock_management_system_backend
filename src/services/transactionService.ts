import NotFoundError from "@/utils/errors/not-found";
import type { ITransaction, ITransactionItem } from "@/models/transaction";
import * as transactionRepository from "@/repositories/transactionRepository";
import * as productVariantRepositry from "@/repositories/productVariantRepository";
import * as XLSX from "xlsx";
import { cleanSheetData, lookupPaymentTypeId, platformMapper, productIdFinder, variantIdFinder } from "@/utils/sheets/sheet";
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
  productVariantId: number,
  quantity: number
) => {
  const transactionItem: ITransactionItem = {
    transactionId,
    productId,
    productVariantId,
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
  productVariantId: number,
  quantity: number
) => {
  const transactionItem: ITransactionItem = {
    transactionId,
    productId,
    productVariantId,
    quantity,
  };
  const updatedTransactionItem =
    await transactionRepository.editTransactionItem(transactionItem);
  return updatedTransactionItem;
};

export const deleteTransactionItem = async (
  transactionId: number,
  productId: number,
  productVariantId: number
) => {
  await transactionRepository.deleteTransactionItem(transactionId, productId, productVariantId);
};
// #endregion

// #region Transaction Upload
export const processUploadedTransactionFiles = async (
  files: Express.Multer.File[]
) => {
  let transactionBatch: ITransaction[] = [];
  let transactionItemBatch: ITransactionItem[] = [];


  try {
    // Placeholder for processing logic
    for (const file of files) {
      const workbook = XLSX.read(file.buffer, { type: "buffer", raw: true });
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
      let rawData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
      if (file.mimetype === "text/csv") {
        rawData = cleanSheetData(rawData);
      }
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
  
          const productId = productIdFinder(normalizedResult['productName'], provider) || 0;
          const {colorId, sizeId} = variantIdFinder(productId, normalizedResult['productName'], normalizedResult['variation'], provider);
          const productVariant = await productVariantRepositry.getProductVariantByProductIdColorIdSizeId(productId, colorId, sizeId);
          const quantity = parseInt(normalizedResult['quantity']) || 1;
          // console.log("product name:" + normalizedResult['productName'] + ", variation: " + normalizedResult['variation'] + ", productId: " + productId + ", colorId: " + colorId + ", sizeId: " + sizeId);
  
          // console.log(productVariant);
          // if (!productVariant) {
          //   console.log("Product Variant not found for productId:", productId, "ColorId:", colorId, "SizeId:", sizeId, "variation:", normalizedResult['variation'], "productName:", normalizedResult['productName']);
          // }
          const transaction: ITransaction = {
            orderId: normalizedResult['orderId'].toString(),
            buyer: normalizedResult['buyer'],
            paymentTypeId: lookupPaymentTypeId(normalizedResult['paymentMethod']),
            shippingPostalCode: normalizedResult['postalCode'],
            platformId: platformMapper(provider).id,
            isPaid: normalizedResult['isPaid'] ? true : false,
            isReturned: fileType === 'return' ? true : false,
            note: normalizedResult['cancelReason'] || "N/A",
          }

          if (provider === 'shopee') {
            transaction.isReturned = normalizedResult['cancelReason'] ? true : false;
          }
          
          const duplicate = transactionBatch.find(t => t.orderId === transaction.orderId);
          if (!duplicate) {
            transactionBatch.push(transaction);
          }
  
  
          const transactionItem = {
            transactionId: 0, // to be filled after transaction is created
            orderId: normalizedResult['orderId'],
            productId: productId,
            productVariantId: productVariant ? productVariant.id : 0,
            quantity: quantity,
          };
          const duplicateItem = transactionItemBatch.find(ti => ti.orderId === transactionItem.orderId && ti.productId === transactionItem.productId && ti.productVariantId === transactionItem.productVariantId);
          if (!duplicateItem) {
            transactionItemBatch.push(transactionItem);
            continue;
          }
          duplicateItem.quantity += transactionItem.quantity;
    }
    }

    // console.log("Transaction Items to be added:", transactionItemBatch);
    // console.log("Prepared Transactions:", transactionBatch);
    const createdTransaction = await transactionRepository.addMultipleTransactions(transactionBatch);
    if (!createdTransaction) {
      throw new Error("Failed to create transactions");
    }
  
    for (const item of transactionItemBatch) {
      const created = createdTransaction.find(t => t.orderId === item.orderId);
      if (created) {
        item.transactionId = created.insertedId;
        delete item.orderId;
      }
    }
    await transactionRepository.addMultipleTransactionItems(transactionItemBatch);
    
  } catch (error) {
    console.error("Error processing uploaded transaction files:", error);
    throw error;
  }

};
// #endregion
