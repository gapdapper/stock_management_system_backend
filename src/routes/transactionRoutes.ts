import *as express from "express";
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
  importTransactions,
} from "@/controllers/transactionController";
import { authenticateUser } from "@/middlewares/authentication";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Transaction Routes
router.get("/", authenticateUser, getTransaction);
router.get("/:id", authenticateUser, getTransactionById);
router.post("/", authenticateUser, addTransaction);
router.patch("/:id", authenticateUser, editTransaction);
router.delete("/:id", authenticateUser, deleteTransaction);

// Transaction Item Routes
router.get("/:transactionId/items", authenticateUser, getTransactionItemsById);
router.post("/:transactionId/items", authenticateUser, addTransactionItem);
router.patch("/:transactionId/items/:id", authenticateUser, editTransactionItem);
router.delete("/:transactionId/items/:id", authenticateUser, deleteTransactionItem);

// Route for importing transactions via spreadsheet
router.post("/import", upload.array('file', 12), importTransactions)

export default router;
