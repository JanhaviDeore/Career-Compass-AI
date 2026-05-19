import axios from "axios";
import env from "../config/env.js";

export const callMLModel = async (scores, topK = 3) => {
  try {
    const response = await axios.post(env.ML_API_URL, {
      scores,
      top_k: topK
    });
    return response.data;
  } catch (error) {
    console.error("ML API Error:", error.message);
    throw error;
  }
};
