import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import athleteRoutes from "./routes/athletes.js";
import championshipRoutes from "./routes/championships.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/championships", championshipRoutes);

// ✅ serve frontend
app.use(express.static(path.resolve(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});