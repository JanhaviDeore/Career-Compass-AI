import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMe, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);

export default router;
