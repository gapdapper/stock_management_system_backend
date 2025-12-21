import express from "express";
import multer from 'multer';
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
  uploadTransactions,
} from "@/controllers/transactionController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Route for uploading transactions via spreadsheet
router.post("/upload", upload.array('file', 12), uploadTransactions)

export default router;
