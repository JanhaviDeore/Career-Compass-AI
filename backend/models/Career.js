import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  skills: [String],
  salaryRange: String,
  roadmap: [String]
});

export default mongoose.model("Career", careerSchema);
