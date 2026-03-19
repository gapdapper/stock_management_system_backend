import * as express from "express";

const router = express.Router();

// Warm up endpoint
router.get("/", (req, res) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.WARMUP_KEY) {
    return res.status(403).send("Forbidden");
  }

  return res.status(200).send("OK");
});

export default router;
