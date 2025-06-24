// 📁 backend/routes/ai.js
import express from "express";
import { analyzeSentiment } from "../controllers/aiController.js";

const router = express.Router();

// ❌ 현재 사용되지 않음
router.post("/", analyzeSentiment);

export default router;
