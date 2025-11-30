import type { Request, Response, NextFunction } from "express";
import * as transactionService from "@/services/transactionService"

// #region Transaction
export const getTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await transactionService.getAllTransactions();
        return res.status(200).json({ transactions: results });
    } catch (error) {
        next(error);
    }
}

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.id);
    try {
        const result = await transactionService.getTransactionById(transactionId);
        return res.status(200).json({ transaction: result });
    } catch (error) {
        next(error);
    }
}

export const addTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = req.body;
    try {
        const newTransaction = await transactionService.addTransaction(transaction);
        return res.status(201).json({ transaction: newTransaction });
    } catch (error) {
        next(error);
    }
}

export const editTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.id);
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
    try {
        const items = await transactionService.getTransactionItemsById(transactionId);
        return res.status(200).json({ transactionItems: items });
    } catch (error) {
        next(error);
    }
}

export const addTransactionItem = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.transactionId);
    const { itemId, quantity } = req.body;
    
    try {
        const newTransactionItem = await transactionService.addTransactionItem(transactionId, itemId, quantity);
        return res.status(201).json({ transactionItem: newTransactionItem });
    } catch (error) {
        next(error);
    }
}

export const editTransactionItem = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.transactionId);
    const itemId = Number(req.params.id);
    const quantity = req.body.quantity;
    try {
        const updatedTransactionItem = await transactionService.editTransactionItem(transactionId, itemId, quantity);
        return res.status(200).json({ transactionItem: updatedTransactionItem });
    } catch (error) {
        next(error);
    }
}

export const deleteTransactionItem = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = Number(req.params.transactionId);
    const productId = Number(req.params.id);
    try {
        await transactionService.deleteTransactionItem(transactionId, productId);
        return res.status(200).json({ status: 'resource deleted successfully' });
    } catch (error) {
        next(error);
    }
}