import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  const { name, email, password, education } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    education
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    education: user.education,
    favoriteSubjects: user.favoriteSubjects,
    interests: user.interests,
    skills: user.skills,
    careerGoal: user.careerGoal,
    isProfileCompleted: user.isProfileCompleted,
    interestScores: user.interestScores,
    recommendedCareers: user.recommendedCareers,
    recommendationExplanation: user.recommendationExplanation,
    lastTestAt: user.lastTestAt,
    token: generateToken(user._id)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    education: user.education,
    favoriteSubjects: user.favoriteSubjects,
    interests: user.interests,
    skills: user.skills,
    careerGoal: user.careerGoal,
    isProfileCompleted: user.isProfileCompleted,
    interestScores: user.interestScores,
    recommendedCareers: user.recommendedCareers,
    recommendationExplanation: user.recommendationExplanation,
    lastTestAt: user.lastTestAt,
    token: generateToken(user._id)
  });
};
