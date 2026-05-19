import User from "../models/User.js";

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const updates = {
    education: req.body.education,
    favoriteSubjects: req.body.favoriteSubjects,
    interests: req.body.interests,
    skills: req.body.skills,
    careerGoal: req.body.careerGoal,
    isProfileCompleted: true
  };

  if (req.body.name) {
    updates.name = req.body.name;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true
  }).select("-password");

  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(updatedUser);
};
