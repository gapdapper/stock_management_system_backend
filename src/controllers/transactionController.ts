import type { Request, Response, NextFunction } from "express";
import * as transactionService from "@/services/transactionService"

// #region Transaction
export const getTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await transactionService.getTransactions();
        return res.status(200).json({ transactions: results });
    } catch (error) {
        next(error);
    }
}

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.id);
    if (isNaN(transactionId)) {
        return res.status(400).json({ message: 'Invalid transactionId' });
    }
    try {
        const result = await transactionService.getTransactionById(transactionId);
        return res.status(200).json({ transaction: result });
    } catch (error) {
        next(error);
    }
}

export const addTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = req.body;
    if (!transaction) {
        return res.status(400).json({ message: 'Invalid transaction data' });
    }
    try {
        const newTransaction = await transactionService.addTransaction(transaction);
        return res.status(201).json({ transaction: newTransaction });
    } catch (error) {
        next(error);
    }
}

export const editTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.id);
    if (isNaN(transactionId)) {
        return res.status(400).json({ message: 'Invalid transactionId' });
    }
    const transaction = { ...req.body, id: transactionId };
    try {
        const updatedTransaction = await transactionService.editTransaction(transaction);
        return res.status(200).json({ transaction: updatedTransaction });
    } catch (error) {
        next(error);
    }
}

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.id);
    if (isNaN(transactionId)) {
        return res.status(400).json({ message: 'Invalid transactionId' });
    }
    try {
        await transactionService.deleteTransaction(transactionId);
        return res.status(200).json({ status: 'resource deleted successfully' });
    } catch (error) {
        next(error);
    }
}
// #endregion

// #region Transaction Item
export const getTransactionItemsById = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.transactionId);
    if (isNaN(transactionId)) {
        return res.status(400).json({ message: 'Invalid transactionId' });
    }
    try {
        const items = await transactionService.getTransactionItemsById(transactionId);
        return res.status(200).json({ transactionItems: items });
    } catch (error) {
        next(error);
    }
}

export const addTransactionItem = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.transactionId);
    const { itemId, productVariantId, quantity } = req.body;
    if (isNaN(transactionId) || isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid transactionId or itemId' });
    }
    try {
        const newTransactionItem = await transactionService.addTransactionItem(transactionId, itemId, productVariantId, quantity);
        return res.status(201).json({ transactionItem: newTransactionItem });
    } catch (error) {
        next(error);
    }
}

export const editTransactionItem = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.transactionId);
    const itemId = Number(req.params.id);
    const productVariantId = Number(req.body.productVariantId);
    const quantity = req.body.quantity;
    if (isNaN(transactionId) || isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid transactionId or itemId' });
    }
    try {
        const updatedTransactionItem = await transactionService.editTransactionItem(transactionId, itemId, productVariantId, quantity);
        return res.status(200).json({ transactionItem: updatedTransactionItem });
    } catch (error) {
        next(error);
    }
}

export const deleteTransactionItem = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.transactionId);
    const productId = Number(req.params.id);
    const productVariantId = Number(req.body.productVariantId);
    if (isNaN(transactionId) || isNaN(productId)) {
        return res.status(400).json({ message: 'Invalid transactionId or productId' });
    }
    try {
        await transactionService.deleteTransactionItem(transactionId, productId, productVariantId);
        return res.status(200).json({ status: 'resource deleted successfully' });
    } catch (error) {
        next(error);
    }
}
// #endregion

// #region Transaction Upload
export const importTransactions = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    try {
        const result = await transactionService.processImportedTransactionFiles(files);
        res.status(200).json({ result: result });
    } catch (error) {
        next(error);
    }
}