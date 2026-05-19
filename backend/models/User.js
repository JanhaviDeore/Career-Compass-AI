import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    // Profile fields
    education: String,
    favoriteSubjects: String,
    interests: String,
    skills: String,
    careerGoal: String,

    // Test + recommendations
    interestScores: {
      logical: Number,
      creative: Number,
      technical: Number,
      social: Number,
      leadership: Number
    },
    testAnswers: Object,
    recommendedCareers: [
      {
        title: String,
        category: String,
        description: String,
        skills: [String],
        salaryRange: String,
        roadmap: [String],
        featureScores: {
          logical: Number,
          creative: Number,
          technical: Number,
          social: Number,
          leadership: Number
        }
      }
    ],
    recommendationExplanation: String,
    lastTestAt: Date,

    isProfileCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
