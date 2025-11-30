import express from "express";
import {
  addTransaction,
  addTransactionItem,
  deleteTransaction,
  editTransaction,
  getTransaction,
  getTransactionById,
  getTransactionItemsById,
  editTransactionItem,
  deleteTransactionItem,
} from "@/controllers/transactionController";

const router = express.Router();

// Transaction Routes
router.get("/", getTransaction);
router.get("/:id", getTransactionById);
router.post("/", addTransaction);
router.patch("/:id", editTransaction);
router.delete("/:id", deleteTransaction);

// Transaction Item Routes
router.get("/:transactionId/items", getTransactionItemsById);
router.post("/:transactionId/items", addTransactionItem);
router.patch("/:transactionId/items/:id", editTransactionItem);
router.delete("/:transactionId/items/:id", deleteTransactionItem);

export default router;
