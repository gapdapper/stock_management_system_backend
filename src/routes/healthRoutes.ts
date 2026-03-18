import express from "express";

const router = express.Router();

// Warm up endpoint
router.get("/", async (req, res) => {
  try {
    res.status(200).send("OK");
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).send("Error");
  }
});

export default router;
