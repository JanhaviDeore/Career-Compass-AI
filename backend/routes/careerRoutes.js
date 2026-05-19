import express from "express";
import {
  predictCareer,
  getAllCareers,
  getCareerByTitle,
  askCareerAI
} from "../controllers/careerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/predict", authMiddleware, predictCareer);
router.get("/careers", getAllCareers);
router.get("/careers/:title", getCareerByTitle);
router.post("/career-chat", authMiddleware, askCareerAI);

export default router;
