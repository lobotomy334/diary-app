import express from "express";
import { loginUser, signupUser, checkUsername, deleteUser } from "../controllers/authController.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/check", checkUsername);
router.delete("/delete", deleteUser);

export default router;