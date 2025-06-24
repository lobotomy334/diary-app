import express from "express";
import { getDiaries, addDiary, updateDiary, deleteDiary, analyzeEmotion } from "../controllers/diaryController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", verifyToken, getDiaries);
router.post("/", verifyToken, addDiary);
router.put("/:id", verifyToken, updateDiary);
router.delete("/:id", verifyToken, deleteDiary);
router.post("/analyze", verifyToken, analyzeEmotion);

export default router;
