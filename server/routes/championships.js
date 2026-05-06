import express from "express";
import {
  getChampionships,
  createChampionship
} from "../controllers/championships.js";

const router = express.Router();

router.get("/", getChampionships);
router.post("/", createChampionship);

export default router;