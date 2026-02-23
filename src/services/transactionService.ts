import NotFoundError from "@/utils/errors/not-found";
import type {
  ITransaction,
  ITransactionItem,
  ITransactionResponse,
  TransactionStatus,
} from "@/models/transaction";
import * as transactionRepository from "@/repositories/transactionRepository";
import * as productVariantRepository from "@/repositories/productVariantRepository";
import * as dailyUploadLogRepository from "@/repositories/dailyUploadLogRepository";
import * as XLSX from "xlsx";
import {
  cleanSheetData,
  lookupPaymentTypeId,
  platformMapper,
  productIdFinder,
  statusMapper,
  variantIdFinder,
} from "@/utils/sheets/sheet";
import { SignatureRules } from "@/utils/sheets/rules";
import BadRequestError from "@/utils/errors/bad-request";

// #region Transaction
export const getTransactions = async () => {
  await dailyUploadLogRepository.updateDailyUploadLog(new Date());
  const transactions = await transactionRepository.findAllTransactions();
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
  const transaction = await transactionRepository.findTransactionById(
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

export const getTransactionByOrderId = async (orderId: string) => {
  const transaction = await transactionRepository.findTransactionByOrderId(
    orderId
  );
  if (!transaction) {
    throw new NotFoundError({
      code: 404,
      message: `Transaction with Order ID ${orderId} not found`,
      logging: false,
    });
  }

  const transactionWithGrouppedItems = {
    orderId: transaction[0]?.orderId,
    buyer: transaction[0]?.buyer,
    status: transaction[0]?.status,
    createdAt: transaction[0]?.createdAt,
    paymentType: transaction[0]?.paymentType,
    platform: transaction[0]?.platform,
    items: transaction.map((item) => {
      return {
        variantId: item.variantId,
        productName: item.productName,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      };
    }),
  };

  return transactionWithGrouppedItems;
};

export const editTransaction = async (transaction: ITransaction) => {
  const updatedTransaction = await transactionRepository.updateTransaction(
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
  const newTransaction = await transactionRepository.createTransaction(
    transaction
  );
  return newTransaction;
};

export const deleteTransaction = async (transactionId: number) => {
  const transaction = await transactionRepository.findTransactionById(
    transactionId
  );
  if (!transaction) {
    throw new NotFoundError({
      code: 404,
      message: `Transaction with ID ${transactionId} not found`,
      logging: false,
    });
  }
  await transactionRepository.deleteTransactionById(transactionId);
};
// #endregion

// #region Transaction Item

export const getTransactionItemsById = async (transactionId: number) => {
  const items = await transactionRepository.findTransactionItemsByTransactionId(
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
  const newTransactionItem = await transactionRepository.createTransactionItem(
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
    await transactionRepository.updateTransactionItem(transactionItem);
  return updatedTransactionItem;
};

export const deleteTransactionItem = async (
  transactionId: number,
  productId: number,
  productVariantId: number
) => {
  await transactionRepository.deleteTransactionItem(
    transactionId,
    productId,
    productVariantId
  );
};
// #endregion

// #region Transaction Upload
export const processImportedTransactionFiles = async (
  files: Express.Multer.File[]
) => {
  if(!files){
        throw new BadRequestError({
        code: 400,
        message: "transaction file is required",
        logging: true,
      });
  }


  let transactionBatch: ITransaction[] = [];
  let transactionItemBatch: ITransactionItem[] = [];
  let itemQuantity: { productVariantId: number; quantity: number }[] = [];

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

      const { provider } = detected;

      const headerLookup: Record<string, number> = {};
      headers.forEach((h, idx) => (headerLookup[h] = idx));

      for (const row of rawData) {
        let result: Record<string, any> = {};
        const index = SignatureRules.findIndex(
          (r) =>
            r.provider === detected.provider && r.fileType === detected.fileType
        );

        for (const key of detected.keyColumns) {
          const index = headerLookup[key];
          result[key] = index !== undefined ? (row as any)[key] : null;
        }

        const map = SignatureRules[index]?.normalizedColumns!;
        const normalizedResult: Record<string, any> = {};

        for (const [key, value] of Object.entries(map)) {
          normalizedResult[key] =
            result[value] !== undefined ? result[value] : null;
        }

        const productId =
          productIdFinder(normalizedResult["productName"], provider) || 0;
        const { colorId, sizeId } = variantIdFinder(
          productId,
          normalizedResult["productName"],
          normalizedResult["variation"],
          provider
        );
        const productVariant =
          await productVariantRepository.findByProductIdAndAttributesId(
            productId,
            colorId,
            sizeId
          );
        const quantity = parseInt(normalizedResult["quantity"]) || 1;

        if (productId === 0) {
          console.warn(
            `Product not found: ${normalizedResult["productName"]} from provider ${provider}`
          );
          continue;
        }

        let transaction: ITransaction = {
          orderId: normalizedResult["orderId"].toString(),
          buyer: normalizedResult["buyer"],
          paymentTypeId: lookupPaymentTypeId(normalizedResult["paymentMethod"]),
          shippingPostalCode: normalizedResult["postalCode"],
          platformId: platformMapper(provider).id,
          status:
            normalizedResult["cancelReason"] === ""
              ? statusMapper(normalizedResult["status"], provider)
              : "returned",
          note: normalizedResult["cancelReason"] || "N/A",
        };

        if (provider == "tiktok") {
          transaction.status =
            normalizedResult["cancelReason"] === "Return/Refund"
              ? "returned"
              : statusMapper(normalizedResult["status"], provider);
        }

        const transactionItem = {
          transactionId: 0, // to be filled after transaction is created
          orderId: normalizedResult["orderId"],
          productId: productId,
          productVariantId: productVariant ? productVariant.id : 0,
          quantity: quantity,
        };

        // if orderId exists, update status only
        const existingTransaction =
          await transactionRepository.findTransactionByOrderId(
            transaction.orderId
          );

          if (existingTransaction.length == 0)  console.log('existed',transaction.orderId)
       
        // new transaction
        if (!existingTransaction || existingTransaction.length == 0) {
          const duplicate = transactionBatch.find(
            (t) => t.orderId === transaction.orderId
          );
          if (!duplicate) {
            transactionBatch.push(transaction);
          }

          const duplicateItem = transactionItemBatch.find(
            (ti) =>
              ti.orderId === transactionItem.orderId &&
              ti.productId === transactionItem.productId &&
              ti.productVariantId === transactionItem.productVariantId
          );
          if (!duplicateItem) {
            transactionItemBatch.push(transactionItem);
          } else {
            duplicateItem.quantity += transactionItem.quantity;
          }

          if (transaction.status !== "cancelled") {
            const quantityChange = -quantity;
            const existingItemQuantity = itemQuantity.find(
              (iq) => iq.productVariantId === transactionItem.productVariantId
            );
            if (existingItemQuantity) {
              existingItemQuantity.quantity += quantityChange;
            } else {
              itemQuantity.push({
                productVariantId: transactionItem.productVariantId,
                quantity: quantityChange,
              });
            }
          }
        } else {
          // may need to deduct stock if status changed from 'cancelled' to other status later
          if (existingTransaction[0]?.status !== transaction.status) {
            await transactionRepository.updateTransactionStatus(
              transaction.orderId,
              transaction.status
            );
          }
        }
      }
    }

    // console.log("Transaction Items to be added:", transactionItemBatch);
    // console.log("Prepared Transactions:", transactionBatch);
    // console.log("Item Quantities to be altered:", itemQuantity);

    if (transactionBatch.length === 0) return;

    // bulk insert transactions
    const createdTransaction =
      await transactionRepository.createManyTransactions(transactionBatch);
    if (!createdTransaction) {
      throw new Error("Failed to create transactions");
    }

    // map transactionIds to transaction items then bulk insert
    for (const item of transactionItemBatch) {
      const created = createdTransaction.find(
        (t) => t.orderId === item.orderId
      );
      if (created) {
        item.transactionId = created.insertedId;
        delete item.orderId;
      }
    }
    await transactionRepository.createManyTransactionItems(
      transactionItemBatch
    );

    // alter stock quantity
    for (const iq of itemQuantity) {
      await productVariantRepository.updateQuantityById(
        iq.productVariantId,
        iq.quantity
      );
    }
  } catch (error) {
    console.error("Error processing uploaded transaction files:", error);
    throw error;
  } finally {
    // log the upload
    await dailyUploadLogRepository.updateDailyUploadLog(new Date());
  }
};
// #endregion
