import express from "express";
import cors from "cors";
import careerRoutes from "./routes/careerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import env from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
  })
);

app.use(express.json());

app.use("/api", careerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Career Compass Backend Running");
});

app.use(notFound);
app.use(errorHandler);

export default app;
