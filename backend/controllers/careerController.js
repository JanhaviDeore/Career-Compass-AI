import User from "../models/User.js";
import {
  generateCareerList,
  generateCareerDetail,
  generateRecommendations,
  generateCareerChat
} from "../services/groqService.js";

export const predictCareer = async (req, res) => {
  try {
    const { scores, answers } = req.body;

    if (!scores) {
      res.status(400);
      throw new Error("Scores are required");
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const aiResult = await generateRecommendations({
      scores,
      profile: user,
      count: 3
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        interestScores: scores,
        testAnswers: answers || {},
        recommendedCareers: aiResult.careers,
        recommendationExplanation: aiResult.explanation,
        lastTestAt: new Date()
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
      careers: aiResult.careers,
      explanation: aiResult.explanation
    });
  } catch (error) {
    console.error("predictCareer error:", error);
    res.status(500).json({
      success: false,
      message: "Career prediction failed",
      error: error.message
    });
  }
};

export const getAllCareers = async (req, res) => {
  try {
    const careers = await generateCareerList(60);
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: "Unable to load careers data" });
  }
};

export const getCareerByTitle = async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title || "");
    const career = await generateCareerDetail(title);
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: "Unable to load career detail" });
  }
};

export const askCareerAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400);
      throw new Error("Message is required");
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const reply = await generateCareerChat({
      message,
      profile: user,
      scores: user.interestScores
    });

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: "AI chat failed", error: error.message });
  }
};
