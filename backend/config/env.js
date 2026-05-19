import dotenv from "dotenv";

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_change_me",
  ML_API_URL: process.env.ML_API_URL || "http://localhost:8000/predict",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "*",
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL
};

if (!env.MONGO_URI) {
  throw new Error("MONGO_URI is required in .env");
}

export default env;
